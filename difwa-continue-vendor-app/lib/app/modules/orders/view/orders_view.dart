import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../controller/orders_controller.dart';
import '../../../core/constants/app_colors.dart';

enum OrderTypeFilter { all, subscription, oneTime }

class OrderTypeFilterNotifier extends Notifier<OrderTypeFilter> {
  @override
  OrderTypeFilter build() => OrderTypeFilter.all;
  
  void setFilter(OrderTypeFilter filter) => state = filter;
}

final orderTypeFilterProvider = NotifierProvider<OrderTypeFilterNotifier, OrderTypeFilter>(() => OrderTypeFilterNotifier());

class OrdersView extends ConsumerWidget {
  const OrdersView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(ordersControllerProvider);
    final filter = ref.watch(orderTypeFilterProvider);

    if (state.error != null && !state.isLoading) {
      // ... Error state remains the same
      return _buildErrorState(ref, state.error!);
    }

    // Filter counts
    final subscriptionCount = state.orders.where((o) => o['orderType'] == 'Subscription').length;
    final oneTimeCount = state.orders.where((o) => o['orderType'] != 'Subscription').length;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Store Orders', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(ordersControllerProvider.notifier).refresh(),
          ),
        ],
      ),
      body: DefaultTabController(
        length: 2,
        child: Column(
          children: [
            Container(
              color: Colors.white,
              child: TabBar(
                labelColor: AppColors.primary,
                unselectedLabelColor: Colors.grey,
                indicatorColor: AppColors.primary,
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                tabs: [
                  Tab(text: 'PENDING (${state.stats['pendingOrders'] ?? 0})'),
                  Tab(text: 'COMPLETED (${state.stats['completedOrders'] ?? 0})'),
                ],
              ),
            ),
            
            // Subscribed / One-time Filter Chips
            Container(
              height: 60,
              color: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _FilterChip(
                    label: 'All',
                    isSelected: filter == OrderTypeFilter.all,
                    count: state.orders.length,
                    onTap: () => ref.read(orderTypeFilterProvider.notifier).setFilter(OrderTypeFilter.all),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Subscription',
                    isSelected: filter == OrderTypeFilter.subscription,
                    count: subscriptionCount,
                    onTap: () => ref.read(orderTypeFilterProvider.notifier).setFilter(OrderTypeFilter.subscription),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'One-time',
                    isSelected: filter == OrderTypeFilter.oneTime,
                    count: oneTimeCount,
                    onTap: () => ref.read(orderTypeFilterProvider.notifier).setFilter(OrderTypeFilter.oneTime),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            Expanded(
              child: state.isLoading 
                ? const Center(child: CircularProgressIndicator())
                : TabBarView(
                    children: [
                      _OrdersList(
                        orders: _applyFilters(state.orders.where((o) => !['Delivered', 'Completed', 'Cancelled'].contains(o['status'])).toList(), filter),
                        onRefresh: () => ref.read(ordersControllerProvider.notifier).refresh(),
                        onUpdate: (id, status) => ref.read(ordersControllerProvider.notifier).updateStatus(id, status),
                      ),
                      _OrdersList(
                        orders: _applyFilters(state.orders.where((o) => ['Delivered', 'Completed'].contains(o['status'])).toList(), filter),
                        onRefresh: () => ref.read(ordersControllerProvider.notifier).refresh(),
                        onUpdate: (id, status) => ref.read(ordersControllerProvider.notifier).updateStatus(id, status),
                      ),
                    ],
                  ),
            ),
          ],
        ),
      ),
    );
  }

  List<dynamic> _applyFilters(List<dynamic> orders, OrderTypeFilter filter) {
    if (filter == OrderTypeFilter.subscription) {
      return orders.where((o) => o['orderType'] == 'Subscription').toList();
    } else if (filter == OrderTypeFilter.oneTime) {
      return orders.where((o) => o['orderType'] != 'Subscription').toList();
    }
    return orders;
  }

  Widget _buildErrorState(WidgetRef ref, String error) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off_rounded, size: 80, color: Colors.indigoAccent),
              const SizedBox(height: 24),
              const Text(
                'COULD NOT LOAD ORDERS',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.black, letterSpacing: -1),
              ),
              const SizedBox(height: 12),
              Text(
                error,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey, fontSize: 16),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () => ref.read(ordersControllerProvider.notifier).refresh(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('RETRY LOADING', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final int count;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : Colors.grey.shade200,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppColors.primary : Colors.black54,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : Colors.grey.shade300,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '$count',
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrdersList extends StatelessWidget {
  final List<dynamic> orders;
  final VoidCallback onRefresh;
  final Function(String, String) onUpdate;

  const _OrdersList({
    required this.orders,
    required this.onRefresh,
    required this.onUpdate,
  });

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.inbox_outlined, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            const Text('No orders found', style: TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async => onRefresh(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          return _OrderCard(
            order: order,
            onUpdate: onUpdate,
          ).animate().fadeIn(delay: (index * 50).ms).slideX(begin: 0.1, duration: 300.ms);
        },
      ),
    );
  }
}

class _OrderCard extends ConsumerWidget {
  final dynamic order;
  final Function(String, String) onUpdate;

  const _OrderCard({required this.order, required this.onUpdate});

