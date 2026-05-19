import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'home_page.dart';
import '../../cart/view/cart_page.dart';
import '../../profile/view/profile_page.dart';
import '../../subscription/subscription_page.dart';
import '../../wallet/view/wallet_page.dart';
import '../controller/main_controller.dart';
import '../../../data/services/db_service.dart';
import '../../../core/constants/app_colors.dart';
import '../widgets/cart_summary_bar.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/state/auth_store.dart';
import '../../../routes/app_routes.dart';
import '../../../data/services/socket_service.dart';
import '../../profile/widgets/review_dialog.dart';

class MainPage extends ConsumerStatefulWidget {
  const MainPage({super.key});

  @override
  ConsumerState<MainPage> createState() => _MainPageState();
}

class _MainPageState extends ConsumerState<MainPage> {
  final MainController _controller = MainController();
  DateTime? _lastPressedAt;

  final List<Widget> _pages = [
    const HomePage(),
    const SubscriptionPage(),
    const CartPage(), // Central FAB
    const WalletPage(),
    const ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      if (mounted) setState(() {});
    });
    // Initial cart sync from API
    WidgetsBinding.instance.addPostFrameCallback((_) {
      CartProviderScope.of(context).loadCartFromApi();
      _setupSocketListeners();
    });
  }

  void _setupSocketListeners() {
    final socket = ref.read(socketServiceProvider);
    final user = ref.read(currentUserProvider);

    if (user != null) {
      socket.joinUserRoom(user.id);
    }

    socket.onOrderDelivered((data) {
      if (!mounted) return;

      // data: { orderId: "...", products: [{ _id, name, retailer }] }
      final orderId = data['orderId']?.toString() ?? '';
      final products = data['products'] as List? ?? [];

      if (orderId.isNotEmpty) {
        // Show order review dialog
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => ReviewDialog(
            orderId: orderId,
            items: products.map((e) => Map<String, dynamic>.from(e as Map)).toList(),
            retailerId: products.isNotEmpty
                ? (products[0] as Map)['retailer']?.toString() ?? ''
                : '',
            isOrderReview: true,
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    final socket = ref.read(socketServiceProvider);
    final user = ref.read(currentUserProvider);
    if (user != null) {
      socket.leaveUserRoom(user.id);
    }
    socket.offOrderDelivered();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cart = CartProviderScope.of(context);
    final bool showSummary =
        cart.itemCount > 0 && _controller.currentIndex != 2;

    // Global Auth Listener to redirect on logout/session expiry
    ref.listen(isAuthenticatedProvider, (previous, next) {
      if (next == false) {
        Navigator.pushNamedAndRemoveUntil(
            context, AppRoutes.login, (route) => false);
      }
    });

    return MainControllerScope(
      controller: _controller,
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (bool didPop, Object? result) async {
          if (didPop) return;

          if (_controller.currentIndex != 0) {
            _controller.changePage(0);
            return;
          }

          final now = DateTime.now();
          if (_lastPressedAt == null ||
              now.difference(_lastPressedAt!) > const Duration(seconds: 2)) {
            _lastPressedAt = now;
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Press back again to exit the app.',
                  style: TextStyle(color: Colors.white, fontSize: 13),
                ),
                backgroundColor: Color(0xFF14532D),
                duration: Duration(seconds: 2),
                behavior: SnackBarBehavior.floating,
                margin: EdgeInsets.all(20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
              ),
            );
            return;
          }
          SystemNavigator.pop();
        },
        child: Scaffold(
          backgroundColor: AppColors.secondary,
          extendBody: true,
          body: Stack(
            children: [
              Positioned.fill(
                child: IndexedStack(
                  index: _controller.currentIndex,
                  children: _pages,
                ),
              ),
              if (showSummary)
                Positioned(
                  bottom: 110, // Just above the custom bottom bar (height ~100)
                  left: 0,
                  right: 0,
                  child: CartSummaryBar(cart: cart),
                ),
            ],
          ),
          bottomNavigationBar: _buildCustomBottomBar(),
        ),
      ),
    );
  }

  Widget _buildCustomBottomBar() {
    bool isCartSelected = _controller.currentIndex == 2;
    return Container(
      height: 100,
      decoration: const BoxDecoration(color: Colors.transparent),
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          // Background Bar
          Container(
            height: 70,
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 20),
            decoration: BoxDecoration(
              color: AppColors.secondary,
              borderRadius: BorderRadius.circular(35),
              border:
                  Border.all(color: AppColors.primary.withValues(alpha: 0.1)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_filled, 'Home'),
                _buildNavItem(1, Icons.local_shipping_outlined, 'Daily'),
                const SizedBox(width: 68), // Space for FAB
                _buildNavItem(3, Icons.wallet_rounded, 'Wallet'),
                _buildNavItem(4, Icons.person_rounded, 'Profile'),
              ],
            ),
          ),
          // Central FAB (Cart)
          Positioned(
            top: 5,
            child: GestureDetector(
              onTap: () {
                // Anyone can see the cart, but they must login to checkout (handled in CartPage)
                _controller.changePage(2);
              },
              child: Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isCartSelected
                        ? AppColors.primary
                        : AppColors.primary.withValues(alpha: 0.2),
                    width: 2,
                  ),
                ),
                child: Center(
                  child: Icon(
                    Icons.shopping_cart_outlined,
                    color: isCartSelected
                        ? AppColors.primary
                        : const Color.fromARGB(255, 69, 68, 66),
                    size: 34,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    bool isSelected = _controller.currentIndex == index;
    return GestureDetector(
      onTap: () {
        _controller.changePage(index);
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isSelected ? AppColors.primary : const Color(0xFF4A4A4A),
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? AppColors.primary : const Color(0xFF4A4A4A),
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
