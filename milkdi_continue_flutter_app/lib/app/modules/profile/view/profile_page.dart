import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import './profile_detail_page.dart';
import './edit_profile_page.dart';
import 'package:difwawaterapp/app/core/utils/auth_helper.dart';
import 'package:difwawaterapp/core/state/auth_store.dart';
import '../../../data/services/auth_service.dart' as auth;
import '../../../data/models/auth_models.dart' as models;
import '../../../data/services/db_service.dart';
import '../../../data/services/order_service.dart';
import '../../../data/services/favorites_service.dart';
import './my_orders_page.dart';
import '../../auth/provider/auth_provider.dart';
import '../../subscription/view/subscription_dashboard_page.dart';
import '../../../data/services/subscription_service.dart';
import '../../home/view/favorites_page.dart';
import '../../../routes/app_routes.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/providers/notification_provider.dart';

class ProfilePage extends ConsumerStatefulWidget {
  const ProfilePage({super.key});

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    final isAuth = ref.watch(isAuthenticatedProvider);
    if (!isAuth) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: AuthHelper.loginRequiredPlaceholder(
          context: context,
          featureName: 'Your Profile',
          description:
              'Manage your addresses, view order history, and personalize your experience.',
        ),
      );
    }

    // ── Primary: use cached user from the unified source of truth ─────────
    final coreState = ref.watch(authStoreProvider);
    final user = coreState is AuthAuthenticated ? coreState.user : null;
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => ref.refresh(auth.userProfileProvider.future),
          color: AppColors.primaryDark,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding:
                const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Prefer cached user; fall back to network fetch for real sessions
                if (user != null)
                  _ProfileHeader(user: user)
                else
                  ref.watch(auth.userProfileProvider).when(
                        data: (user) => _ProfileHeader(user: user),
                        loading: () => const _ProfileHeaderSkeleton(),
                        error: (e, _) => const Center(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: Text(
                              'Could not load profile. Pull down to refresh.',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.grey, fontSize: 14),
                            ),
                          ),
                        ),
                      ),
                const SizedBox(height: 30),
                const _ActiveOrdersAndSubscriptions(),
                const SizedBox(height: 24),
                const Text(
                  'Quick Actions',
                  style: TextStyle(
                      color: Color(0xFF14532D),
                      fontSize: 16,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                const _QuickActionsRow(),
                const SizedBox(height: 24),
                const _ListTilesSection(),
                const SizedBox(height: 32),
                const _SignOutButton(),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ProfileHeaderSkeleton extends StatelessWidget {
  const _ProfileHeaderSkeleton();

  @override
  Widget build(BuildContext context) {
    return Shimmer(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(width: 100, height: 14, color: Colors.white),
              const SizedBox(height: 8),
              Container(width: 150, height: 28, color: Colors.white),
            ],
          ),
          const CircleAvatar(radius: 40, backgroundColor: Colors.white),
        ],
      ),
    );
  }
}

class Shimmer extends StatelessWidget {
  final Widget child;
  const Shimmer({super.key, required this.child});
  @override
  Widget build(BuildContext context) => Opacity(opacity: 0.5, child: child);
}

class _ProfileHeader extends StatelessWidget {
  final models.UserModel user;

  const _ProfileHeader({required this.user});

