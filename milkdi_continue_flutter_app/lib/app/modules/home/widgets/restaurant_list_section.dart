import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/shop_product_model.dart';
import '../provider/shop_provider.dart';
import '../view/restaurant_menu_page.dart';
import 'filter_bottom_sheet.dart';
import '../../../core/constants/app_images.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/text_styles.dart';
import '../../../core/theme/theme_constants.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../provider/search_provider.dart';
import '../../../routes/app_routes.dart';

const List<String> _cuisineTypes = [
  'Full Cream · Toned',
  'A2 · Organic',
  'Buffalo · Cow',
  'Skimmed · Low Fat',
  'Pasteurised · Fresh',
  'Standardised · Pure',
  'Double Toned · Light',
  'Fortified · Healthy',
  'Farm Fresh · Natural',
  'Premium · Rich',
  'Daily · Subscription',
];

class RestaurantListSection extends ConsumerWidget {
  const RestaurantListSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final shopsAsync = ref.watch(shopsListProvider);

    return shopsAsync.when(
      loading: () => const _ShopsLoadingState(),
      error: (err, _) => _ShopsErrorState(
        message: err.toString(),
        onRetry: () => ref.invalidate(shopsListProvider),
      ),
      data: (shops) {
        if (shops.isEmpty) {
          return _ShopsEmptyState(onRetry: () => ref.invalidate(shopsListProvider));
        }
        return _ShopsList(shops: shops);
      },
    );
  }
}

// ── Shops List ────────────────────────────────────────────────────────────────

class _ShopsList extends ConsumerWidget {
  final List<ShopModel> shops;
  const _ShopsList({required this.shops});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePadding, 0, AppSpacing.pagePadding, AppSpacing.sm),
          child: Row(
            children: [
              Text('Dairies Near You', style: AppText.titleLg),
              const Spacer(),
              Text(
                '${shops.length} places',
                style: AppText.labelMd.copyWith(color: AppColors.textMuted),
              ),
              AppSpacing.wSm,
              InkWell(
                onTap: () async {
                  final searchState = ref.read(searchProvider);
                  final initialResult = searchState.priceRange != null ||
                          searchState.selectedCategoryIds.isNotEmpty ||
                          searchState.selectedDeliverySlots.isNotEmpty
                      ? FilterResult(
                          priceRange: searchState.priceRange ??
                              const RangeValues(10, 2000),
                          selectedCategoryIds: searchState.selectedCategoryIds,
                          selectedDeliverySlots: searchState.selectedDeliverySlots,
                        )
                      : null;

                  final result = await FilterBottomSheet.show(context,
                      initialResult: initialResult);
                  if (result != null) {
                    ref.read(searchProvider.notifier).applyAdvancedFilters(
                          priceRange: result.priceRange,
                          selectedCategoryIds: result.selectedCategoryIds,
                          selectedDeliverySlots: result.selectedDeliverySlots,
                        );
                    if (context.mounted) {
                      Navigator.pushNamed(context, AppRoutes.search);
                    }
                  }
                },
                borderRadius: AppRadius.badge,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.sm + 2, vertical: AppSpacing.xs + 2),
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: AppRadius.badge,
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.filter_list_rounded,
                          size: 16, color: AppColors.primary),
                      AppSpacing.wXs,
                      Text('Filters',
                          style: AppText.labelLg
                              .copyWith(color: AppColors.primary)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        ListView.builder(
          padding: EdgeInsets.zero,
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: shops.length,
          itemBuilder: (context, index) =>
              _ShopCard(shop: shops[index], index: index),
        ),
      ],
    );
  }
}

// ── Individual Shop Card ──────────────────────────────────────────────────────

class _ShopCard extends StatelessWidget {
  final ShopModel shop;
  final int index;

  const _ShopCard({required this.shop, required this.index});

