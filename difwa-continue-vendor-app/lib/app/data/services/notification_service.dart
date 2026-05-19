import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';

class NotificationService {
  final ApiClient _apiClient;

  NotificationService(this._apiClient);

  Future<List<dynamic>> getNotifications() async {
    try {
      final response = await _apiClient.get('/notifications');
      if (response != null && response['success'] == true) {
        return response['notifications'] ?? response['data'] ?? [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> markAsRead(String id) async {
    try {
      final response = await _apiClient.patch('/notifications/read/$id');
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> markAllAsRead() async {
    try {
      final response = await _apiClient.patch('/notifications/read-all');
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }
}

final notificationServiceProvider = Provider<NotificationService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return NotificationService(apiClient);
});
