import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import '../network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../routes/app_routes.dart';
import '../providers/notification_provider.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you need to use Firebase services here, call Firebase.initializeApp()
  debugPrint("Handling a background message: ${message.messageId}");
  
  // Handled automatically by the OS if 'notification' block is present.
  // If it's a DATA ONLY message, we must show it manually.
  if (message.notification == null && message.data.isNotEmpty) {
     // NOTE: We can't use the static singleton directly here easily if it's not initialized
     // in this isolate. However, for background, we usually rely on the OS to show
     // the notification if the backend includes the 'notification' payload.
  }
}

class FCMService {
  static final FCMService _instance = FCMService._internal();
  factory FCMService() => _instance;
  FCMService._internal();

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  static const _androidChannel = AndroidNotificationChannel(
    'difwa_high_importance',
    'Difwa Notifications',
    description: 'Important notifications for orders, OTPs, and updates',
    importance: Importance.max,
  );

  static ProviderContainer? _container;

  static Future<void> init(ProviderContainer container) async {
    _container = container;
    // Background handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // Create Android notification channel
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_androidChannel);

    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    await _localNotifications.initialize(
      const InitializationSettings(android: androidSettings, iOS: iosSettings),
      onDidReceiveNotificationResponse: (response) {
        if (response.payload != null) {
          try {
            final data = jsonDecode(response.payload!) as Map<String, dynamic>;
            _handleNavigationFromData(data);
          } catch (e) {
            debugPrint('❌ Error parsing local notification payload: $e');
          }
        }
      },
    );

    // Request permissions
    await FCMService().requestPermission();

    // Foreground listening
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('🔔 Got a message whilst in the foreground!');
      debugPrint('Message data: ${message.data}');

      // Live update the notification list
      if (_container != null) {
        _container!.invalidate(notificationsProvider);
      }

      if (message.notification != null) {
        showNotification(
          title: message.notification!.title ?? 'New Notification',
          body: message.notification!.body ?? '',
          data: message.data,
        );
      }
    });

    // Handle interaction when app is in background but not terminated
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint('🔔 Notification caused app to open from background!');
      _handleNavigationFromMessage(message);
    });

    // Handle interaction when app is terminated
    FirebaseMessaging.instance
        .getInitialMessage()
        .then((RemoteMessage? message) {
      if (message != null) {
        debugPrint('🔔 Notification caused app to open from terminated state!');
        _handleNavigationFromMessage(message);
      }
    });

    listenToTokenRefresh();

    // Initial token send (if user is already logged in)
    await sendTokenToBackend();

    debugPrint('✅ FCMService initialized (Real Firebase)');
  }

  static void _handleNavigationFromMessage(RemoteMessage message) {
    _handleNavigationFromData(Map<String, dynamic>.from(message.data));
  }

  static void _handleNavigationFromData(Map<String, dynamic> data) {
    debugPrint('🔔 Navigating from notification data: $data');

    final context = navigatorKey.currentContext;
    if (context == null) {
      debugPrint('⚠️ Navigator context is null, cannot redirect');
      return;
    }

    // Example based on common FCM payloads
    final String type = (data['type']?.toString() ?? '').toUpperCase();
    final String id = (data['id'] ?? data['orderId'] ?? '').toString();

    if (type == 'ORDER' || type == 'NEW_ORDER') {
      Navigator.pushNamed(context, AppRoutes.trackOrder,
          arguments: {'orderId': id});
    } else if (type == 'RIDER_ORDER' || type == 'RIDER_ASSIGNED') {
      Navigator.pushNamed(context, AppRoutes.riderOrderDetails,
          arguments: {'orderId': id});
    } else if (type == 'WALLET' || type == 'PAYMENT') {
      Navigator.pushNamed(context, AppRoutes.wallet);
    } else if (type == 'NOTIFICATION' || type == 'GENERAL' || type == 'SYSTEM') {
      Navigator.pushNamed(context, AppRoutes.notifications);
    }
  }

  Future<void> requestPermission() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;
    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );
    debugPrint('🔔 User granted permission: ${settings.authorizationStatus}');
  }

  Future<String?> getToken() async {
    try {
      final String? token = await FirebaseMessaging.instance.getToken();
      debugPrint('📱 FCM Device Token: $token');
      return token;
    } catch (e) {
      debugPrint('❌ Error getting FCM token: $e');
      return null;
    }
  }

  static Future<void> sendTokenToBackend() async {
    try {
      final token = await FCMService().getToken();
      if (token == null) return;

      final storage = SecureStorageService();
      final authToken = await storage.getAccessToken();
      if (authToken == null) {
        debugPrint('ℹ️ Skip sending FCM token: User not logged in');
        return;
      }

      if (_container != null) {
        final client = _container!.read(apiClientProvider);
        await client.put(
          '${ApiClient.baseUrl}/profile',
          data: {'fcmToken': token},
          requiresAuth: true,
        );
      } else {
        // Fallback for cases where container is not yet available
        final client = ApiClient.createDefault();
        await client.put(
          '${ApiClient.baseUrl}/profile',
          data: {'fcmToken': token},
          requiresAuth: true,
        );
      }
      debugPrint('✅ Device token sent to backend');
    } catch (e) {
      debugPrint('⚠️ Failed to send device token to backend: $e');
    }
  }

  static void listenToTokenRefresh() {
    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
      debugPrint('🔄 FCM Token refreshed!');
      // Optional: Send to backend immediately if logged in
      await sendTokenToBackend();
    });
  }

  static Future<void> showNotification({
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    try {
      final String? payload = data != null ? jsonEncode(data) : null;
      await _localNotifications.show(
        title.hashCode,
        title,
        body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            _androidChannel.id,
            _androidChannel.name,
            channelDescription: _androidChannel.description,
            importance: Importance.max,
            priority: Priority.high,
            icon: '@mipmap/ic_launcher',
          ),
          iOS: const DarwinNotificationDetails(),
        ),
        payload: payload,
      );
    } catch (e) {
      debugPrint('❌ Error showing local notification: $e');
    }
  }
}
