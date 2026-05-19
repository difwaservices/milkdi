import 'dart:async';
import 'package:dio/dio.dart';
import '../storage/secure_storage_service.dart';

class AuthInterceptor extends QueuedInterceptor {
  final Dio _dio;
  final SecureStorageService _storage;
  
  static final _logoutController = StreamController<String>.broadcast();
  static Stream<String> get onForceLogoutStream => _logoutController.stream;
  
  static bool _isRefreshing = false;
  late final Dio _refreshDio;

  AuthInterceptor(this._dio, this._storage) {
    _refreshDio = Dio(BaseOptions(baseUrl: _dio.options.baseUrl));
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final bool requiresAuth = options.extra['requiresAuth'] ?? false;
    
    if (!requiresAuth) {
      return handler.next(options);
    }

    final String? token = await _storage.getAccessToken();

    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final bool requiresAuth = err.requestOptions.extra['requiresAuth'] ?? false;
    final bool is401 = err.response?.statusCode == 401;

    if (is401 && requiresAuth) {
      if (err.requestOptions.path.contains('/auth/refresh')) {
         return handler.next(err);
      }

      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null || refreshToken.isEmpty) {
        _onRefreshFailed('No refresh token available');
        return handler.next(err);
      }

      try {
        String? newAccessToken;

        if (!_isRefreshing) {
          _isRefreshing = true;
          try {
            final response = await _refreshDio.post('/app/auth/refresh', data: {
              'refreshToken': refreshToken,
            });

            if (response.statusCode == 200) {
              newAccessToken = response.data['accessToken'] ?? response.data['token'];
              final newRefreshToken = response.data['refreshToken'] ?? refreshToken;

              await _storage.saveTokens(
                access: newAccessToken!,
                refresh: newRefreshToken,
              );
            } else {
               throw Exception('Refresh failed');
            }
          } finally {
            _isRefreshing = false;
          }
        } else {
          for (int i = 0; i < 10; i++) {
             await Future.delayed(const Duration(milliseconds: 500));
             if (!_isRefreshing) break;
          }
          newAccessToken = await _storage.getAccessToken();
        }

        if (newAccessToken != null) {
          final opts = err.requestOptions;
          opts.headers['Authorization'] = 'Bearer $newAccessToken';
          
          final retryResponse = await _dio.fetch(opts);
          return handler.resolve(retryResponse);
        } else {
          _onRefreshFailed('Token refresh failed');
          return handler.next(err);
        }
      } catch (e) {
        _onRefreshFailed('Exception during refresh');
        return handler.next(err);
      }
    }
    return handler.next(err);
  }

  void _onRefreshFailed(String reason) {
    _storage.clearAll();
    _logoutController.add(reason);
  }
}
