import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_images.dart';
import 'provider/auth_provider.dart';
import '../../data/models/food_models.dart';
import '../../data/services/db_service.dart';
import '../../data/services/fcm_service.dart';
import '../../data/services/socket_service.dart';
import '../../routes/app_routes.dart';

class OtpVerificationPage extends ConsumerStatefulWidget {
  final String phoneNumber;
  final String? otp;

  const OtpVerificationPage({
    super.key,
    required this.phoneNumber,
    this.otp,
  });

  @override
  ConsumerState<OtpVerificationPage> createState() =>
      _OtpVerificationPageState();
}

class _OtpVerificationPageState extends ConsumerState<OtpVerificationPage>
    with TickerProviderStateMixin {
  // ── Controllers & Focus ──────────────────────────────────────────────────
  final List<TextEditingController> _controllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());

  // ── State ────────────────────────────────────────────────────────────────
  int _resendTimer = 30;
  bool _isVerifying = false;
  bool _isSendingOtp = false;
  final int _otpLength = 6;

  // track which box is "filled" for animation
  final List<bool> _filled = List.generate(6, (_) => false);

  // ── Animation Controllers ─────────────────────────────────────────────────
  late AnimationController _fadeCtrl;
  late AnimationController _slideCtrl;
  late AnimationController _shakeCtrl;

  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;
  late Animation<double> _shakeAnim;

  @override
  void initState() {
    super.initState();

    // Page entrance
    _fadeCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600));
    _slideCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 500));
    _shakeCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));

    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));

    _shakeAnim = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0, end: -10), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -10, end: 10), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 10, end: -8), weight: 2),
      TweenSequenceItem(tween: Tween(begin: -8, end: 8), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 8, end: 0), weight: 1),
    ]).animate(CurvedAnimation(parent: _shakeCtrl, curve: Curves.easeInOut));

    _fadeCtrl.forward();
    _slideCtrl.forward();

    _startTimer();

    // Show test OTP
    if (widget.otp != null && widget.otp!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showSnackBar('Test OTP: ${widget.otp}',
            backgroundColor: const Color(0xFF15803D));
      });
    }

    // Setup focus nodes with key event listeners for backspace support
    for (int i = 0; i < _otpLength; i++) {
      _focusNodes[i].onKeyEvent = (node, event) => _handleKeyEvent(i, event)
          ? KeyEventResult.handled
          : KeyEventResult.ignored;
    }
  }

  // ── Paste / Clipboard detection ──────────────────────────────────────────
  /// Called automatically when field 0 gains focus, and also via paste gesture.
  Future<void> _checkClipboard() async {
    try {
      final data = await Clipboard.getData(Clipboard.kTextPlain);
      final text = data?.text?.trim() ?? '';
      final digits = text.replaceAll(RegExp(r'\D'), '');
      if (digits.length == _otpLength) {
        _fillOtp(digits);
      } else if (digits.isNotEmpty && digits.length < _otpLength) {
        // Option to help if user has a partial code
        _fillOtp(digits);
      }
    } catch (e) {
      debugPrint('Error checking clipboard: $e');
    }
  }

  void _fillOtp(String digits) {
    if (!mounted) return;
    
    // Clear all first to be sure
    for (var c in _controllers) {
      c.clear();
    }

    final len = digits.length > _otpLength ? _otpLength : digits.length;
    for (int i = 0; i < len; i++) {
      _controllers[i].text = digits[i];
      _filled[i] = true;
    }
    
    setState(() {});

    if (len == _otpLength) {
      _focusNodes[_otpLength - 1].unfocus();
      // Auto-verify after brief delay so user can see the fill
      Future.delayed(const Duration(milliseconds: 400), () {
        if (mounted) _verifyOtp();
      });
    } else {
      _focusNodes[len.clamp(0, _otpLength - 1)].requestFocus();
    }
  }

  // ── onChanged handler ────────────────────────────────────────────────────
  void _onDigitChanged(int index, String value) {
    // If user deleted the character
    if (value.isEmpty) {
      if (_filled[index]) {
        setState(() => _filled[index] = false);
      }
      if (index > 0) {
        _focusNodes[index - 1].requestFocus();
      }
      return;
    }

    // Handle paste: if more than 1 character was typed/pasted
    if (value.length > 1) {
      final digits = value.replaceAll(RegExp(r'\D'), '');
      if (digits.isEmpty) {
        _controllers[index].clear();
        return;
      }

      // If it's a full code, start from index 0 regardless of where they pasted
      if (digits.length == _otpLength) {
        _fillOtp(digits);
        return;
      }

      // Partial paste: fill from this index onwards
      int digitIdx = 0;
      for (int i = index; i < _otpLength && digitIdx < digits.length; i++) {
        _controllers[i].text = digits[digitIdx];
        _filled[i] = true;
        digitIdx++;
      }
      
      setState(() {});

      final nextFocus = (index + digits.length).clamp(0, _otpLength - 1);
      _focusNodes[nextFocus].requestFocus();
      
      // If we filled till the end, auto verify
      if (nextFocus == _otpLength - 1 && _controllers[nextFocus].text.isNotEmpty) {
        Future.delayed(const Duration(milliseconds: 300), () {
          if (mounted) _verifyOtp();
        });
      }
      return;
    }

    // Normal single digit entry
    if (value.isNotEmpty) {
      if (!_filled[index]) {
        setState(() => _filled[index] = true);
      }
      
      if (index < _otpLength - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
        // Auto-verify on last digit
        Future.delayed(const Duration(milliseconds: 300), () {
          if (mounted) _verifyOtp();
        });
      }
    }
  }

  // ── Backspace key handler ────────────────────────────────────────────────
  bool _handleKeyEvent(int index, KeyEvent event) {
    if (event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.backspace) {
      // If current field is empty, move back and clear previous
      if (_controllers[index].text.isEmpty && index > 0) {
        _controllers[index - 1].clear();
        setState(() => _filled[index - 1] = false);
        _focusNodes[index - 1].requestFocus();
        return true;
      }
    }
    return false;
  }

  // ── Timer ─────────────────────────────────────────────────────────────────
  void _startTimer() {
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted && _resendTimer > 0) {
        setState(() => _resendTimer--);
        _startTimer();
      }
    });
  }

  // ── Network actions ───────────────────────────────────────────────────────
  Future<void> _sendOtp() async {
    if (_isSendingOtp) return;
    setState(() => _isSendingOtp = true);
    try {
      await ref
          .read(authProvider.notifier)
          .sendOtp(phoneNumber: widget.phoneNumber);
    } catch (_) {}
    
    if (!mounted) return;
    setState(() {
      _isSendingOtp = false;
      _resendTimer = 30;
    });
    _startTimer();
  }

  Future<void> _verifyOtp() async {
    if (_isVerifying) return;
    
    final otp = _controllers.map((c) => c.text).join();
    if (otp.length < _otpLength) {
      _shakeCtrl.forward(from: 0);
      _showSnackBar('Please enter the complete 6-digit OTP.',
          backgroundColor: Colors.orange.shade700);
      return;
    }
    
    setState(() => _isVerifying = true);
    try {
      await ref.read(authProvider.notifier).verifyOtp(
            phoneNumber: widget.phoneNumber,
            otp: otp,
          );
    } catch (e) {
      if (mounted) {
        _showSnackBar(e.toString(), backgroundColor: Colors.red);
      }
    } finally {
      if (mounted) {
        setState(() => _isVerifying = false);
      }
    }
  }

  void _showSnackBar(String message, {Color backgroundColor = Colors.black87}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, 
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(20),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    _slideCtrl.dispose();
    _shakeCtrl.dispose();
    for (var c in _controllers) {
      c.dispose();
    }
    for (var n in _focusNodes) {
      n.dispose();
    }
    super.dispose();
  }

  // ── Build ─────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    ref.listen<ProviderAuthState>(authProvider, (previous, next) {
      if (next is AuthOtpSent && next.otp != null) {
        _showSnackBar('New OTP: ${next.otp}',
            backgroundColor: const Color(0xFF15803D));
      } else if (next is AuthAuthenticated) {
        final role = (next.user.role).toLowerCase();

        try {
          final cartProvider = CartProviderScope.of(context);
          cartProvider.updateUserProfile(
            UserProfile(
              name: next.user.fullName,
              email: next.user.email,
              phone: next.user.phoneNumber,
              profileImage: AppImages.defaultAvatar,
            ),
          );
          cartProvider.syncLocalCartToServer();
          cartProvider.syncOrders();
          cartProvider.syncWallet();
          cartProvider.loadAddresses();
        } catch (_) {}

        if (role.contains('rider') ||
            role.contains('delivery') ||
            role.contains('driver') ||
            role.contains('staff')) {
          Navigator.pushNamedAndRemoveUntil(
              context, AppRoutes.riderHome, (r) => false);
        } else {
          Navigator.pushNamedAndRemoveUntil(
              context, AppRoutes.home, (r) => false);
        }
      } else if (next is AuthError) {
        if (mounted) {
          _shakeCtrl.forward(from: 0);
          _showSnackBar(next.message, backgroundColor: Colors.red);
        }
      }
    });

    return Scaffold(
      backgroundColor: const Color(0xFFE0F7FA),
      body: SafeArea(
        bottom: false,
        child: FadeTransition(
          opacity: _fadeAnim,
          child: SlideTransition(
            position: _slideAnim,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                children: [
                  // ── Back button ───────────────────────────────────────────
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 16),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.5),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.arrow_back,
                              color: Color(0xFF15803D),
                              size: 24,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // ── White card ────────────────────────────────────────────
                  Container(
                    width: double.infinity,
                    constraints: BoxConstraints(
                      minHeight: MediaQuery.of(context).size.height - 100,
                    ),
                    padding: const EdgeInsets.fromLTRB(28, 40, 28, 40),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(40),
                        topRight: Radius.circular(40),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Key icon
                        TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0.6, end: 1.0),
                          duration: const Duration(milliseconds: 500),
                          curve: Curves.elasticOut,
                          builder: (context, scale, child) =>
                              Transform.scale(scale: scale, child: child),
                          child: Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEDF8FA),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: const Icon(
                              Icons.vpn_key_outlined,
                              size: 44,
                              color: Color(0xFF15803D),
                            ),
                          ),
                        ),
                        const SizedBox(height: 32),

                        const Text(
                          'Enter 6-Digit Code',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 12),
                        RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                            text: 'Code has been sent to \n',
                            style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF64748B),
                                height: 1.5),
                            children: [
                              TextSpan(
                                text: widget.phoneNumber,
                                style: const TextStyle(
                                  color: Color(0xFF15803D),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Paste hint
                        GestureDetector(
                          onTap: _checkClipboard,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEDF8FA),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                  color: const Color(0xFF15803D)
                                      .withValues(alpha: 0.3)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: const [
                                Icon(Icons.content_paste_rounded,
                                    size: 14, color: Color(0xFF15803D)),
                                SizedBox(width: 6),
                                Text(
                                  'Tap to paste OTP',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF15803D),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        const SizedBox(height: 36),

                        // ── OTP boxes ────────────────────────────────────────
                        if (_isSendingOtp)
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 20),
                            child: CircularProgressIndicator(
                                color: Color(0xFF15803D)),
                          )
                        else
                          AnimatedBuilder(
                            animation: _shakeAnim,
                            builder: (context, child) => Transform.translate(
                              offset: Offset(_shakeAnim.value, 0),
                              child: child,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(_otpLength, (i) {
                                return AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  curve: Curves.easeOut,
                                  margin:
                                      const EdgeInsets.symmetric(horizontal: 5),
                                  width: 48,
                                  height: 56,
                                  decoration: BoxDecoration(
                                    color: _filled[i]
                                        ? const Color(0xFF15803D)
                                            .withValues(alpha: 0.12)
                                        : const Color(0xFFEDF8FA),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: _filled[i]
                                          ? const Color(0xFF15803D)
                                          : Colors.transparent,
                                      width: 2,
                                    ),
                                    boxShadow: _filled[i]
                                        ? [
                                            BoxShadow(
                                              color: const Color(0xFF15803D)
                                                  .withValues(alpha: 0.15),
                                              blurRadius: 8,
                                              offset: const Offset(0, 3),
                                            )
                                          ]
                                        : [],
                                  ),
                                  child: Center(
                                    child: TextField(
                                      controller: _controllers[i],
                                      focusNode: _focusNodes[i],
                                      keyboardType: TextInputType.number,
                                      inputFormatters: [
                                        FilteringTextInputFormatter.digitsOnly,
                                      ],
                                      textAlign: TextAlign.center,
                                      textAlignVertical:
                                          TextAlignVertical.center,
                                      maxLength: 1,
                                      style: TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        color: _filled[i]
                                            ? const Color(0xFF15803D)
                                            : const Color(0xFF1E293B),
                                      ),
                                      decoration: InputDecoration(
                                        counterText: '',
                                        contentPadding: EdgeInsets.zero,
                                        enabledBorder: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(16),
                                          borderSide: const BorderSide(
                                              color: Colors.transparent,
                                              width: 0),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(16),
                                          borderSide: const BorderSide(
                                              color: Colors.transparent,
                                              width: 0),
                                        ),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(16),
                                          borderSide: BorderSide.none,
                                        ),
                                      ),
                                      onChanged: (v) =>
                                          _onDigitChanged(i, v),
                                    ),
                                  ),
                                );
                              }),
                            ),
                          ),

                        const SizedBox(height: 40),

                        // ── Resend timer ──────────────────────────────────────
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _resendTimer > 0
                                  ? 'Resend code in '
                                  : "Didn't receive the code? ",
                              style: const TextStyle(
                                  color: Color(0xFF64748B), fontSize: 13),
                            ),
                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 300),
                              child: GestureDetector(
                                key: ValueKey(_resendTimer),
                                onTap: (_isSendingOtp || _resendTimer > 0)
                                    ? null
                                    : _sendOtp,
                                child: Text(
                                  _resendTimer > 0
                                      ? '00:${_resendTimer.toString().padLeft(2, '0')}'
                                      : 'Resend Now',
                                  style: TextStyle(
                                    color: (_isSendingOtp || _resendTimer > 0)
                                        ? const Color(0xFF94A3B8)
                                        : const Color(0xFF15803D),
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 48),

                        // ── Verify button ─────────────────────────────────────
                        AnimatedScale(
                          scale: _isVerifying ? 0.97 : 1.0,
                          duration: const Duration(milliseconds: 150),
                          child: GestureDetector(
                            onTap: _isVerifying ? null : _verifyOtp,
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: double.infinity,
                              height: 56,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(30),
                                gradient: LinearGradient(
                                  colors: _isVerifying
                                      ? [
                                          const Color(0xFF006064)
                                              .withValues(alpha: 0.6),
                                          const Color(0xFF00ACC1)
                                              .withValues(alpha: 0.6)
                                        ]
                                      : [
                                          const Color(0xFF006064),
                                          const Color(0xFF00ACC1)
                                        ],
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                ),
                                boxShadow: _isVerifying
                                    ? []
                                    : [
                                        BoxShadow(
                                          color: const Color(0xFF00ACC1)
                                              .withValues(alpha: 0.35),
                                          blurRadius: 16,
                                          spreadRadius: 1,
                                          offset: const Offset(0, 6),
                                        ),
                                      ],
                              ),
                              child: Center(
                                child: _isVerifying
                                    ? const SizedBox(
                                        height: 24,
                                        width: 24,
                                        child: CircularProgressIndicator(
                                            color: Colors.white,
                                            strokeWidth: 2.5),
                                      )
                                    : const Text(
                                        'Verify & Proceed',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 32),

                        const Text(
                          'By proceeding, you agree to our Terms of Service\nand Privacy Policy.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFF94A3B8),
                              height: 1.5),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
