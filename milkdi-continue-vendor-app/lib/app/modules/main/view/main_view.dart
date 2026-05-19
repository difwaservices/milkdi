import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../dashboard/view/dashboard_view.dart';
import '../../orders/view/orders_view.dart';
import '../../products/view/products_view.dart';
import '../../profile/view/profile_view.dart';
import '../../../core/constants/app_colors.dart';

class MainNavNotifier extends Notifier<int> {
  @override
  int build() => 0;
  void setIndex(int index) => state = index;
}

final mainNavIndexProvider = NotifierProvider<MainNavNotifier, int>(() {
  return MainNavNotifier();
});

class MainView extends ConsumerWidget {
  const MainView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentIndex = ref.watch(mainNavIndexProvider);

    final List<Widget> pages = [
      const DashboardView(),
      const OrdersView(),
      const ProductsView(),
      const ProfileView(),
    ];

    return Scaffold(
      body: IndexedStack(index: currentIndex, children: pages),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: (index) => ref.read(mainNavIndexProvider.notifier).setIndex(index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: Colors.grey.shade400,
          selectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 10,
            letterSpacing: 0.5,
          ),
          unselectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 10,
          ),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'CONSOLE',
              activeIcon: Icon(Icons.dashboard_rounded),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.shopping_bag_rounded),
              label: 'ORDERS',
              activeIcon: Icon(Icons.shopping_bag_rounded),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.inventory_2_rounded),
              label: 'ITEMS',
              activeIcon: Icon(Icons.inventory_2_rounded),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.storefront_rounded),
              label: 'PROFILE',
              activeIcon: Icon(Icons.storefront_rounded),
            ),
          ],
        ),
      ),
    );
  }
}