  String get _cuisine => _cuisineTypes[index % _cuisineTypes.length];
  bool get _isFeatured => shop.isFeatured;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (!shop.isShopActive) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('This dairy is currently not accepting orders.',
                  style: AppText.bodyMd.copyWith(color: AppColors.white)),
              backgroundColor: AppColors.textDark,
              behavior: SnackBarBehavior.floating,
            ),
          );
          return;
        }
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => RestaurantMenuPage(shop: shop)),
        );
      },
      child: ClipRRect(
        borderRadius: AppRadius.card,
        child: Opacity(
          opacity: shop.isShopActive ? 1.0 : 0.8,
          child: ColorFiltered(
            colorFilter: shop.isShopActive
                ? const ColorFilter.mode(Colors.transparent, BlendMode.multiply)
                : const ColorFilter.mode(
                    Color.fromARGB(255, 255, 255, 255), BlendMode.saturation),
            child: Container(
              margin: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.pagePadding, vertical: AppSpacing.xs + 4),
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius: AppRadius.card,
                border: Border.all(color: AppColors.borderLight),
                boxShadow: AppShadows.subtle,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Hero Banner ──────────────────────────────────
                  Stack(
                    children: [
                      ClipRRect(
                        borderRadius: AppRadius.imgTop,
                        child: _buildHeroImage(),
                      ),
                      if (!shop.isShopActive)
                        Positioned.fill(
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.2),
                              borderRadius: AppRadius.imgTop,
                            ),
                            child: Center(
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: AppSpacing.sm + 4,
                                    vertical: AppSpacing.xs + 2),
                                decoration: BoxDecoration(
                                  color: AppColors.error,
                                  borderRadius: AppRadius.badge,
                                  boxShadow: AppShadows.elevated,
                                ),
                                child: Text(
                                  'CLOSED',
                                  style: AppText.labelLg.copyWith(
                                    color: AppColors.white,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1.2,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      // Business name chip
                      Positioned(
                        top: AppSpacing.sm + 4,
                        left: AppSpacing.sm + 4,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.sm + 2, vertical: AppSpacing.xs),
                          decoration: BoxDecoration(
                            color: AppColors.textDark.withValues(alpha: 0.65),
                            borderRadius: BorderRadius.circular(AppRadius.xs),
                          ),
                          child: Text(
                            shop.businessName.isNotEmpty
                                ? shop.businessName
                                : 'Fresh Milk · ₹60+',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppText.labelSm.copyWith(
                                color: AppColors.white,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                      // Featured badge
                      if (_isFeatured)
                        Positioned(
                          bottom: AppSpacing.sm + 2,
                          left: AppSpacing.sm + 4,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: AppSpacing.sm, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.badgeOrange,
                              borderRadius: BorderRadius.circular(AppRadius.xs),
                              border: Border.all(color: AppColors.badgeOrangeTxt),
                            ),
                            child: Text(
                              '⭐ Featured',
                              style: AppText.overline.copyWith(
                                  color: AppColors.badgeOrangeTxt,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                    ],
                  ),

                  // ── Info Row ─────────────────────────────────────
                  Padding(
                    padding: const EdgeInsets.fromLTRB(
                        AppSpacing.md, AppSpacing.sm + 4, AppSpacing.md, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(shop.name, style: AppText.titleMd),
                        AppSpacing.hXs,
                        Text(_cuisine,
                            style: AppText.labelMd
                                .copyWith(color: AppColors.textMuted)),
                      ],
                    ),
                  ),

                  AppSpacing.hSm,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeroImage() {
    final networkUrl = shop.image;
    if (networkUrl.length > 5) {
      return Container(
        color: AppColors.cardBg,
        child: Image.network(
          networkUrl,
          height: 180,
          width: double.infinity,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _localFallback(),
        ),
      );
    }
    return _localFallback();
  }

  Widget _localFallback() {
    return Container(
      height: 180,
      width: double.infinity,
      color: AppColors.cardBg,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Image.asset(AppImages.difwaLogoPng, fit: BoxFit.contain),
        ),
      ),
    );
  }
}

// ── Loading State ─────────────────────────────────────────────────────────────

class _ShopsLoadingState extends StatelessWidget {
  const _ShopsLoadingState();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.xl),
            child: Image.asset(AppImages.difwaLogoPng, width: 100, height: 100)
                .animate(onPlay: (c) => c.repeat())
                .scale(
                    begin: const Offset(0.9, 0.9),
                    end: const Offset(1.1, 1.1),
                    duration: 1000.ms,
                    curve: Curves.easeInOut)
                .fadeIn(begin: 0.6, duration: 1000.ms, curve: Curves.easeInOut),
          ),
        ),
        ...List.generate(3, (_) => const _ShopShimmerCard()),
      ],
    );
  }
}

