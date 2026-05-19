import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../controller/dashboard_controller.dart';
import '../../notifications/view/notification_view.dart';
import '../../notifications/controller/notification_controller.dart';
import '../../main/view/main_view.dart';
import '../../sales/view/sales_view.dart';
import '../../customers/view/customers_view.dart';
import '../widgets/stat_card_widget.dart';
import '../widgets/summary_chart.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/text_styles.dart';

class DashboardView extends ConsumerWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ... rest of build method
    final state = ref.watch(dashboardControllerProvider);
    final controller = ref.read(dashboardControllerProvider.notifier);

    if (state.error != null && !state.isLoading) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(40),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.wifi_off_rounded,
                  size: 80,
                  color: Colors.redAccent,
                ),
                const SizedBox(height: 24),
                const Text(
                  'NETWORK ERROR',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Colors.black,
                    letterSpacing: -1,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  state.error!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.grey, fontSize: 16),
                ),
                const SizedBox(height: 40),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () => controller.refresh(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'TRY AGAIN',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.scaffoldBg,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => controller.refresh(),
          child: CustomScrollView(
            slivers: [
              // Header Section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Text(
                                'SHOP CONSOLE',
                                style: AppTextStyles.heading2.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -1,
                                ),
                              ),
                              const SizedBox(width: 8),
                              IconButton(
                                visualDensity: VisualDensity.compact,
                                icon: const Icon(
                                  Icons.refresh_rounded,
                                  size: 22,
                                  color: Colors.grey,
                                ),
                                onPressed: () => controller.refresh(),
                              ),
                              Consumer(
                                builder: (context, ref, child) {
                                  final notifState = ref.watch(notificationControllerProvider);
                                  return Stack(
                                    children: [
                                      IconButton(
                                        visualDensity: VisualDensity.compact,
                                        icon: const Icon(Icons.notifications_outlined, size: 22, color: Colors.grey),
                                        onPressed: () {
                                          Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationView()));
                                        },
                                      ),
                                      if (notifState.unreadCount > 0)
                                        Positioned(
                                          right: 8,
                                          top: 8,
                                          child: Container(
                                            padding: const EdgeInsets.all(4),
                                            decoration: const BoxDecoration(
                                              color: Colors.red,
                                              shape: BoxShape.circle,
                                            ),
                                            constraints: const BoxConstraints(
                                              minWidth: 16,
                                              minHeight: 16,
                                            ),
                                            child: Text(
                                              '${notifState.unreadCount}',
                                              textAlign: TextAlign.center,
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 8,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ),
                                    ],
                                  );
                                },
                              ),
                            ],
                          ),
                          Text(
                            'Manage your hub',
                            style: AppTextStyles.caption.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ).animate().fadeIn().moveX(begin: -20),

                      // Shop Toggle Button (following web aesthetic)
                      InkWell(
                        onTap: () => controller.toggleShopStatus(),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: state.isShopOpen
                                ? const Color(0xFFE3F2FD)
                                : const Color(0xFFFFEBEE),
                            borderRadius: BorderRadius.circular(30),
                            border: Border.all(
                              color: state.isShopOpen
                                  ? const Color(0xFFBBDEFB)
                                  : const Color(0xFFFFCDD2),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: state.isShopOpen
                                          ? Colors.blue
                                          : Colors.red,
                                      shape: BoxShape.circle,
                                    ),
                                  )
                                  .animate(
                                    onPlay: (controller) => controller.repeat(),
                                  )
                                  .scale(
                                    begin: const Offset(0.8, 0.8),
                                    end: const Offset(1.2, 1.2),
                                    duration: 800.ms,
                                  )
                                  .then()
                                  .scale(
                                    begin: const Offset(1.2, 1.2),
                                    end: const Offset(0.8, 0.8),
                                    duration: 800.ms,
                                  ),
                              const SizedBox(width: 8),
                              Text(
                                state.isShopOpen ? 'SHOP OPEN' : 'SHOP CLOSED',
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Operational Priority Banner
              SliverToBoxAdapter(
                child: InkWell(
                  onTap: () {
                    ref.read(mainNavIndexProvider.notifier).setIndex(1);
                  }, // Navigate to orders
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 20),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(40),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Positioned(
                          right: -20,
                          top: -20,
                          child: Opacity(
                            opacity: 0.1,
                            child: const Icon(
                              Icons.inventory,
                              size: 100,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(
                                    Icons.inventory,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  'OPERATIONAL PRIORITY',
                                  style: AppTextStyles.caption.copyWith(
                                    fontSize: 8,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white.withOpacity(0.8),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Today\'s Prep List',
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'View required items for upcoming deliveries.',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.white.withOpacity(0.8),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 20),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'VIEW DETAILS',
                                    style: AppTextStyles.buttonText.copyWith(
                                      fontSize: 10,
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  const Icon(
                                    Icons.chevron_right,
                                    size: 16,
                                    color: AppColors.primary,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 32)),

              // GRAPH SECTION
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('WEEKLY PERFORMANCE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
                      const SizedBox(height: 20),
                      SummaryChart(data: state.chartData, isRevenue: true),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 32)),

              // Stats Grid
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.3,
                  ),
                  delegate: SliverChildListDelegate([
                    StatCardWidget(
                      title: 'TOTAL SALES',
                      value: '₹${state.totalSales.toInt()}',
                      icon: Icons.currency_rupee,
                      color: AppColors.primary,
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const SalesView()));
                      },
                    ),
                    StatCardWidget(
                      title: 'ORDERS',
                      value: '${state.totalOrders}',
                      icon: Icons.shopping_cart,
                      color: Colors.blue,
                      onTap: () {
                        ref.read(mainNavIndexProvider.notifier).setIndex(1);
                      },
                    ),
                    StatCardWidget(
                      title: 'PRODUCTS',
                      value: '${state.activeProducts}',
                      icon: Icons.inventory_2,
                      color: Colors.orange,
                      onTap: () {
                        ref.read(mainNavIndexProvider.notifier).setIndex(2);
                      },
                    ),
                    StatCardWidget(
                      title: 'CUSTOMERS',
                      value: '${state.totalCustomers}',
                      icon: Icons.people,
                      color: Colors.purple,
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const CustomersView()));
                      },
                    ),
                  ]),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 24)),

              // Activity Feed Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'SHOP ACTIVITY',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: AppColors.primary,
                            ),
                          ),
                          Text(
                            'Live Feed',
                            style: AppTextStyles.caption.copyWith(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                      const Icon(
                        Icons.sync,
                        color: AppColors.textMuted,
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 16)),

              // Activity Feed Items
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final activity = state.activities[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: activity['type'] == 'order_new'
                                  ? Colors.blue.withOpacity(0.1)
                                  : Colors.orange.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(
                              activity['type'] == 'order_new'
                                  ? Icons.shopping_cart
                                  : Icons.warning,
                              color: activity['type'] == 'order_new'
                                  ? Colors.blue
                                  : Colors.orange,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      (activity['title'] ?? '')
                                          .toString()
                                          .toUpperCase(),
                                      style: AppTextStyles.caption.copyWith(
                                        fontWeight: FontWeight.w900,
                                        fontSize: 12,
                                      ),
                                    ),
                                    Text(
                                      '5m ago',
                                      style: AppTextStyles.caption.copyWith(
                                        fontSize: 10,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  (activity['message'] ?? '').toString(),
                                  style: AppTextStyles.body.copyWith(
                                    fontSize: 12,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(
                      delay: Duration(milliseconds: 300 + (index * 100)),
                    );
                  }, childCount: state.activities.length),
                ),
              ),

              const SliverPadding(padding: EdgeInsets.only(bottom: 40)),
            ],
          ),
        ),
      ),
    );
  }
}
