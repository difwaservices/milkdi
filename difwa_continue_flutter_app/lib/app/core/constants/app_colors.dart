import 'package:flutter/material.dart';

/// Single source of truth for every color used in the app.
/// Never use raw Color() values outside this file.
class AppColors {
  AppColors._();

  // ── Brand ────────────────────────────────────────────────────
  static const Color primary      = Color(0xFF15803D);
  static const Color primaryDark  = Color(0xFF14532D);
  static const Color primaryLight = Color(0xFFBBF7D0);
  static const Color primarySoft  = Color(0xFFF0FDF4); // subtle tint

  static const Color logoPrimary   = Color(0xFF14532D);
  static const Color logoSecondary = Color(0xFF22C55E);

  // ── Surfaces ─────────────────────────────────────────────────
  static const Color white        = Color(0xFFFFFFFF);
  static const Color surface      = Color(0xFFFFFFFF);
  static const Color surfaceAlt   = Color(0xFFF7F8FA); // page bg, header bg
  static const Color scaffoldBg   = Color(0xFFF9FAFB);
  static const Color scaffoldBgAlt= Color(0xFFF5F5F5);
  static const Color cardBg       = Color(0xFFFFFFFF);

  // ── Text ─────────────────────────────────────────────────────
  static const Color textDark     = Color(0xFF0E0E0E); // headings
  static const Color textTitle    = Color(0xFF1A1A1A); // section titles
  static const Color textBody     = Color(0xFF333333); // body copy
  static const Color textMuted    = Color(0xFF666666); // secondary
  static const Color textHint     = Color(0xFFAAAAAA); // placeholders
  static const Color textOnPrimary= Color(0xFFFFFFFF); // text on green bg

  // ── Borders / Dividers ────────────────────────────────────────
  static const Color border       = Color(0xFFE5E7EB);
  static const Color borderLight  = Color(0xFFF3F4F6);
  static const Color divider      = Color(0xFFEEEEEE);

  // ── Status ────────────────────────────────────────────────────
  static const Color error        = Color(0xFFDC2626);
  static const Color errorBg      = Color(0xFFFEF2F2);
  static const Color warning      = Color(0xFFF59E0B);
  static const Color warningBg    = Color(0xFFFFFBEB);
  static const Color success      = Color(0xFF15803D);
  static const Color successBg    = Color(0xFFF0FDF4);
  static const Color info         = Color(0xFF0284C7);
  static const Color infoBg       = Color(0xFFF0F9FF);

  // ── Order statuses ───────────────────────────────────────────
  static const Color orderPending   = Color(0xFFF59E0B);
  static const Color orderAccepted  = Color(0xFF15803D);
  static const Color orderCompleted = Color(0xFF4CAF50);
  static const Color orderCancelled = Color(0xFFDC2626);

  // ── Misc ──────────────────────────────────────────────────────
  static const Color favourite    = Color(0xFFEF4444);
  static const Color black        = Color(0xFF0E0E0E);
  static const Color grey         = Color(0xFF9CA3AF);
  static const Color greyLight    = Color(0xFFE5E7EB);
  static const Color inactive     = Color(0xFFCECECE);
  static const Color badgeOrange  = Color(0xFFFFE0B2);
  static const Color badgeOrangeTxt= Color(0xFFF57C00);
  static const Color shimmerBase  = Color(0xFFE8E8E8);
  static const Color shimmerHigh  = Color(0xFFF5F5F5);

  // ── Gradients ────────────────────────────────────────────────
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF22C55E), Color(0xFF15803D)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient splashGradient = LinearGradient(
    colors: [Color(0xFF14532D), Color(0xFF15803D)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
  static const LinearGradient appBarGradient = LinearGradient(
    colors: [Color(0xFFF8F8F8), Color(0xFFFFFFFF)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ── Backward-compat aliases (do not add new ones) ────────────
  static const Color primary_       = primary;
  static const Color secondary      = primarySoft;
  static const Color buttonBgColor  = primary;
  static const Color buttonTextColor= textOnPrimary;
  static const Color inputField     = primary;
  static const Color cardBgColor    = cardBg;
  static const Color primaryTheme   = primary;
  static const Color primaryColorNew= primaryDark;
  static const Color primaryColor   = primary;
  static const Color softGrey       = scaffoldBg;
  static const Color darkGrey       = textMuted;
  static const Color borderColor    = border;
  static const Color mywhite        = white;
  static const Color myblack        = black;
  static const Color myGreen        = primary;
  static const Color buttonbgColor  = primary;
  static const Color accentBlue     = primary;
  static const Color accent         = primary;
  static const Color primaryButton  = primary;
  static const Color logoprimary    = logoPrimary;
  static const Color logosecondry   = logoSecondary;
  static const Color accentGreen    = primary;
  static const Color red            = error;
  static const Color redColor       = error;
  static const Color green          = primary;
  static const Color cartBlue       = primaryDark;
  static const Color iconBgStart    = Color(0xFF86EFAC);
  static const Color iconBgEnd      = primary;
  static const Color textPrimary    = textDark;
  static const Color textSecondary  = grey;
  static const Color textLink       = primary;
  static const Color textSubtle     = textHint;
  static const Color blackLight     = textTitle;
  static const Color blackLight2    = textTitle;
  static const Color favorite       = favourite;
  static const Color productImageBg = primarySoft;
  static const Color detailsBg      = scaffoldBgAlt;
  static const Color detailsCircleBg= primarySoft;
  static const Color searchBarBg    = scaffoldBgAlt;
  static const Color googleBlue     = Color(0xFF4285F4);
  static const Color googleRed      = Color(0xFFEA4335);
  static const Color googleBorder   = Color(0xFFE0E0E0);

  static const LinearGradient buttonBgGradient = primaryGradient;
  static const LinearGradient iconBg = LinearGradient(
    colors: [Color(0xFF86EFAC), primary],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
