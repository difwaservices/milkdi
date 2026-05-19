import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'app/routes/app_routes.dart';
import 'app/routes/app_pages.dart';
import 'app/data/services/cart_service.dart';
import 'app/data/services/wallet_service.dart';
import 'app/data/services/address_service.dart';
import 'app/data/services/shop_service.dart';
import 'app/data/services/order_service.dart';
import 'app/data/services/db_service.dart';
import 'app/core/theme/app_theme.dart';
import 'package:firebase_core/firebase_core.dart';
import 'app/data/services/fcm_service.dart';
import 'app/data/models/food_models.dart';
import 'app/core/constants/app_images.dart';
import 'app/modules/auth/provider/auth_provider.dart';
import 'firebase_options.dart';

final cartProviderManager = Provider<CartProvider>((ref) {
  final user = ref.watch(currentUserProvider);

  return CartProvider(
    service: ref.watch(cartServiceProvider),
    walletService: ref.watch(walletServiceProvider),
    addressService: ref.watch(addressServiceProvider),
    shopService: ref.watch(shopServiceProvider),
    orderService: ref.watch(orderServiceProvider),
    user: user != null
        ? UserProfile(
            name: user.fullName,
            email: user.email,
            phone: user.phoneNumber,
            profileImage: AppImages.defaultAvatar,
          )
        : null,
  );
});

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  try {
    await dotenv.load(fileName: ".env");
  } catch (e) {
    debugPrint("Warning: Could not load .env file: $e");
  }

  final container = ProviderContainer();
  await FCMService.init(container);

  runApp(
    UncontrolledProviderScope(
      container: container,
      child: const MilkdiApp(),
    ),
  );
}

class MilkdiApp extends ConsumerWidget {
  const MilkdiApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartProvider = ref.watch(cartProviderManager);

    return CartProviderScope(
      provider: cartProvider,
      child: MaterialApp(
        title: 'Milkdi',
        navigatorKey: FCMService.navigatorKey,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        initialRoute: AppRoutes.splash,
        routes: AppPages.routes,
        scrollBehavior: const MaterialScrollBehavior().copyWith(
          physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics()),
        ),
      ),
    );
  }
}
