import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

// ── Spacing ──────────────────────────────────────────────────────────────────
/// Use AppSpacing.xx instead of hardcoded numbers everywhere.
class AppSpacing {
  AppSpacing._();

  static const double xs  = 4;
  static const double sm  = 8;
  static const double md  = 16;
  static const double lg  = 24;
  static const double xl  = 32;
  static const double xxl = 48;

  // Semantic page-level values
  static const double pagePadding     = 20;
  static const double sectionGap      = 28;
  static const double cardPadding     = 16;
  static const double iconTextGap     = 8;

  // Pre-built gap widgets
  static const Widget hXs = SizedBox(height: xs);
  static const Widget hSm = SizedBox(height: sm);
  static const Widget hMd = SizedBox(height: md);
  static const Widget hLg = SizedBox(height: lg);
  static const Widget hXl = SizedBox(height: xl);

  static const Widget wXs = SizedBox(width: xs);
  static const Widget wSm = SizedBox(width: sm);
  static const Widget wMd = SizedBox(width: md);
  static const Widget wLg = SizedBox(width: lg);
}

// ── Radius ───────────────────────────────────────────────────────────────────
class AppRadius {
  AppRadius._();

  static const double xs   = 4;
  static const double sm   = 8;
  static const double md   = 12;
  static const double lg   = 16;
  static const double xl   = 20;
  static const double xxl  = 28;
  static const double full = 999;

  static const BorderRadius card   = BorderRadius.all(Radius.circular(lg));
  static const BorderRadius button = BorderRadius.all(Radius.circular(md));
  static const BorderRadius input  = BorderRadius.all(Radius.circular(md));
  static const BorderRadius chip   = BorderRadius.all(Radius.circular(full));
  static const BorderRadius badge  = BorderRadius.all(Radius.circular(sm));
  static const BorderRadius dialog = BorderRadius.all(Radius.circular(xl));
  static const BorderRadius sheet  = BorderRadius.vertical(top: Radius.circular(xxl));
  static const BorderRadius imgTop = BorderRadius.vertical(top: Radius.circular(lg));
}

// ── Shadows ──────────────────────────────────────────────────────────────────
class AppShadows {
  AppShadows._();

  static List<BoxShadow> get card => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.06),
          blurRadius: 12,
          offset: const Offset(0, 4),
        ),
      ];

  static List<BoxShadow> get elevated => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.10),
          blurRadius: 20,
          offset: const Offset(0, 6),
        ),
      ];

  static List<BoxShadow> get subtle => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.04),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
      ];

  static List<BoxShadow> get primary => [
        BoxShadow(
          color: AppColors.primary.withValues(alpha: 0.22),
          blurRadius: 14,
          offset: const Offset(0, 5),
        ),
      ];
}

// ── Durations ────────────────────────────────────────────────────────────────
class AppDuration {
  AppDuration._();
  static const Duration fast   = Duration(milliseconds: 200);
  static const Duration normal = Duration(milliseconds: 350);
  static const Duration slow   = Duration(milliseconds: 600);
}

// ── Legacy alias ─────────────────────────────────────────────────────────────
class ThemeConstants {
  ThemeConstants._();
  static const String primaryFont           = 'Nexa';
  static const double defaultPadding        = AppSpacing.md;
  static const BorderRadius defaultBorderRadius = AppRadius.input;
}
