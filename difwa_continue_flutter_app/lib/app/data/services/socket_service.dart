import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../../core/config/api_config.dart';
import 'package:dio/dio.dart';
import '../../../core/api/api_provider.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../providers/notification_provider.dart';
import 'fcm_service.dart';

/// Singleton Socket.IO wrapper — connects once per session.
/// Uses the auth token in headers so the server can authenticate the client.
class SocketService {
  static const String _orderUpdateEvent = 'orderUpdate';
  static const String _riderAssignedEvent = 'riderAssigned';
  static const String _orderDeliveredEvent = 'orderDelivered';
  static const String _newOrderEvent =
      'newOrderAssigned'; // rider receives new order

  io.Socket? _socket;
  bool _initialized = false;
  final List<Map<String, dynamic>> _emitQueue = [];
  final Dio _dio = Dio();
  ProviderContainer? _container;

  // ── Connection ─────────────────────────────────────────────────────────────

  Future<void> _wakeUpRender(String url) async {
    try {
      debugPrint('🚀 Poking Render server to wake up: $url');
      // Just a quick HTTP ping to wake the server up
      await _dio.get(url);
      debugPrint('✅ Render Poked!');
    } catch (e) {
      // Ignore errors, we just need to hit the server
      debugPrint('⚠️ Render poke finished (likely 404/ignored): $e');
    }
  }

  Future<void> connect(SecureStorageService storage, [ProviderContainer? container]) async {
    if (_initialized && (_socket?.connected ?? false)) return;
    if (container != null) _container = container;

    final token = await storage.getAccessToken();
    final baseUrl = ApiConfig.socketUrl;
    final apiBaseUrl = ApiConfig.baseUrl;

    // 1. Poke Render (both API and Socket URLs) to wake up
    unawaited(_wakeUpRender(baseUrl));
    if (apiBaseUrl.isNotEmpty) {
      unawaited(_wakeUpRender(apiBaseUrl));
    }

    // Give the server more time to boot up if it's cold
    debugPrint('⏳ Giving Render 12s head start to boot...');
    await Future.delayed(const Duration(seconds: 12));

    _socket?.disconnect();
    _socket?.dispose();

    final Map<String, dynamic> headers =
        token != null ? {'Authorization': 'Bearer $token'} : {};

    debugPrint('🔌 Initializing socket with autoConnect...');
    _socket = io.io(
      baseUrl,
      <String, dynamic>{
        'transports': ['polling', 'websocket'],
        'autoConnect': true,
        'extraHeaders': headers,
        'reconnection': true,
        'reconnectionAttempts': 30, // Increase for very slow cold starts
        'reconnectionDelay': 8000,
        'timeout': 180000, // 3 minutes timeout
      },
    );


    _socket!.onConnect((_) {
      debugPrint('✅ SocketService connected');
      _flushQueue();

      // Setup global notification listener
      onNotification((data) {
        debugPrint('🔔 New Socket Notification: $data');
        if (_container != null) {
          _container!.invalidate(notificationsProvider);
        }
        
        // Show local notification if the app is in foreground
        try {
          final title = data['title'] ?? 'New Notification';
          final body = data['message'] ?? '';
          FCMService.showNotification(title: title, body: body);
        } catch (e) {
          debugPrint('❌ Error showing socket notification: $e');
        }
      });
    });
    _socket!.onDisconnect((_) => debugPrint('🔌 SocketService disconnected'));
    _socket!.onConnectError((err) {
      debugPrint('⚠️ SocketService connect error: $err');
    });
    _socket!.onError((err) => debugPrint('💥 SocketService error: $err'));

    // Reconnection logs
    _socket!.onReconnect((_) => debugPrint('♻️ SocketService reconnected'));
    _socket!.onReconnectAttempt((count) =>
        debugPrint('🔄 SocketService reconnection attempt: $count'));
    _socket!.onReconnectError(
        (err) => debugPrint('❌ SocketService reconnection error: $err'));
    _socket!.onReconnectFailed(
        (_) => debugPrint('🛑 SocketService reconnection failed'));

    _initialized = true;
  }

  void _flushQueue() {
    if (_emitQueue.isEmpty) return;
    debugPrint('📤 Flushing ${_emitQueue.length} queued emits');
    final items = List<Map<String, dynamic>>.from(_emitQueue);
    _emitQueue.clear();
    for (final item in items) {
      _emit(item['event'], item['data']);
    }
  }

  void disconnect() {
    _socket?.disconnect();
    _initialized = false;
  }

  bool get isConnected => _socket?.connected ?? false;

  // ── Room Management ───────────────────────────────────────────────────────

  /// JOIN user room — call immediately after login for all-orders updates.
  /// `socket.emit("join", "user_{userId}")`
  void joinUserRoom(String userId) {
    _emit('join', 'user_$userId');
    debugPrint('👤 Joined user room: user_$userId');
  }

  void leaveUserRoom(String userId) {
    _emit('leave', 'user_$userId');
    debugPrint('👤 Left user room: user_$userId');
  }

