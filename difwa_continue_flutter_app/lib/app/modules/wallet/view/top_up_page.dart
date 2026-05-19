import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../data/services/payment_service.dart';
import '../../../data/services/wallet_service.dart';
import '../../../data/services/db_service.dart';
import '../../../core/constants/app_colors.dart';

class TopUpPage extends ConsumerStatefulWidget {
  const TopUpPage({super.key});

  @override
  ConsumerState<TopUpPage> createState() => _TopUpPageState();
}

class _TopUpPageState extends ConsumerState<TopUpPage> {
  final TextEditingController _amountController = TextEditingController();
  bool _isLoading = false;
  // Cache service so we can call dispose() without using ref after unmount
  late PaymentService _paymentService;
  // Cache messenger — Razorpay callbacks fire from native threads AFTER widget
  // may have unmounted. Never call ScaffoldMessenger.of(context) inside them.
  ScaffoldMessengerState? _messenger;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Safe to cache here — called every time dependencies change
    _messenger = ScaffoldMessenger.of(context);
  }

  @override
  void initState() {
    super.initState();
    _paymentService = ref.read(paymentServiceProvider);
    _paymentService.init(
      onSuccess: _handlePaymentSuccess,
      onFailure: _handlePaymentFailure,
      onExternalWallet: _handleExternalWallet,
    );
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    debugPrint('TopUpPage: Payment SUCCESS: ID=${response.paymentId}, OrderID=${response.orderId}');
    setState(() => _isLoading = true);
    final amount = double.tryParse(_amountController.text) ?? 0.0;
    
    debugPrint('TopUpPage: Verifying payment with backend (amount: $amount)...');
    final result = await ref.read(walletServiceProvider).topUpSuccess(
          amount: amount,
          razorpayOrderId: response.orderId!,
          razorpayPaymentId: response.paymentId!,
          razorpaySignature: response.signature!,
        );

    debugPrint('TopUpPage: Verification result: $result');

    if (mounted) {
      setState(() => _isLoading = false);
      if (result['success'] == true) {
        CartProviderScope.of(context).syncWallet();
        ref.invalidate(walletBalanceProvider);
        ref.invalidate(walletHistoryProvider);
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Wallet topped up successfully!'),
              backgroundColor: Color(0xFF15803D)),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(result['message'] ?? 'Verification failed'),
              backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _handlePaymentFailure(PaymentFailureResponse response) {
    debugPrint('TopUpPage: Payment FAILED: Code=${response.code}, Message=${response.message}');
    // Use cached messenger — widget may already be unmounted at this point
    if (!mounted) return;
    _messenger?.showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.white, size: 18),
            SizedBox(width: 10),
            Expanded(child: Text('Payment was not completed. Please try again.')),
          ],
        ),
        backgroundColor: AppColors.error,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    debugPrint('TopUpPage: External Wallet selected: ${response.walletName}');
    // Use cached messenger — safe after native callback
    if (!mounted) return;
    _messenger?.showSnackBar(
      SnackBar(
          content: Text('External Wallet: ${response.walletName}'),
          backgroundColor: const Color(0xFF15803D)),
    );
  }

  @override
  void dispose() {
    _amountController.dispose();
    _paymentService.dispose(); // use cached ref — safe after unmount
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final profile = CartProviderScope.of(context).userProfile;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Top Up Wallet',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primaryDark,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Enter Amount',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primaryDark),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryDark),
                hintText: '0',
                focusedBorder: UnderlineInputBorder(
                    borderSide:
                        BorderSide(color: AppColors.primaryDark, width: 2)),
              ),
            ),
            const SizedBox(height: 24),
            Wrap(
              spacing: 12,
              children: [500, 1000, 2000, 5000]
                  .map((amt) => ActionChip(
                        label: Text('₹$amt'),
                        onPressed: () => setState(
                            () => _amountController.text = amt.toString()),
                        backgroundColor: AppColors.scaffoldBg,
                      ))
                  .toList(),
            ),
            const SizedBox(height: 48),
            _isLoading
                ? const Center(
                    child:
                        CircularProgressIndicator(color: AppColors.accentGreen))
                : ElevatedButton(
                    onPressed: () async {
                      final amount =
                          double.tryParse(_amountController.text) ?? 0.0;
                      if (amount < 100) {
                        ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Minimum top-up is ₹100')));
                        return;
                      }
                      final messenger = ScaffoldMessenger.of(context);
                      try {
                        await _paymentService.openCheckout(
                          amount: amount,
                          contact: profile.phone,
                          email: profile.email,
                        );
                      } catch (e) {
                        messenger.showSnackBar(SnackBar(
                          content: const Row(
                            children: [
                              Icon(Icons.error_outline, color: Colors.white, size: 18),
                              SizedBox(width: 10),
                              Expanded(child: Text('Could not open payment. Please try again.')),
                            ],
                          ),
                          backgroundColor: AppColors.error,
                          behavior: SnackBarBehavior.floating,
                          margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ));
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryDark,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 56),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('Proceed to Payment',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
          ],
        ),
      ),
    );
  }
}
