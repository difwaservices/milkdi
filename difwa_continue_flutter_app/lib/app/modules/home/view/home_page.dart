import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import 'package:flutter/services.dart';
import '../../../data/services/db_service.dart';
import '../widgets/home_header.dart';
import '../../../data/services/wallet_service.dart';
import '../widgets/home_banner.dart';
import '../widgets/restaurant_list_section.dart';
import '../../../core/theme/theme_constants.dart';
import '../../../core/theme/text_styles.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../provider/shop_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: AppColors.surfaceAlt,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
      child: Scaffold(
        backgroundColor: AppColors.surface,
        body: RefreshIndicator(
          onRefresh: () async {
            await ref.read(shopsListProvider.notifier).refresh();
            if (!context.mounted) return;
            CartProviderScope.of(context).loadAddresses();
            CartProviderScope.of(context).syncWallet();
            ref.invalidate(walletBalanceProvider);
            ref.invalidate(walletHistoryProvider);
          },
          color: AppColors.primary,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Container(
                  height: MediaQuery.of(context).padding.top,
                  color: AppColors.surfaceAlt,
                ),
              ),
              const SliverToBoxAdapter(child: HomeHeader()),
              const SliverToBoxAdapter(child: HomeBanner()),
              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),
              const SliverToBoxAdapter(child: RestaurantListSection()),
              const SliverToBoxAdapter(child: _FooterText()),
              const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
            ],
          ),
        ),
      ),
    );
  }
}

class _FooterText extends StatelessWidget {
  const _FooterText();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.pagePadding, AppSpacing.lg,
          AppSpacing.pagePadding, 120),
      child: Text(
        'With love,\nfrom Milkdi.',
        style: AppText.display.copyWith(
          color: AppColors.borderLight,
          fontWeight: FontWeight.w900,
          letterSpacing: -1.5,
        ),
      ),
    );
  }
}