  void _showOrderDetails(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _OrderDetailsModal(order: order, onUpdate: onUpdate),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = order['status'] ?? 'Unknown';
    final isSubscription = order['orderType'] == 'Subscription';

    return GestureDetector(
      onTap: () => _showOrderDetails(context, ref),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade100),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          '#${(order['id'] ?? '...').toString()}',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      _StatusBadge(status: status),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.shopping_bag_outlined, size: 16, color: Colors.grey),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          order['product'] ?? 'Products',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (isSubscription)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('SUB', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.blue)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        order['date'] ?? '',
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      Text(
                        '₹${order['price']}',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderDetailsModal extends ConsumerWidget {
  final dynamic order;
  final Function(String, String) onUpdate;

  const _OrderDetailsModal({required this.order, required this.onUpdate});

  void _showRiderPicker(BuildContext context, WidgetRef ref) async {
    final riders = await ref.read(ordersControllerProvider.notifier).fetchRiders();
    if (!context.mounted) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Select Rider', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            if (riders.isEmpty)
              const Center(child: Padding(padding: EdgeInsets.all(20), child: Text('No riders added yet', style: TextStyle(color: Colors.grey))))
            else
              ...riders.map((r) => ListTile(
                leading: CircleAvatar(backgroundColor: Colors.indigo.shade50, child: const Icon(Icons.person, color: Colors.indigo)),
                title: Text(r['user']?['name'] ?? 'Unknown Rider'),
                subtitle: Text(r['user']?['phone'] ?? 'N/A'),
                onTap: () async {
                  final success = await ref.read(ordersControllerProvider.notifier)
                      .assignRider(order['id'], r['user']?['_id'] ?? r['user']?['id']);
                  if (success && context.mounted) {
                    Navigator.pop(context); // Close picker
                    Navigator.pop(context); // Close details
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Rider assigned successfully!')));
                  }
                },
              )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = order['status'] ?? 'Pending';
    final history = order['statusHistory'] as List<dynamic>? ?? [];
    
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Order #${order['id'] ?? ''}', 
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                      Text(order['product'] ?? 'Products', 
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                    ],
                  ),
                ),
                IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close_rounded)),
              ],
            ),
            const SizedBox(height: 20),
            
            _SectionHeader(title: 'CURRENT STATUS'),
            const SizedBox(height: 8),
            _StatusBadge(status: status),
            const SizedBox(height: 24),

            if (history.isNotEmpty) ...[
               _SectionHeader(title: 'STATUS HISTORY'),
               const SizedBox(height: 16),
               ...history.map((h) => _TimelineItem(
                 status: h['status'] ?? 'Updated',
                 role: h['role'] ?? 'system',
                 time: h['timestamp'] ?? '',
                 isLast: history.indexOf(h) == history.length - 1,
               )),
               const SizedBox(height: 32),
            ],

            _SectionHeader(title: 'STATUS CONTROL'),
            const SizedBox(height: 12),
            if (status == 'Pending')
              _ActionButton(
                label: 'ACCEPT ORDER',
                color: AppColors.primary,
                onPressed: () {
                  onUpdate(order['id'], 'Accepted');
                  Navigator.pop(context);
                },
              ),
            if (status == 'Accepted')
              _ActionButton(
                label: 'START PROCESSING',
                color: Colors.blue,
                onPressed: () {
                  onUpdate(order['id'], 'Processing');
                  Navigator.pop(context);
                },
              ),
            if (status == 'Processing' || status == 'Preparing' || status == 'Accepted')
              _ActionButton(
                label: order['rider'] != null ? 'CHANGE RIDER' : 'ASSIGN RIDER',
                color: Colors.indigoAccent,
                onPressed: () => _showRiderPicker(context, ref),
              ),
             const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('DISMISS', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(title, 
      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.grey.shade400, letterSpacing: 1));
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onPressed;

  const _ActionButton({required this.label, required this.color, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 0.5)),
      ),
    );
  }
}

class _TimelineItem extends StatelessWidget {
  final String status;
  final String role;
  final String time;
  final bool isLast;

  const _TimelineItem({
    required this.status,
    required this.role,
    required this.time,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    String formattedTime = '';
    try {
      final date = DateTime.parse(time);
      formattedTime = '${date.day} Mar, ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')} ${date.hour >= 12 ? 'pm' : 'am'}';
    } catch (_) {
      formattedTime = time.toString();
    }

    return IntrinsicHeight(
      child: Row(
        children: [
          Column(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: isLast ? Colors.blue : Colors.grey.shade300,
                  shape: BoxShape.circle,
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: Colors.grey.shade200,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(status, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(role.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.blue)),
                    ),
                    const Spacer(),
                    Text(formattedTime, style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                  ],
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color = Colors.grey;
    Color bg = Colors.grey.shade50;

    switch (status) {
      case 'Pending': color = Colors.orange; bg = Colors.orange.shade50; break;
      case 'Accepted': color = Colors.blue; bg = Colors.blue.shade50; break;
      case 'Processing':
      case 'Preparing': color = Colors.indigo; bg = Colors.indigo.shade50; break;
      case 'Delivered':
      case 'Completed': color = Colors.green; bg = Colors.green.shade50; break;
      case 'Out for Delivery': color = Colors.deepOrange; bg = Colors.deepOrange.shade50; break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 0.5),
      ),
    );
  }
}
