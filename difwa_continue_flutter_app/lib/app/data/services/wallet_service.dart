import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';
import '../models/food_models.dart';

class WalletService {
  final ApiClient _apiClient;

  WalletService(this._apiClient);

  Future<Map<String, dynamic>> getBalance() async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.walletBaseUrl}/balance',
        requiresAuth: true,
      );
      return {
        'success': response['success'] ?? true,
        'balance': response['balance'] ?? 0.0,
      };
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<List<dynamic>> getTransactionHistory() async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.walletBaseUrl}/history',
        requiresAuth: true,
      );
      return response['data'] ?? [];
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, dynamic>> topUpSuccess({
    required double amount,
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  }) async {
    try {
      final response = await _apiClient.post(
        '${ApiClient.walletBaseUrl}/topup-success',
        data: {
          'amount': amount,
          'razorpayOrderId': razorpayOrderId,
          'razorpayPaymentId': razorpayPaymentId,
          'razorpaySignature': razorpaySignature,
        },
        requiresAuth: true,
      );
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }
}

final walletServiceProvider = Provider<WalletService>((ref) {
  return WalletService(ref.watch(apiClientProvider));
});

final walletBalanceProvider = FutureProvider.autoDispose<double>((ref) async {
  // keepAlive prevents re-fetching every time user switches tabs.
  // Data stays cached for the session; manual refresh still works via invalidate().
  ref.keepAlive();
  final result = await ref.read(walletServiceProvider).getBalance();
  return (result['balance'] as num?)?.toDouble() ?? 0.0;
});

final walletHistoryProvider =
    FutureProvider.autoDispose<List<dynamic>>((ref) async {
  // keepAlive prevents re-fetching on every tab switch.
  ref.keepAlive();
  return ref.read(walletServiceProvider).getTransactionHistory();
});

final walletTransactionsProvider =
    FutureProvider.autoDispose<List<WalletTransaction>>((ref) async {
  // keepAlive prevents re-fetching on every tab switch.
  ref.keepAlive();
  final rawData = await ref.watch(walletHistoryProvider.future);
  return rawData.map((json) => WalletTransaction.fromJson(json)).toList();
});
