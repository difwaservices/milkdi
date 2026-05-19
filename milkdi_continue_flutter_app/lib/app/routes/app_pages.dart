import 'package:flutter/material.dart';
import 'app_routes.dart';
import '../modules/splash/splash_page.dart';
import '../modules/auth/mobile_login_page.dart';
import '../modules/auth/otp_verification_page.dart';
import '../modules/auth/onboarding_page.dart';
import '../modules/home/view/main_page.dart';
import '../modules/home/view/search_page.dart';
import '../modules/cart/view/cart_page.dart';
import '../modules/cart/view/shipping_address_page.dart';
import '../modules/cart/view/order_success_page.dart';
import '../modules/orders/view/orders_page.dart';
import '../modules/profile/view/profile_page.dart';
import '../modules/rider/view/rider_main_page.dart';
import '../modules/rider/view/rider_home_page.dart';
import '../modules/rider/view/rider_history_page.dart';
import '../modules/wallet/view/wallet_page.dart';
import '../modules/wallet/view/wallet_statement_screen.dart';
import '../modules/orders/view/track_order_page.dart';
import '../modules/rider/view/rider_order_details_page.dart';
import '../modules/location/view/location_picker_screen.dart';
import '../modules/cart/view/payment_page.dart';
import '../modules/wallet/view/top_up_page.dart';
import '../modules/orders/view/active_orders_page.dart';
import '../modules/notifications/view/notification_page.dart';
import '../modules/support/view/about_page.dart';
import '../modules/support/view/contact_us_page.dart';
import '../modules/support/view/help_support_page.dart';
import '../modules/support/view/faq_page.dart';

class AppPages {
  static Map<String, WidgetBuilder> get routes => {
        AppRoutes.splash: (context) => const SplashPage(),
        AppRoutes.onboarding: (context) => const OnboardingPage(),
        AppRoutes.initialRoute: (context) => const MobileLoginPage(),
        AppRoutes.login: (context) => const MobileLoginPage(),
        AppRoutes.signup: (context) => const MobileLoginPage(),
        AppRoutes.otp: (context) {
          final args = ModalRoute.of(context)?.settings.arguments
              as Map<String, dynamic>?;
          return OtpVerificationPage(
            phoneNumber: args?['phoneNumber'] ?? '',
            otp: args?['otp'] ?? args?['initialOtp'],
          );
        },
        AppRoutes.home: (context) => const MainPage(),
        AppRoutes.search: (context) => const SearchPage(),
        AppRoutes.cart: (context) => const CartPage(),
        AppRoutes.shippingAddress: (context) => const ShippingAddressPage(),
        AppRoutes.orderSuccess: (context) => const OrderSuccessPage(),
        AppRoutes.orderHistory: (context) => const OrdersPage(),
        AppRoutes.profile: (context) => const ProfilePage(),
        AppRoutes.riderHome: (context) => const RiderMainPage(),
        AppRoutes.riderOrders: (context) => const RiderHomePage(),
        AppRoutes.riderHistory: (context) => const RiderHistoryPage(),
        AppRoutes.wallet: (context) => const WalletPage(),
        AppRoutes.walletStatement: (context) => const WalletStatementScreen(),
        AppRoutes.trackOrder: (context) {
          final args = ModalRoute.of(context)?.settings.arguments
              as Map<String, dynamic>?;
          return TrackOrderPage(
            orderId: args?['orderId'] ?? '',
            deliveryAddress: args?['address'],
            status: args?['status'],
          );
        },
        AppRoutes.riderOrderDetails: (context) {
          final args = ModalRoute.of(context)?.settings.arguments
              as Map<String, dynamic>?;
          return RiderOrderDetailsPage(
            order: args?['order'] ?? {},
            orderId: args?['orderId'],
          );
        },
        AppRoutes.locationPicker: (context) => const LocationPickerScreen(),
        AppRoutes.payment: (context) => const PaymentPage(),
        AppRoutes.topUp: (context) => const TopUpPage(),
        AppRoutes.activeOrders: (context) => const ActiveOrdersPage(),
        AppRoutes.notifications: (context) => const NotificationPage(),
        AppRoutes.about: (context) => const AboutPage(),
        AppRoutes.contact: (context) => const ContactUsPage(),
        AppRoutes.help: (context) => const HelpSupportPage(),
        AppRoutes.faq: (context) => const FaqPage(),
      };
}
