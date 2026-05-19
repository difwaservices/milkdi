import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

/// Semantic text style tokens — every text style in the app must come from here.
/// Never use raw TextStyle() with hardcoded fontSize/color outside this file.
///
/// Scale: display → h1 → h2 → h3 → titleLg/Md/Sm → bodyLg/Md/Sm → labelLg/Md/Sm
///
/// Color variants: call .copyWith(color: AppColors.xxx) on any token.
class AppText {
  AppText._();

  static const String _font = 'Nexa';

  // ── Display (hero numbers, splash) ───────────────────────────
  static TextStyle get display => GoogleFonts.poppins(
        fontSize: 36, fontWeight: FontWeight.w900,
        color: AppColors.textDark, height: 1.1, letterSpacing: -1.0);

  // ── Headlines ────────────────────────────────────────────────
  static TextStyle get h1 => GoogleFonts.poppins(
        fontSize: 28, fontWeight: FontWeight.w800,
        color: AppColors.textDark, height: 1.2);

  static TextStyle get h2 => GoogleFonts.poppins(
        fontSize: 24, fontWeight: FontWeight.w700,
        color: AppColors.textDark, height: 1.25);

  static TextStyle get h3 => GoogleFonts.poppins(
        fontSize: 20, fontWeight: FontWeight.w700,
        color: AppColors.textDark, height: 1.3);

  // ── Titles ───────────────────────────────────────────────────
  static TextStyle get titleLg => GoogleFonts.poppins(
        fontSize: 18, fontWeight: FontWeight.w700,
        color: AppColors.textDark);

  static TextStyle get titleMd => GoogleFonts.poppins(
        fontSize: 16, fontWeight: FontWeight.w700,
        color: AppColors.textDark);

  static TextStyle get titleSm => GoogleFonts.poppins(
        fontSize: 15, fontWeight: FontWeight.w600,
        color: AppColors.textDark);

  // ── Body ─────────────────────────────────────────────────────
  static TextStyle get bodyLg => GoogleFonts.poppins(
        fontSize: 16, fontWeight: FontWeight.w400,
        color: AppColors.textBody, height: 1.5);

  static TextStyle get bodyMd => GoogleFonts.poppins(
        fontSize: 14, fontWeight: FontWeight.w400,
        color: AppColors.textBody, height: 1.5);

  static TextStyle get bodySm => GoogleFonts.poppins(
        fontSize: 13, fontWeight: FontWeight.w400,
        color: AppColors.textBody, height: 1.45);

  // ── Labels / Captions ────────────────────────────────────────
  static TextStyle get labelLg => GoogleFonts.poppins(
        fontSize: 13, fontWeight: FontWeight.w600,
        color: AppColors.textBody);

  static TextStyle get labelMd => GoogleFonts.poppins(
        fontSize: 12, fontWeight: FontWeight.w500,
        color: AppColors.textMuted);

  static TextStyle get labelSm => GoogleFonts.poppins(
        fontSize: 11, fontWeight: FontWeight.w500,
        color: AppColors.textHint);

  // ── Utilities ────────────────────────────────────────────────
  static TextStyle get overline => GoogleFonts.poppins(
        fontSize: 10, fontWeight: FontWeight.w600,
        color: AppColors.textMuted, letterSpacing: 0.8);

  static TextStyle get link => GoogleFonts.poppins(
        fontSize: 14, fontWeight: FontWeight.w600,
        color: AppColors.primary,
        decoration: TextDecoration.underline,
        decorationColor: AppColors.primary);

  static TextStyle get button => GoogleFonts.poppins(
        fontSize: 15, fontWeight: FontWeight.w700,
        color: AppColors.textOnPrimary, letterSpacing: 0.2);

  static TextStyle get buttonSm => GoogleFonts.poppins(
        fontSize: 13, fontWeight: FontWeight.w600,
        color: AppColors.textOnPrimary);

  // ── Nexa (brand font) ────────────────────────────────────────
  static const TextStyle nexaDisplay = TextStyle(
      fontSize: 22, fontWeight: FontWeight.bold,
      color: AppColors.primary, fontFamily: _font);

  static const TextStyle nexaTitle = TextStyle(
      fontSize: 18, fontWeight: FontWeight.bold,
      color: AppColors.primary, fontFamily: _font);

  static const TextStyle nexaBody = TextStyle(
      fontSize: 14, fontWeight: FontWeight.normal,
      color: AppColors.textBody, fontFamily: _font);

  static const TextStyle nexaWhite = TextStyle(
      fontSize: 18, fontWeight: FontWeight.bold,
      color: AppColors.white, fontFamily: _font);

  static const TextStyle nexaMuted = TextStyle(
      fontSize: 12, fontWeight: FontWeight.normal,
      color: AppColors.textHint, fontFamily: _font);
}

// ── Backward-compat shim ─────────────────────────────────────────────────────
/// @deprecated  Use AppText.xxx going forward.
class AppTextStyles {
  AppTextStyles._();

  static TextStyle get caption           => AppText.labelSm;
  static TextStyle get heading           => AppText.titleLg;
  static TextStyle get normalHeading     => AppText.titleMd;
  static TextStyle get subheading        => AppText.titleSm;
  static TextStyle get largeHeading      => AppText.h2.copyWith(color: AppColors.primary);
  static TextStyle get fieldText         => AppText.bodyLg;

