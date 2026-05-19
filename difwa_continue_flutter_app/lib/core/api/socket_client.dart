
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../../app/core/config/api_config.dart';
import '../state/auth_store.dart';

class SocketClient {
  final Ref _ref;
  io.Socket? _socket;
  final String _baseUrl;

  SocketClient(this._ref, this._baseUrl) {
    _init();
    
    // Listen for auth state changes to reconnect with new token
    _ref.listen(authStoreProvider, (previous, next) {
      if (next is AuthAuthenticated && 
          previous is! AuthAuthenticated) {
        connect();
      } else if (next is AuthUnauthenticated) {
        disconnect();
      }
    });
  }

  void _init() {
    final authState = _ref.read(authStoreProvider);
    if (authState is AuthAuthenticated) {
      connect();
    }
  }

  Future<void> connect() async {
    final token = await _ref.read(secureStorageProvider).getAccessToken();
    
    if (token == null) {
      return;
    }

    _socket?.disconnect();
    
    _socket = io.io(_baseUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
      'extraHeaders': {'Authorization': 'Bearer $token'}
    });

    _socket?.connect();
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }

  void emit(String event, dynamic data) {
    _socket?.emit(event, data);
  }

  void on(String event, Function(dynamic) handler) {
    _socket?.on(event, handler);
  }
}

final socketClientProvider = Provider<SocketClient>((ref) {
  // Production socket URL
  final socketUrl = ApiConfig.socketUrl; 
  return SocketClient(ref, socketUrl);
});