  @override
  Widget build(BuildContext context) {
    final name = user.fullName;
    final email = user.email;
    final phone = user.phoneNumber;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    'Hello, ${name.isNotEmpty ? name.split(' ').first : 'User'}!',
                    style: const TextStyle(
                      color: Color(0xFF14532D),
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (name.isEmpty || name.toLowerCase() == 'user')
                    Padding(
                      padding: const EdgeInsets.only(left: 12),
                      child: GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const EditProfilePage()),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF14532D).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: const Color(0xFF14532D),
                              width: 1,
                            ),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.add, size: 14, color: Color(0xFF14532D)),
                              SizedBox(width: 4),
                              Text(
                                'Add Profile',
                                style: TextStyle(
                                  color: Color(0xFF14532D),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              if (email.isNotEmpty)
                Text(
                  email,
                  style: const TextStyle(
                    color: Colors.black45,
                    fontSize: 13,
                  ),
                ),
              if (phone.isNotEmpty)
                Text(
                  phone,
                  style: const TextStyle(
                    color: Colors.black38,
                    fontSize: 12,
                  ),
                ),
              if (user.role == 'retailer') ...[
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: user.isShopActive
                        ? AppColors.primary.withOpacity(0.1)
                        : Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: user.isShopActive ? AppColors.primary : Colors.red,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: user.isShopActive
                              ? AppColors.primary
                              : Colors.red,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        user.isShopActive ? 'SHOP OPEN' : 'SHOP CLOSED',
                        style: TextStyle(
                          color: user.isShopActive
                              ? AppColors.primaryDark
                              : Colors.red,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
        GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const EditProfilePage()),
            );
          },
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppColors.primaryDark.withValues(alpha: 0.3),
                  blurRadius: 20,
                  spreadRadius: 2,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: CircleAvatar(
              backgroundColor: AppColors.primaryLight,
              radius: 40,
              child: Text(
                name.isNotEmpty ? name[0].toUpperCase() : 'U',
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryDark,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _ActiveOrdersAndSubscriptions extends ConsumerWidget {
  const _ActiveOrdersAndSubscriptions();

  void _navigateToDetail(BuildContext context, String title) {
    if (title == 'Active Orders') {
      Navigator.pushNamed(context, AppRoutes.activeOrders);
    } else if (title == 'My Orders') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const MyOrdersPage()),
      );
    } else if (title == 'Subscriptions') {
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => const SubscriptionDashboardPage()),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProfileDetailPage(title: title)),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeOrdersAsync = ref.watch(activeOrdersProvider);
    final activeOrdersCount = activeOrdersAsync.maybeWhen(
      data: (orders) => orders.length,
      orElse: () => 0,
    );

    final subscriptionsAsync = ref.watch(mySubscriptionsProvider);
    final activeSubsCount = subscriptionsAsync.maybeWhen(
      data: (subs) => subs.length,
      orElse: () => 0,
    );

    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => _navigateToDetail(context, 'Active Orders'),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFE0F7FA),
                border: Border.all(
                    color: const Color(0xFF00ACC1).withValues(alpha: 0.1)),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Color(0xFF00ACC1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.inventory_2_outlined,
                        color: Colors.white, size: 20),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Active Orders',
                    style: TextStyle(
                      color: Color(0xFF00838F),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    activeOrdersCount > 0
                        ? '$activeOrdersCount Active Order${activeOrdersCount > 1 ? 's' : ''}'
                        : 'No Active Orders',
                    style: const TextStyle(
                      color: Color(0xFF006064),
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text('Track Live',
                        style: TextStyle(
                            color: Color(0xFF00ACC1),
                            fontSize: 10,
                            fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: GestureDetector(
            onTap: () => _navigateToDetail(context, 'Subscriptions'),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF00ACC1),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.card_membership_outlined,
                        color: Colors.white, size: 20),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Subscriptions',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    activeSubsCount > 0
                        ? '$activeSubsCount Active Plan${activeSubsCount > 1 ? 's' : ''}'
                        : 'No Active Plans',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                        activeSubsCount > 0 ? 'Managed Live' : 'View Plans',
                        style:
                            const TextStyle(color: Colors.white, fontSize: 10)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _QuickActionsRow extends ConsumerWidget {
  const _QuickActionsRow();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favCount = ref.watch(favoriteProductsProvider).maybeWhen(
          data: (list) => list.length,
          orElse: () => 0,
        );
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _QuickActionBtn(
          title: 'Reorder\nFavorite',
          navigateTo: 'My Favorites',
          badgeCount: favCount,
        ),
        const _QuickActionBtn(
            title: 'View All\nOrders', navigateTo: 'My Orders'),
        const _QuickActionBtn(title: 'Edit\nAddress', navigateTo: 'My Address'),
      ],
    );
  }
}

class _QuickActionBtn extends StatelessWidget {
  final String title;
  final String navigateTo;
  final int badgeCount;