  /// JOIN rider room — rider receives new order assignments here.
  /// `socket.emit("join", "rider_{riderId}")`
  void joinRiderRoom(String riderId) {
    _emit('join', 'rider_$riderId');
    debugPrint('🛵 Joined rider room: rider_$riderId');
  }

  void leaveRiderRoom(String riderId) {
    _emit('leave', 'rider_$riderId');
    debugPrint('🛵 Left rider room: rider_$riderId');
  }

  /// JOIN specific order room — for real-time status during tracking.
  /// `socket.emit("join", "order_{orderId}")`
  void joinOrderRoom(String orderId) {
    _emit('join', 'order_$orderId');
    debugPrint('📦 Joined order room: order_$orderId');
  }

  void leaveOrderRoom(String orderId) {
    _emit('leave', 'order_$orderId');
  }

  /// JOIN retailer notifications room — for real-time app notifications.
  /// `socket.emit("join", "retailer_notifications_{userId}")`
  void joinRetailerNotificationRoom(String userId) {
    _emit('join', 'retailer_notifications_$userId');
    debugPrint('🔔 Joined retailer notification room: retailer_notifications_$userId');
  }

  void leaveRetailerNotificationRoom(String userId) {
    _emit('leave', 'retailer_notifications_$userId');
    debugPrint('🔔 Left retailer notification room: retailer_notifications_$userId');
  }

  // ── Rider location broadcasting ──────────────────────────────────────────

  /// Rider emits their GPS coordinates during active delivery.
  void emitRiderLocation({
    required String orderId,
    required double lat,
    required double lng,
  }) {
    _emit('riderLocation', {'orderId': orderId, 'lat': lat, 'lng': lng});
  }

  // ── Listeners ─────────────────────────────────────────────────────────────

  /// `orderUpdate` — fires on every status change.
  /// Payload: `{ status: "Out for Delivery", orderId: "ORD-...", data: {...} }`
  /// `orderUpdate` — fires on every status change.
  /// Payload: `{ status: "Out for Delivery", orderId: "ORD-...", data: {...} }`
  void onOrderUpdate(void Function(dynamic) callback) {
    _socket?.on(_orderUpdateEvent, callback);
  }

  void offOrderUpdate([void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off(_orderUpdateEvent, callback);
    } else {
      _socket?.off(_orderUpdateEvent);
    }
  }

  /// `riderAssigned` — fires when a rider is assigned to a user's order.
  /// Payload: `{ riderId, riderName, riderPhone, orderId }`
  void onRiderAssigned(void Function(dynamic) callback) {
    _socket?.on(_riderAssignedEvent, callback);
  }

  void offRiderAssigned([void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off(_riderAssignedEvent, callback);
    } else {
      _socket?.off(_riderAssignedEvent);
    }
  }

  /// `newOrderAssigned` — fires on the RIDER side when a new order is dispatched.
  /// Payload: `{ orderId, customerName, deliveryAddress, ... }`
  void onNewOrderAssigned(void Function(dynamic) callback) {
    _socket?.on(_newOrderEvent, callback);
  }

  void offNewOrderAssigned([void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off(_newOrderEvent, callback);
    } else {
      _socket?.off(_newOrderEvent);
    }
  }

  /// `shopStatusUpdate` — fires when a retailer toggles status.
  /// Payload: `{ shopId: "65e...", isShopActive: false }`
  void onShopStatusUpdate(void Function(dynamic) callback) {
    _socket?.on('shopStatusUpdate', callback);
  }

  void offShopStatusUpdate([void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off('shopStatusUpdate', callback);
    } else {
      _socket?.off('shopStatusUpdate');
    }
  }

  /// `orderDelivered` — fires when an order is successfully delivered.
  /// Payload: `{ orderId: "...", products: [...] }`
  void onOrderDelivered(void Function(dynamic) callback) {
    _socket?.on(_orderDeliveredEvent, callback);
  }

  void offOrderDelivered([void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off(_orderDeliveredEvent, callback);
    } else {
      _socket?.off(_orderDeliveredEvent);
    }
  }

  /// `notification` — fires when a new real-time notification is generated for the user.
  void onNotification(void Function(dynamic) callback) {
    _socket?.on('notification', callback);
  }

  void offNotification([void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off('notification', callback);
    } else {
      _socket?.off('notification');
    }
  }

  /// Generic remove listener.
  void offEvent(String event, [void Function(dynamic)? callback]) {
    if (callback != null) {
      _socket?.off(event, callback);
    } else {
      _socket?.off(event);
    }
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  void _emit(String event, dynamic data) {
    if (_socket == null || !isConnected) {
      debugPrint('⏳ SocketService._emit queued — not connected ($event)');
      _emitQueue.add({'event': event, 'data': data});
      return;
    }
    _socket!.emit(event, data);
  }

  void dispose() {
    _socket?.dispose();
    _socket = null;
    _initialized = false;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

final socketServiceProvider = Provider<SocketService>((ref) {
  final service = SocketService();

  // Connect when the provider is first read
  final storage = ref.read(storageServiceProvider);
  service.connect(storage, ref.container);

  ref.onDispose(service.dispose);
  return service;
});
