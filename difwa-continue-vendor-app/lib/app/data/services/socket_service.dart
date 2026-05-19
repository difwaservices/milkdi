import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../../core/storage/secure_storage_service.dart';

class SocketService {
  static const String _orderUpdateEvent = 'orderUpdate';
  
  io.Socket? _socket;
  bool _initialized = false;
  final List<Map<String, dynamic>> _emitQueue = [];

  Future<void> connect(SecureStorageService storage) async {
    if (_initialized && (_socket?.connected ?? false)) return;

    final token = await storage.getAccessToken();
    const baseUrl = 'https://shrimpbite-socket-server.onrender.com';

    _socket?.disconnect();
    _socket?.dispose();

    final Map<String, dynamic> headers =
        token != null ? {'Authorization': 'Bearer $token'} : {};

    _socket = io.io(
      baseUrl,
      <String, dynamic>{
        'transports': ['polling', 'websocket'],
        'autoConnect': true,
        'extraHeaders': headers,
        'reconnection': true,
        'reconnectionAttempts': 30,
        'reconnectionDelay': 8000,
        'timeout': 180000,
      },
    );

    _socket!.onConnect((_) {
      debugPrint('✅ Vendor Socket connected');
      _flushQueue();
    });
    
    _socket!.onDisconnect((_) => debugPrint('🔌 Vendor Socket disconnected'));
    
    _initialized = true;
  }

  void _flushQueue() {
    if (_emitQueue.isEmpty) return;
    final items = List<Map<String, dynamic>>.from(_emitQueue);
    _emitQueue.clear();
    for (final item in items) {
      _emit(item['event'], item['data']);
    }
  }

  void joinRetailerRoom(String userId) {
    _emit('join', 'retailer_$userId');
    debugPrint('🏢 Joined retailer room: retailer_$userId');
  }

  void onOrderUpdate(void Function(dynamic) callback) {
    _socket?.on(_orderUpdateEvent, callback);
  }

  void offOrderUpdate() {
    _socket?.off(_orderUpdateEvent);
  }

  void _emit(String event, dynamic data) {
    if (_socket == null || !(_socket?.connected ?? false)) {
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

final socketServiceProvider = Provider<SocketService>((ref) {
  final service = SocketService();
  final storage = ref.read(storageServiceProvider);
  service.connect(storage);
  ref.onDispose(service.dispose);
  return service;
});
