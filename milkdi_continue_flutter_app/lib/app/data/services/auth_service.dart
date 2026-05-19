import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/auth_models.dart';
import '../network/api_client.dart';
import 'package:logger/logger.dart';
import 'fcm_service.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(client: ref.watch(apiClientProvider));
});

final userProfileProvider = FutureProvider.autoDispose<UserModel>((ref) async {
  // keepAlive: Profile page prefers authStoreProvider (no network call).
  // This provider is only a fallback — cache it for the session to avoid
  // re-fetching every time the user navigates away from Profile and returns.
  ref.keepAlive();
  final response = await ref.watch(authServiceProvider).getProfile();
  if (response.success && response.data != null) {
    return response.data!;
  }
  throw Exception(response.message);
});

/// Service layer for authentication.
class AuthService {
  final ApiClient _client;
  final Logger _logger = Logger();

  AuthService({required ApiClient client}) : _client = client;

  // ── Update Name (Requested Endpoint) ──────────────────────────────────────
  Future<AuthResponseModel> updateName({required String fullName}) async {
    try {
      final json = await _client.put(
        '${ApiClient.baseUrl}/update-name',
        data: {'fullName': fullName},
        requiresAuth: true,
      );
      return AuthResponseModel.fromJson(json);
    } on ApiException catch (e) {
      return AuthResponseModel(success: false, message: e.message);
    } catch (e) {
      return AuthResponseModel(success: false, message: e.toString());
    }
  }


  Future<AuthResponseModel> sendOtp({
    required String phoneNumber,
  }) async {
    try {
      final data = await _client.post(
        '/app/auth/send-otp',
        data: {
          'phoneNumber': phoneNumber,
        },
      );
      final response = AuthResponseModel.fromJson(data);
      if (response.success && response.otp != null) {
        _logger.w('VERIFICATION OTP FOR $phoneNumber IS: ${response.otp}');
      }
      return response;
    } on ApiException catch (e) {
      return AuthResponseModel(success: false, message: e.message);
    } catch (e) {
      return AuthResponseModel(success: false, message: e.toString());
    }
  }

  Future<AuthResponseModel> verifyOtp({
    required String phoneNumber,
    required String otp,
  }) async {
    try {
      String? fcmToken;
      try {
        fcmToken = await FCMService().getToken();
      } catch (e) {
        _logger.w('Could not fetch FCM Token for verifyOtp: $e');
      }

      final data = await _client.post(
        '/app/auth/verify-otp',
        data: {
          'phoneNumber': phoneNumber,
          'otp': otp,
          'fcmToken': fcmToken,
        },
      );
      final response = AuthResponseModel.fromJson(data);
      if (response.success &&
          response.token != null &&
          response.token!.isNotEmpty) {
        _logger.i('OTP Verified successfully. Token obtained.');
        await ApiClient.saveToken(response.token!);
      }
      return response;
    } on ApiException catch (e) {
      return AuthResponseModel(success: false, message: e.message);
    } catch (e) {
      return AuthResponseModel(success: false, message: e.toString());
    }
  }

  // ── Profile ───────────────────────────────────────────────────────────────
  Future<AuthResponseModel> getProfile() async {
    try {
      final data = await _client.get(
        '${ApiClient.baseUrl}/profile',
        requiresAuth: true,
      );
      return AuthResponseModel.fromJson(data);
    } on ApiException catch (e) {
      return AuthResponseModel(success: false, message: e.message);
    } catch (e) {
      return AuthResponseModel(
          success: false, message: 'Unexpected error: ${e.toString()}');
    }
  }

  Future<AuthResponseModel> updateProfile({
    required String fullName,
    required String email,
  }) async {
    try {
      final data = await _client.put(
        '${ApiClient.baseUrl}/profile',
        data: {
          'fullName': fullName,
          'email': email,
        },
        requiresAuth: true,
      );
      return AuthResponseModel.fromJson(data);
    } on ApiException catch (e) {
      return AuthResponseModel(success: false, message: e.message);
    } catch (e) {
      return AuthResponseModel(
          success: false, message: 'Unexpected error: ${e.toString()}');
    }
  }

  // ── Update FCM Token ─────────────────────────────────────────────────────
  Future<AuthResponseModel> updateFcmToken({required String fcmToken}) async {
    try {
      final json = await _client.put(
        '${ApiClient.baseUrl}/profile',
        data: {'fcmToken': fcmToken},
        requiresAuth: true,
      );
      return AuthResponseModel.fromJson(json);
    } on ApiException catch (e) {
      return AuthResponseModel(success: false, message: e.message);
    } catch (e) {
      return AuthResponseModel(success: false, message: e.toString());
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  Future<void> logout() async {
    await ApiClient.clearToken();
  }
}
