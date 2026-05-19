import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/constants/app_colors.dart';
import '../core/theme/text_styles.dart';
import '../core/theme/theme_constants.dart';
import 'bounce_widget.dart';

/// Product card used in grid listings.
/// All styling via AppColors, AppText, AppSpacing, AppRadius.
class CommonCard extends StatelessWidget {
  final String title;
  final String price;
  final String subtitle;
  final String image;
  final bool hasCounter;
  final VoidCallback? onFavoriteTap;
  final VoidCallback? onAddToCart;
  final VoidCallback? onIncrement;
  final VoidCallback? onDecrement;
  final VoidCallback? onTap;
  final String? badgeText;
  final Color? badgeColor;
  final Color? badgeTextColor;
  final bool isFavorite;

  const CommonCard({
    super.key,
    required this.title,
    required this.price,
    required this.subtitle,
    required this.image,
    required this.hasCounter,
    this.onFavoriteTap,
    this.onAddToCart,
    this.onIncrement,
    this.onDecrement,
    this.onTap,
    this.badgeText,
    this.badgeColor,
    this.badgeTextColor,
    this.isFavorite = false,
  });

  @override
  Widget build(BuildContext context) {
    return BounceWidget(
      onTap: onTap ?? () {},
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: AppRadius.card,
          border: Border.all(color: AppColors.borderLight),
          boxShadow: AppShadows.subtle,
        ),
        child: Column(
          children: [
            // ── Badge & Favourite row ──────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(
                  AppSpacing.sm, AppSpacing.sm, AppSpacing.sm, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (badgeText != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm, vertical: 3),
                      decoration: BoxDecoration(
                        color: badgeColor ?? AppColors.badgeOrange,
                        borderRadius: AppRadius.badge,
                      ),
                      child: Text(
                        badgeText!,
                        style: AppText.overline.copyWith(
                          color: badgeTextColor ?? AppColors.badgeOrangeTxt,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    )
                  else
                    const SizedBox.shrink(),
                  BounceWidget(
                    onTap: onFavoriteTap ?? () {},
                    scaleFactor: 0.8,
                    child: Icon(
                      isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: isFavorite ? AppColors.favourite : AppColors.grey,
                      size: 22,
                    ),
                  ),
                ],
              ),
            ),

            // ── Product image ─────────────────────────────────
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                child: Image.asset(
                  image,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Center(
                    child: Icon(Icons.local_drink_outlined,
                        color: AppColors.primaryLight, size: 52),
                  ),
                ),
              ),
            ),

            // ── Price, title, subtitle ─────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(
                  AppSpacing.md, AppSpacing.sm, AppSpacing.md, AppSpacing.md),
              child: Column(
                children: [
                  Text(price,
                      style: AppText.titleSm
                          .copyWith(color: AppColors.primary)),
                  AppSpacing.hXs,
                  Text(
                    title,
                    style: AppText.labelLg
                        .copyWith(color: AppColors.textTitle),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  AppSpacing.hXs,
                  Text(subtitle,
                      style: AppText.labelMd,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis),
                ],
              ),
            ),

            Divider(height: 1, thickness: 1, color: AppColors.borderLight),

            // ── Counter or Add-to-cart ─────────────────────────
            if (hasCounter)
              SizedBox(
                height: 48,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(
                      child: BounceWidget(
                        onTap: onDecrement ?? () {},
                        scaleFactor: 0.8,
                        child: const Center(
                          child: Icon(Icons.remove,
                              color: AppColors.primary, size: 20),
                        ),
                      ),
                    ),
                    Text('1',
                        style: AppText.titleSm
                            .copyWith(color: AppColors.textDark)),
                    Expanded(
                      child: BounceWidget(
                        onTap: onIncrement ?? () {},
                        scaleFactor: 0.8,
                        child: const Center(
                          child: Icon(Icons.add,
                              color: AppColors.primary, size: 20),
                        ),
                      ),
                    ),
                  ],
                ),
              )
            else
              BounceWidget(
                onTap: onAddToCart ?? () {},
                child: SizedBox(
                  height: 48,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.shopping_bag_outlined,
                          color: AppColors.primary, size: 18),
                      AppSpacing.wSm,
                      Text('Add to cart',
                          style: AppText.labelLg
                              .copyWith(color: AppColors.textDark)),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(duration: 400.ms)
        .slideY(begin: 0.1, duration: 400.ms, curve: Curves.easeOut);
  }
}