  static TextStyle get text12w300        => AppText.labelSm.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text12w400        => AppText.labelMd.copyWith(fontWeight: FontWeight.w400);
  static TextStyle get text12w500        => AppText.labelMd;
  static TextStyle get text12w700        => AppText.labelMd.copyWith(fontWeight: FontWeight.w700, color: AppColors.textDark);
  static TextStyle get text12bold        => AppText.labelMd.copyWith(fontWeight: FontWeight.bold, color: AppColors.textDark);
  static TextStyle get text12w700Primary => AppText.labelMd.copyWith(fontWeight: FontWeight.w700, color: AppColors.primary);

  static TextStyle get text14w300        => AppText.bodyMd.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text14w400        => AppText.bodyMd;
  static TextStyle get text14w500        => AppText.bodyMd.copyWith(fontWeight: FontWeight.w500);
  static TextStyle get text14w500Inter   => AppText.bodyMd.copyWith(fontWeight: FontWeight.w500);
  static TextStyle get text14w700        => AppText.bodyMd.copyWith(fontWeight: FontWeight.w700, color: AppColors.textDark);
  static TextStyle get text14red         => AppText.bodyMd.copyWith(fontWeight: FontWeight.w700, color: AppColors.error);
  static TextStyle get text14normal      => AppText.bodyMd;
  static TextStyle get text14desc        => AppText.bodyMd.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text14grey        => AppText.bodyMd.copyWith(fontWeight: FontWeight.bold, color: AppColors.textMuted);

  static TextStyle get text16w300        => AppText.bodyLg.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text16w600        => AppText.bodyLg.copyWith(fontWeight: FontWeight.w600, color: AppColors.white);
  static TextStyle get text16w700        => AppText.titleMd;
  static TextStyle get text16w700Underline => AppText.titleMd.copyWith(decoration: TextDecoration.underline);
  static TextStyle get text16white       => AppText.bodyLg.copyWith(color: AppColors.white);
  static TextStyle get text16grey        => AppText.bodySm.copyWith(fontWeight: FontWeight.bold, color: AppColors.textMuted);

  static TextStyle get text18w300        => AppText.titleLg.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text18w400        => AppText.titleLg.copyWith(fontWeight: FontWeight.w400);
  static TextStyle get text18w500        => AppText.titleLg.copyWith(fontWeight: FontWeight.w500);
  static TextStyle get text18w600        => AppText.titleLg.copyWith(fontWeight: FontWeight.w600);
  static TextStyle get text18w700        => AppText.titleLg;
  static TextStyle get text18w700Poppins => AppText.titleLg;
  static TextStyle get text18white       => AppText.titleLg.copyWith(color: AppColors.white);
  static TextStyle get text18logoColor   => AppText.titleLg.copyWith(fontWeight: FontWeight.w400, color: AppColors.logoPrimary);

  static TextStyle get text20w300        => AppText.h3.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text20w600        => AppText.h3.copyWith(fontWeight: FontWeight.w600, color: AppColors.white);
  static TextStyle get text20w600Poppins => AppText.h3.copyWith(fontWeight: FontWeight.w600);
  static TextStyle get text20w700        => AppText.h3;
  static TextStyle get text20w700Poppins => AppText.h3;
  static TextStyle get text22w300        => AppText.h3.copyWith(fontSize: 22, fontWeight: FontWeight.w300);
  static TextStyle get text24w600        => AppText.h2.copyWith(fontWeight: FontWeight.w600);
  static TextStyle get text24white       => AppText.h2.copyWith(color: AppColors.white);
  static TextStyle get text24black       => AppText.h2.copyWith(color: AppColors.black);
  static TextStyle get text24poppinsBold => AppText.titleMd.copyWith(fontWeight: FontWeight.bold);
  static TextStyle get text28w300        => AppText.h1.copyWith(fontWeight: FontWeight.w300);
  static TextStyle get text28w600        => AppText.h1.copyWith(fontWeight: FontWeight.w600);
  static TextStyle get text32w600        => AppText.display.copyWith(fontSize: 32, fontWeight: FontWeight.w600);
  static TextStyle get text35w600        => AppText.display.copyWith(fontSize: 35, fontWeight: FontWeight.w600);
  static TextStyle get text40w600        => AppText.display.copyWith(fontSize: 40, fontWeight: FontWeight.w600);
  static TextStyle get text49w600        => AppText.display.copyWith(fontSize: 49, fontWeight: FontWeight.w600);

  static TextStyle get nexaHeading1      => AppText.nexaTitle;
  static TextStyle get nexaHeading       => AppText.nexaTitle.copyWith(fontSize: 16);
  static TextStyle get nexaHeading2      => AppText.nexaBody.copyWith(fontWeight: FontWeight.bold, color: AppColors.primary);
  static TextStyle get nexaHeadingBlack  => AppText.nexaTitle.copyWith(color: AppColors.black);
  static TextStyle get nexaHeadingWhite  => AppText.nexaWhite;
  static TextStyle get nexaRed           => AppText.nexaBody.copyWith(fontWeight: FontWeight.bold, color: AppColors.error);
  static TextStyle get nexaStatus        => AppText.nexaMuted.copyWith(fontSize: 11);
  static TextStyle get nexaPlaceholder   => AppText.nexaMuted;

  static TextStyle custom({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.normal,
    Color color = const Color(0xFF333333),
  }) =>
      GoogleFonts.poppins(fontSize: fontSize, fontWeight: fontWeight, color: color);
}
