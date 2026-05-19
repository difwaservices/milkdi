import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/state/auth_store.dart';
import '../../routes/app_routes.dart';
import '../../core/constants/app_images.dart';

class SplashPage extends ConsumerStatefulWidget {
  const SplashPage({super.key});

  @override
  ConsumerState<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends ConsumerState<SplashPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _fadeAnim = CurvedAnimation(parent: _controller, curve: Curves.easeIn);
    _scaleAnim = Tween<double>(
      begin: 0.8,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));

    _controller.forward();

    // ── INITIAL AUTH CHECK ──
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // 1. Give animations a moment to start
    await Future.delayed(const Duration(milliseconds: 1200));

    // 2. Perform initialization check via AuthStore
    await ref.read(authStoreProvider.notifier).init();

    if (!mounted) return;

    // 3. Decide navigation based on Auth status
    final authState = ref.read(authStoreProvider);

    if (authState is AuthAuthenticated) {
      final role = (authState.user.role).toLowerCase();

      if (role.contains('rider') ||
          role.contains('delivery') ||
          role.contains('driver') ||
          role.contains('staff')) {
        Navigator.pushReplacementNamed(context, AppRoutes.riderHome);
      } else {
        Navigator.pushReplacementNamed(context, AppRoutes.home);
      }
    } else {
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: ScaleTransition(
            scale: _scaleAnim,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  AppImages.difwaLogoPng,
                  width: 300,
                  height: 300,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 40),
                // ── SUBTLE PROGRESS ──
                const CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF15803D)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
