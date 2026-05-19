import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/notification_service.dart';

class NotificationState {
  final bool isLoading;
  final List<dynamic> notifications;
  final int unreadCount;
  final String? error;

  NotificationState({
    this.isLoading = false,
    this.notifications = const [],
    this.unreadCount = 0,
    this.error,
  });

  NotificationState copyWith({
    bool? isLoading,
    List<dynamic>? notifications,
    int? unreadCount,
    String? error,
  }) {
    return NotificationState(
      isLoading: isLoading ?? this.isLoading,
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      error: error ?? this.error,
    );
  }
}

class NotificationController extends Notifier<NotificationState> {
  late NotificationService _service;

  @override
  NotificationState build() {
    _service = ref.watch(notificationServiceProvider);
    // Auto-refresh on build
    Future.microtask(() => refresh());
    return NotificationState();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final notifications = await _service.getNotifications();
      final unread = notifications.where((n) => n['isRead'] == false).length;
      state = state.copyWith(
        isLoading: false,
        notifications: notifications,
        unreadCount: unread,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> markAsRead(String id) async {
    final success = await _service.markAsRead(id);
    if (success) {
      refresh();
    }
  }

  Future<void> markAllRead() async {
    final success = await _service.markAllAsRead();
    if (success) {
      refresh();
    }
  }
}

final notificationControllerProvider = NotifierProvider<NotificationController, NotificationState>(() {
  return NotificationController();
});
