import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:difwawaterapp/core/state/auth_store.dart';
import 'package:difwawaterapp/app/routes/app_routes.dart';
import 'package:difwawaterapp/app/core/constants/app_colors.dart';

class AuthHelper {
  /// Polite authentication check.
  /// Returns [true] if authenticated.
  /// If not, shows a polite snackbar and can optionally navigate.
  static bool checkAuth({
    required BuildContext context,
    required WidgetRef ref,
    String message = "Please log in to access this feature.",
    bool showLoginPrompt = true,
  }) {
    final isAuth = ref.read(isAuthenticatedProvider);
    if (isAuth) return true;

    if (showLoginPrompt) {
      _showPoliteSnackbar(context, message);
    }
    
    return false;
  }

  static void _showPoliteSnackbar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.lock_person_rounded, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        ),
        action: SnackBarAction(
          label: 'LOGIN',
          textColor: Colors.amber,
          onPressed: () {
            Navigator.pushNamed(context, AppRoutes.login);
          },
        ),
        backgroundColor: AppColors.primaryDark,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  /// Shows a polite "Login Required" placeholder widget for unauthorized tabs.
  static Widget loginRequiredPlaceholder({
    required BuildContext context,
    required String featureName,
    required String description,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.lock_outline_rounded, 
                  size: 64, color: AppColors.primary),
            ),
            const SizedBox(height: 24),
            Text(
              'Login for $featureName',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              description,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, AppRoutes.login),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Login',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            TextButton(
              onPressed: () => Navigator.pushNamedAndRemoveUntil(
                context, AppRoutes.home, (route) => false),
              child: const Text('Maybe Later'),
            ),
          ],
        ),
      ),
    );
  }
}
