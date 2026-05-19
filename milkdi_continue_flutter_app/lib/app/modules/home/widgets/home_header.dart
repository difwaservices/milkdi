import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../data/providers/notification_provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/text_styles.dart';
import '../../../core/theme/theme_constants.dart';
import '../controller/main_controller.dart';
import '../../../widgets/bounce_widget.dart';
import '../../../routes/app_routes.dart';
import '../../../data/services/db_service.dart';
import '../../profile/view/profile_detail_page.dart';
import '../../../../core/state/auth_store.dart';

class HomeHeader extends ConsumerWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart    = CartProviderScope.of(context);
    final address = cart.selectedAddress;

    return Container(
      color: AppColors.surfaceAlt,
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.pagePadding, AppSpacing.md, AppSpacing.pagePadding, AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Top row: location + avatar + notifications ─────────
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Location
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    final isAuth = ref.read(isAuthenticatedProvider);
                    if (!isAuth) {
                      Navigator.pushNamed(context, AppRoutes.login);
                      return;
                    }
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) =>
                            const ProfileDetailPage(title: 'My Address'),
                      ),
                    );
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Icon(Icons.location_on_rounded,
                          color: AppColors.primary, size: 22),
                      AppSpacing.wXs,
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Flexible(
                                  child: Text(
                                    address?.title ?? 'Add Address',
                                    style: AppText.titleSm,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const Icon(Icons.keyboard_arrow_down_rounded,
                                    size: 20, color: AppColors.textMuted),
                              ],
                            ),
                            Text(
                              address?.street ??
                                  'Tap to set your delivery location',
                              style: AppText.labelMd,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              AppSpacing.wSm,

              // Avatar button
              BounceWidget(
                onTap: () {
                  final isAuth = ref.read(isAuthenticatedProvider);
                  if (!isAuth) {
                    Navigator.pushNamed(context, AppRoutes.login);
                    return;
                  }
                  MainControllerScope.of(context).changePage(4);
                },
                child: Hero(
                  tag: 'profile_pic',
                  child: _HeaderIconButton(
                    child: ClipOval(
                      child: Padding(
                        padding: const EdgeInsets.all(AppSpacing.xs),
                        child: Image.asset(
                          'assets/images/app_icon.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              AppSpacing.wSm,

              // Notification button
              Consumer(
                builder: (context, ref, _) {
                  final count = ref.watch(unreadNotificationsCountProvider);
                  return BounceWidget(
                    onTap: () {
                      final isAuth = ref.read(isAuthenticatedProvider);
                      if (!isAuth) {
                        Navigator.pushNamed(context, AppRoutes.login);
                        return;
                      }
                      Navigator.pushNamed(context, AppRoutes.notifications);
                    },
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        _HeaderIconButton(
                          child: const Icon(
                            Icons.notifications_none_rounded,
                            size: 22,
                            color: AppColors.textDark,
                          ),
                        ),
                        if (count > 0)
                          Positioned(
                            right: -2,
                            top: -2,
                            child: Container(
                              padding: const EdgeInsets.all(AppSpacing.xs),
                              decoration: const BoxDecoration(
                                color: AppColors.error,
                                shape: BoxShape.circle,
                              ),
                              constraints: const BoxConstraints(
                                  minWidth: 16, minHeight: 16),
                              child: Text(
                                count > 9 ? '9+' : '$count',
                                style: AppText.overline.copyWith(
                                    color: AppColors.white,
                                    fontSize: 9),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),

          AppSpacing.hMd,

          // ── Search bar ────────────────────────────────────────
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, AppRoutes.search),
            child: Container(
              height: 52,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.input,
                border: Border.all(color: AppColors.border),
                boxShadow: AppShadows.subtle,
              ),
              child: Row(
                children: [
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: AppSpacing.md),
                    child: Icon(Icons.search_rounded,
                        color: AppColors.primary, size: 22),
                  ),
                  Expanded(
                    child: Text(
                      'Search for milk, dairies...',
                      style: AppText.bodyMd
                          .copyWith(color: AppColors.textHint),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.sm, vertical: AppSpacing.sm),
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: AppRadius.badge,
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.tune_rounded,
                            size: 14, color: AppColors.primary),
                        AppSpacing.wXs,
                        Text('Filter',
                            style: AppText.overline
                                .copyWith(color: AppColors.primary)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(duration: 400.ms)
        .slideY(begin: -0.08, duration: 400.ms, curve: Curves.easeOut);
  }
}

/// Shared circular icon button used in the header.
class _HeaderIconButton extends StatelessWidget {
  final Widget child;
  const _HeaderIconButton({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: AppColors.surface,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.subtle,
      ),
      child: child,
    );
  }
}
