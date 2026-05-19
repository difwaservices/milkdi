import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';

class PaymentService {
  final ApiClient _apiClient;
  late Razorpay _razorpay;

  PaymentService(this._apiClient) {
    _razorpay = Razorpay();
  }

  void init({
    required Function(PaymentSuccessResponse) onSuccess,
    required Function(PaymentFailureResponse) onFailure,
    required Function(ExternalWalletResponse) onExternalWallet,
  }) {
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, onSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, onFailure);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, onExternalWallet);
  }

  Future<void> openCheckout({
    required double amount,
    required String contact,
    required String email,
  }) async {
    try {
      final keyId = dotenv.env['RAZORPAY_KEY_ID'] ?? '';
      if (keyId.isEmpty) throw Exception('Razorpay key not configured');

      if (kDebugMode) {
        debugPrint('PaymentService: Starting checkout, amount=$amount, key=${keyId.substring(0, 8)}...');
      }

      final orderResponse = await _apiClient.post(
        '${ApiClient.paymentBaseUrl}/create-order',
        data: {'amount': amount},
        requiresAuth: true,
      );

      String? orderId;
      if (orderResponse is Map) {
        if (orderResponse.containsKey('order') && orderResponse['order'] is Map) {
          orderId = orderResponse['order']['id']?.toString();
        } else if (orderResponse.containsKey('id')) {
          orderId = orderResponse['id']?.toString();
        } else if (orderResponse.containsKey('data') && orderResponse['data'] is Map) {
          orderId = orderResponse['data']['id']?.toString();
        } else if (orderResponse.containsKey('razorpayOrderId')) {
          orderId = orderResponse['razorpayOrderId']?.toString();
        }
      }

      if (orderId == null || orderId.isEmpty) {
        throw Exception('Could not create payment order. Please try again.');
      }

      var options = {
        'key': keyId,
        'amount': (amount * 100).toInt(),
        'name': 'Milkdi',
        'order_id': orderId,
        'description': 'Wallet Top-up',
        'prefill': {
          if (contact.isNotEmpty) 'contact': contact,
          if (email.isNotEmpty) 'email': email,
        },
        'external': {
          'wallets': ['paytm']
        }
      };

      _razorpay.open(options);
    } catch (e) {
      if (kDebugMode) debugPrint('PaymentService ERROR: $e');
      rethrow;
    }
  }

  void dispose() {
    _razorpay.clear();
  }
}

final paymentServiceProvider = Provider<PaymentService>((ref) {
  return PaymentService(
    ref.watch(apiClientProvider),
  );
});
