import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';
import '../models/notification_model.dart';

final notificationsProvider = FutureProvider.autoDispose<List<NotificationModel>>((ref) async {
  final client = ref.read(apiClientProvider);
  try {
    final response = await client.get('/app/notifications', requiresAuth: true);
    final List<dynamic> list = response['data'] as List<dynamic>;
    return list.map((n) => NotificationModel.fromJson(n)).toList();
  } catch (e) {
    return [];
  }
});

final unreadNotificationsCountProvider = Provider.autoDispose<int>((ref) {
  final notificationsAsync = ref.watch(notificationsProvider);
  return notificationsAsync.maybeWhen(
    data: (list) => list.where((n) => !n.isRead).length,
    orElse: () => 0,
  );
});
