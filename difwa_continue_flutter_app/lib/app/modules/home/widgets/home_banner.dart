import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../../core/constants/app_images.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/text_styles.dart';
import '../../../core/theme/theme_constants.dart';
import '../../../widgets/bounce_widget.dart';

class HomeBanner extends StatefulWidget {
  const HomeBanner({super.key});

  @override
  State<HomeBanner> createState() => _HomeBannerState();
}

class _HomeBannerState extends State<HomeBanner> {
  final PageController _pageController = PageController(viewportFraction: 1.0);
  int _currentPage = 0;
  late Timer _timer;

  // SVG banner assets — rendered with SvgPicture
  final List<_BannerItem> _banners = const [
    _BannerItem(
      asset: AppImages.sliderSource,
      label: 'Farm Fresh Milk',
      sub: 'Sourced daily from trusted dairy farms',
    ),
    _BannerItem(
      asset: AppImages.sliderOrder,
      label: 'Doorstep Delivery',
      sub: 'Fresh milk delivered before sunrise',
    ),
    _BannerItem(
      asset: AppImages.sliderDrink,
      label: 'Subscribe & Save',
      sub: 'Flexible plans, cancel anytime',
    ),
    _BannerItem(
      asset: AppImages.sliderRefresh,
      label: 'Straight from the Cow',
      sub: 'Pure, natural & unadulterated',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startAutoScroll();
  }

  void _startAutoScroll() {
    _timer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (!mounted) return;
      setState(() {
        _currentPage = (_currentPage + 1) % _banners.length;
      });
      if (_pageController.hasClients) {
        _pageController.animateToPage(
          _currentPage,
          duration: AppDuration.slow,
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surfaceAlt,
      padding: const EdgeInsets.only(
          top: AppSpacing.md, bottom: AppSpacing.lg),
      child: Column(
        children: [
          SizedBox(
            height: 190,
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (p) => setState(() => _currentPage = p),
              itemCount: _banners.length,
              physics: const BouncingScrollPhysics(),
              itemBuilder: (context, index) {
                final item = _banners[index];
                return Padding(
                  padding: const EdgeInsets.fromLTRB(
                      AppSpacing.pagePadding, AppSpacing.xs,
                      AppSpacing.pagePadding, AppSpacing.sm),
                  child: BounceWidget(
                    onTap: () {},
                    scaleFactor: 0.97,
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.primarySoft,
                        borderRadius: AppRadius.dialog,
                        boxShadow: AppShadows.subtle,
                      ),
                      child: ClipRRect(
                        borderRadius: AppRadius.dialog,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            // SVG illustration fills the card
                            SvgPicture.asset(
                              item.asset,
                              fit: BoxFit.cover,
                              placeholderBuilder: (_) => Container(
                                color: AppColors.primarySoft,
                              ),
                            ),
                            // Gradient overlay for text legibility
                            DecoratedBox(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                  colors: [
                                    AppColors.primary.withValues(alpha: 0.82),
                                    AppColors.primary.withValues(alpha: 0.0),
                                  ],
                                ),
                              ),
                            ),
                            // Text overlay
                            Positioned(
                              left: AppSpacing.lg,
                              top: 0,
                              bottom: 0,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.label,
                                    style: AppText.titleMd.copyWith(
                                      color: AppColors.white,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                  AppSpacing.hXs,
                                  SizedBox(
                                    width: 180,
                                    child: Text(
                                      item.sub,
                                      style: AppText.labelMd.copyWith(
                                          color: AppColors.white
                                              .withValues(alpha: 0.88)),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          AppSpacing.hSm,

          // Indicator dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              _banners.length,
              (index) => AnimatedContainer(
                duration: AppDuration.fast,
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.xs),
                height: 6,
                width: _currentPage == index ? 20 : 6,
                decoration: BoxDecoration(
                  color: _currentPage == index
                      ? AppColors.primary
                      : AppColors.borderLight,
                  borderRadius: AppRadius.chip,
                ),
              ),
            ),
          ),
        ],
      ).animate().fadeIn(duration: 500.ms, curve: Curves.easeIn),
    );
  }
}

// Simple data class for banner content
class _BannerItem {
  final String asset;
  final String label;
  final String sub;
  const _BannerItem({required this.asset, required this.label, required this.sub});
}