class _ShopShimmerCard extends StatefulWidget {
  const _ShopShimmerCard();

  @override
  State<_ShopShimmerCard> createState() => _ShopShimmerCardState();
}

class _ShopShimmerCardState extends State<_ShopShimmerCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: AppDuration.slow)
      ..repeat(reverse: true);
    _anim = Tween<double>(begin: 0.4, end: 0.8)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) => Container(
        margin: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pagePadding, vertical: AppSpacing.xs + 4),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: AppRadius.card,
          boxShadow: AppShadows.subtle,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 180,
              decoration: BoxDecoration(
                color: AppColors.borderLight.withValues(alpha: _anim.value),
                borderRadius: AppRadius.imgTop,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 16,
                    width: 160,
                    decoration: BoxDecoration(
                      color: AppColors.borderLight.withValues(alpha: _anim.value),
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                    ),
                  ),
                  AppSpacing.hSm,
                  Container(
                    height: 12,
                    width: 100,
                    decoration: BoxDecoration(
                      color: AppColors.borderLight
                          .withValues(alpha: _anim.value * 0.7),
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                    ),
                  ),
                  AppSpacing.hSm,
                  Container(
                    height: 12,
                    width: 200,
                    decoration: BoxDecoration(
                      color: AppColors.borderLight
                          .withValues(alpha: _anim.value * 0.5),
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Error State ───────────────────────────────────────────────────────────────

class _ShopsErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _ShopsErrorState({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.pagePadding, vertical: AppSpacing.xl),
      child: Center(
        child: Column(
          children: [
            const Icon(Icons.wifi_off_rounded,
                size: 56, color: AppColors.textMuted),
            AppSpacing.hSm,
            Text('Could not load dairies', style: AppText.titleSm),
            AppSpacing.hXs,
            Text(
              'Please check connection and try again.',
              style: AppText.bodyMd.copyWith(color: AppColors.textMuted),
              textAlign: TextAlign.center,
            ),
            AppSpacing.hLg,
            ElevatedButton.icon(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.white,
                shape: RoundedRectangleBorder(borderRadius: AppRadius.button),
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.xl, vertical: AppSpacing.sm + 4),
              ),
              icon: const Icon(Icons.refresh, size: 18),
              label: Text('Retry', style: AppText.button),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Empty State ───────────────────────────────────────────────────────────────

class _ShopsEmptyState extends StatelessWidget {
  final VoidCallback onRetry;
  const _ShopsEmptyState({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.pagePadding, vertical: AppSpacing.xl),
      child: Center(
        child: Column(
          children: [
            const Icon(Icons.storefront_outlined,
                size: 56, color: AppColors.textMuted),
            AppSpacing.hSm,
            Text('No dairies found', style: AppText.titleSm),
            AppSpacing.hXs,
            Text(
              'Check back later for nearby dairies.',
              style: AppText.bodyMd.copyWith(color: AppColors.textMuted),
              textAlign: TextAlign.center,
            ),
            AppSpacing.hLg,
            ElevatedButton.icon(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.white,
                shape: RoundedRectangleBorder(borderRadius: AppRadius.button),
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.xl, vertical: AppSpacing.sm + 4),
              ),
              icon: const Icon(Icons.refresh, size: 18),
              label: Text('Refresh', style: AppText.button),
            ),
          ],
        ),
      ),
    );
  }
}
