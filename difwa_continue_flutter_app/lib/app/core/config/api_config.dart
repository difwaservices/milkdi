import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Central configuration for API and Socket URLs.
/// All services should use these getters as the single source of truth.
class ApiConfig {
  static String get baseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'https://api.difwa.com/api';

  static String get socketUrl =>
      dotenv.env['SOCKET_URL'] ?? 'https://api.difwa.com';
}
