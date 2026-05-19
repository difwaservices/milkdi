import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/theme/text_styles.dart';
import '../core/theme/theme_constants.dart';

enum AppButtonVariant { primary, secondary, outline, ghost }

/// Reusable button — use variant to switch between styles.
/// All sizing, color, and radius come from design-system tokens.
class CommonButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final AppButtonVariant variant;
  final Widget? icon;
  final bool isLoading;
  final bool fullWidth;
  final double? height;

  const CommonButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.fullWidth = true,
    this.height,
  });

  // ── Convenience constructors ──────────────────────────────────
  const CommonButton.secondary({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
    this.fullWidth = true,
    this.height,
  }) : variant = AppButtonVariant.secondary;

  const CommonButton.outline({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
    this.fullWidth = true,
    this.height,
  }) : variant = AppButtonVariant.outline;

  @override
  Widget build(BuildContext context) {
    final h = height ?? 54.0;

    Widget label = isLoading
        ? SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(
              strokeWidth: 2.5,
              color: _fgColor,
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                icon!,
                AppSpacing.wSm,
              ],
              Text(text, style: AppText.button.copyWith(color: _fgColor)),
            ],
          );

    Widget btn;
    switch (variant) {
      case AppButtonVariant.outline:
        btn = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.primary,
            side: const BorderSide(color: AppColors.primary, width: 1.5),
            shape: const RoundedRectangleBorder(borderRadius: AppRadius.button),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            minimumSize: Size(0, h),
          ),
          child: label,
        );
        break;
      case AppButtonVariant.ghost:
        btn = TextButton(
          onPressed: isLoading ? null : onPressed,
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            shape: const RoundedRectangleBorder(borderRadius: AppRadius.button),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            minimumSize: Size(0, h),
          ),
          child: label,
        );
        break;
      default:
        btn = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: _bgColor,
            foregroundColor: _fgColor,
            elevation: variant == AppButtonVariant.secondary ? 0 : 0,
            shape: const RoundedRectangleBorder(borderRadius: AppRadius.button),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            minimumSize: Size(0, h),
          ),
          child: label,
        );
    }

    return fullWidth ? SizedBox(width: double.infinity, child: btn) : btn;
  }

  Color get _bgColor {
    switch (variant) {
      case AppButtonVariant.secondary:
        return AppColors.primarySoft;
      default:
        return AppColors.primary;
    }
  }

  Color get _fgColor {
    switch (variant) {
      case AppButtonVariant.secondary:
        return AppColors.primary;
      case AppButtonVariant.outline:
      case AppButtonVariant.ghost:
        return AppColors.primary;
      default:
        return AppColors.textOnPrimary;
    }
  }
}
