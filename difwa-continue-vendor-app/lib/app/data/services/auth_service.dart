import '../network/api_client.dart';
import '../../core/storage/secure_storage_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:convert';

class AuthService {
  final ApiClient _apiClient;
  final SecureStorageService _storage;

  AuthService(this._apiClient, this._storage);

  Future<Map<String, dynamic>> login(String phone, String password) async {
    try {
      final response = await _apiClient.post(
        '/auth/login',
        data: {
          'email': phone, // Input can be email or phone
          'password': password,
        },
        requiresAuth: false,
      );

      if (response != null && response['token'] != null) {
        final token = response['token'];
        final refreshToken = response['refreshToken'] ?? '';
        final user = response['user'];

        if (user['role'] != 'retailer') {
          return {'success': false, 'message': 'Unauthorized: Not a retailer account.'};
        }

        await _storage.saveTokens(access: token, refresh: refreshToken);
        await _storage.saveUser(jsonEncode(user));
        return {'success': true, 'user': user};
      }
      return {'success': false, 'message': response?['message'] ?? 'Login failed. Please check your credentials.'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<void> logout() async {
    await _storage.clearAll();
  }

  Future<Map<String, dynamic>?> getCurrentUser() async {
    final userData = await _storage.getUser();
    if (userData != null) {
      return jsonDecode(userData);
    }
    return null;
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final storage = ref.watch(storageServiceProvider);
  return AuthService(apiClient, storage);
});
