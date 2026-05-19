import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import '../controller/notification_controller.dart';
import '../../../core/constants/app_colors.dart';

class NotificationView extends ConsumerWidget {
  const NotificationView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(notificationControllerProvider);
    final controller = ref.read(notificationControllerProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          if (state.unreadCount > 0)
            TextButton(
              onPressed: () => controller.markAllRead(),
              child: const Text('Mark all read', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
            ),
        ],
      ),
      body: state.isLoading && state.notifications.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : state.notifications.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: () => controller.refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    itemCount: state.notifications.length,
                    itemBuilder: (context, index) {
                      final item = state.notifications[index];
                      return _NotificationItem(
                        item: item,
                        onTap: () {
                          if (item['isRead'] == false) {
                            controller.markAsRead(item['_id']);
                          }
                        },
                      ).animate().fadeIn(delay: (index * 50).ms).slideX(begin: 0.1);
                    },
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_none_rounded, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('No notifications yet', style: TextStyle(color: Colors.grey, fontSize: 16)),
        ],
      ),
    );
  }
}

class _NotificationItem extends StatelessWidget {
  final dynamic item;
  final VoidCallback onTap;

  const _NotificationItem({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final bool isRead = item['isRead'] ?? true;
    final DateTime date = DateTime.parse(item['createdAt'] ?? DateTime.now().toIso8601String());
    final String timeAgo = DateFormat('jm').format(date); // Simplified

    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: isRead ? Colors.transparent : AppColors.primary.withOpacity(0.05),
          border: Border(bottom: BorderSide(color: Colors.grey.shade100)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: _getCategoryColor(item['category']).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                _getCategoryIcon(item['category']),
                size: 20,
                color: _getCategoryColor(item['category']),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        item['title'] ?? 'Alert',
                        style: TextStyle(
                          fontWeight: isRead ? FontWeight.w600 : FontWeight.bold,
                          fontSize: 14,
                          color: isRead ? Colors.black87 : Colors.black,
                        ),
                      ),
                      Text(
                        timeAgo,
                        style: const TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['message'] ?? '',
                    style: TextStyle(
                      fontSize: 13,
                      color: isRead ? Colors.grey : Colors.black54,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            if (!isRead)
              Container(
                margin: const EdgeInsets.only(left: 8, top: 2),
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }

  IconData _getCategoryIcon(String? category) {
    switch (category) {
      case 'order': return Icons.shopping_bag_outlined;
      case 'payment': return Icons.receipt_long_outlined;
      case 'stock': return Icons.inventory_2_outlined;
      case 'customer': return Icons.people_outline;
      default: return Icons.notifications_active_outlined;
    }
  }

  Color _getCategoryColor(String? category) {
    switch (category) {
      case 'order': return Colors.blue;
      case 'payment': return Colors.green;
      case 'stock': return Colors.orange;
      case 'customer': return Colors.purple;
      default: return AppColors.primary;
    }
  }
}