  const _QuickActionBtn({
    required this.title,
    required this.navigateTo,
    this.badgeCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    final bool isFavBtn = navigateTo == 'My Favorites';

    return GestureDetector(
      onTap: () {
        if (navigateTo == 'My Orders') {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const MyOrdersPage()),
          );
        } else if (isFavBtn) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const FavoritesPage()),
          );
        } else {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => ProfileDetailPage(title: navigateTo)),
          );
        }
      },
      child: Container(
        width: MediaQuery.of(context).size.width * 0.27,
        padding: const EdgeInsets.symmetric(vertical: 12),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  isFavBtn
                      ? (badgeCount > 0
                          ? Icons.favorite_rounded
                          : Icons.favorite_border_rounded)
                      : navigateTo == 'My Orders'
                          ? Icons.receipt_long_rounded
                          : Icons.location_on_rounded,
                  color: isFavBtn && badgeCount > 0
                      ? Colors.red
                      : AppColors.primaryDark,
                  size: 20,
                ),
                if (badgeCount > 0)
                  Positioned(
                    top: -6,
                    right: -8,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      constraints:
                          const BoxConstraints(minWidth: 16, minHeight: 16),
                      child: Text(
                        '$badgeCount',
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: AppColors.primaryDark,
                  fontSize: 10,
                  fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}

class _ListTilesSection extends ConsumerWidget {
  const _ListTilesSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unreadCount = ref.watch(unreadNotificationsCountProvider);
    return Column(
      children: [
        _ListTileItem(
          icon: Icons.notifications_none_rounded, 
          title: 'Notifications', 
          color: const Color(0xFF0EA5E9),
          badgeCount: unreadCount,
        ),
        const SizedBox(height: 12),
        const _ListTileItem(
          icon: Icons.help_outline_rounded, 
          title: 'Help & Support',
          color: Color(0xFF8B5CF6),
        ),
        const SizedBox(height: 12),
        const _ListTileItem(
          icon: Icons.info_outline_rounded, 
          title: 'About Difwa',
          color: Color(0xFF10B981),
        ),
        const SizedBox(height: 12),
        const _ListTileItem(
          icon: Icons.contact_support_outlined, 
          title: 'Contact Us',
          color: Color(0xFFF59E0B),
        ),
        const SizedBox(height: 12),
        const _ListTileItem(
          icon: Icons.star_outline_rounded, 
          title: 'Rate Us',
          color: Color(0xFFEF4444),
        ),
      ],
    );
  }
}

class _ListTileItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final int badgeCount;

  const _ListTileItem({
    required this.icon, 
    required this.title, 
    required this.color,
    this.badgeCount = 0,
  });

  void _handleTap(BuildContext context) async {
    if (title == 'Notifications') {
      Navigator.pushNamed(context, AppRoutes.notifications);
    } else if (title == 'About Difwa') {
      Navigator.pushNamed(context, AppRoutes.about);
    } else if (title == 'Contact Us') {
      Navigator.pushNamed(context, AppRoutes.contact);
    } else if (title == 'Help & Support') {
      Navigator.pushNamed(context, AppRoutes.help);
    } else if (title == 'Rate Us') {
      final Uri url = Uri.parse('https://play.google.com/store/apps/details?id=com.difmo.difwa');
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProfileDetailPage(title: title)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _handleTap(context),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: const Color(0xFFE2E8F0)),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Row(
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Color(0xFF1E293B),
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  if (badgeCount > 0) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$badgeCount',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              color: Colors.grey.shade300,
              size: 14,
            ),
          ],
        ),
      ),
    );
  }
}

class _SignOutButton extends ConsumerWidget {
  const _SignOutButton();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Align(
      alignment: Alignment.centerRight,
      child: GestureDetector(
        onTap: () async {
          CartProviderScope.of(context).clearSession();
          await ref.read(authStoreProvider.notifier).logout();
          if (context.mounted) {
            Navigator.pushNamedAndRemoveUntil(
              context,
              AppRoutes.login,
              (route) => false,
            );
          }
        },
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Text('Sign Out',
                style: TextStyle(
                    color: AppColors.primaryDark,
                    fontWeight: FontWeight.bold,
                    fontSize: 16)),
            SizedBox(width: 8),
            Icon(Icons.logout, color: AppColors.primaryDark),
          ],
        ),
      ),
    );
  }
}
