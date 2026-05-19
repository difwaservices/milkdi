import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'auth_interceptor.dart';
import '../storage/secure_storage_service.dart';

final storageServiceProvider = Provider((ref) => SecureStorageService());

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: dotenv.env['API_BASE_URL'] ?? 'https://difwa-backend.vercel.app/api',
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
    ),
  );

  final storage = ref.watch(storageServiceProvider);
  dio.interceptors.addAll([
    AuthInterceptor(dio, storage),
    LogInterceptor(requestBody: true, responseBody: true), // For debugging
  ]);

  return dio;
});
