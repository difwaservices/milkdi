import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/core/theme/app_theme.dart';
import 'app/modules/main/view/main_view.dart';
import 'app/modules/auth/view/login_view.dart';
import 'app/modules/auth/controller/auth_controller.dart';

import 'package:firebase_core/firebase_core.dart';
import 'app/core/notifications/notification_manager.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  await NotificationManager.initialize();
  
  runApp(
    const ProviderScope(
      child: VendorApp(),
    ),
  );
}

class VendorApp extends ConsumerWidget {
  const VendorApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);

    return MaterialApp(
      title: 'Difwa Vendor',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: _getHomeRoute(authState),
    );
  }

  Widget _getHomeRoute(AuthState state) {
    switch (state.status) {
      case AuthStatus.loading:
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
      case AuthStatus.authenticated:
        return const MainView();
      case AuthStatus.unauthenticated:
      case AuthStatus.error:
        return const LoginView();
      default:
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
    }
  }
}
