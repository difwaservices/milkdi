import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/food_models.dart';
import '../../../data/services/order_service.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_images.dart';
import 'package:url_launcher/url_launcher.dart';
import 'track_order_page.dart';

class ActiveOrdersPage extends ConsumerStatefulWidget {
  const ActiveOrdersPage({super.key});

  @override
  ConsumerState<ActiveOrdersPage> createState() => _ActiveOrdersPageState();
}

class _ActiveOrdersPageState extends ConsumerState<ActiveOrdersPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final activeOrdersAsync = ref.watch(activeOrdersProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5EF), // Very light greenish background from screenshot
      appBar: AppBar(
        title: const Text('Active Orders',
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.white)),
        backgroundColor: AppColors.primaryDark,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
            onPressed: () => ref.invalidate(activeOrdersProvider),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: activeOrdersAsync.when(
        data: (orders) {
          final pendingCancelledOrders = orders
              .where((o) =>
                  o.status.toLowerCase() != 'delivered')
              .toList();

          if (pendingCancelledOrders.isEmpty) {
            return _buildEmptyState(context);
          }
          final sortedOrders = List<UserOrder>.from(pendingCancelledOrders)
            ..sort((a, b) => b.date.compareTo(a.date));
          return RefreshIndicator(
            color: const Color(0xFF14532D),
            onRefresh: () async =>
                ref.read(activeOrdersProvider.notifier).refresh(),
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
              itemCount: sortedOrders.length,
              itemBuilder: (context, index) =>
                  _ActiveOrderCard(order: sortedOrders[index]),
            ),
          );
        },
        loading: () => _buildLoading(),
        error: (err, _) => _buildError(err),
      ),
    );
  }

  Widget _buildLoading() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: 3,
      itemBuilder: (_, __) => Container(
        margin: const EdgeInsets.only(bottom: 20),
        height: 200,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
        ),
        child: const _ShimmerBox(),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(28),
            decoration: const BoxDecoration(
              color: Color(0xFFCFFAFE),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.inventory_2_outlined,
                size: 56, color: Color(0xFF15803D)),
          ),
          const SizedBox(height: 24),
          const Text('No Active Orders',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Color(0xFF14532D))),
          const SizedBox(height: 8),
          Text('Place an order and track it live here!',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.storefront_outlined),
            label: const Text('Order Something'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF14532D),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError(Object err) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.wifi_off_rounded, size: 56, color: Colors.grey),
          const SizedBox(height: 12),
          const Text('Could not load orders',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text(err.toString(),
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
              textAlign: TextAlign.center),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => ref.invalidate(activeOrdersProvider),
            icon: const Icon(Icons.refresh, size: 18),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF14532D),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Order Card ─────────────────────────────────────────────────────────────────

class _ActiveOrderCard extends StatelessWidget {
  final UserOrder order;
  const _ActiveOrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    final String rawId = order.id;
    final String orderId = rawId.length > 8
        ? rawId.substring(rawId.length - 8).toUpperCase()
        : rawId.toUpperCase();
    final String status = order.status;
    final double total = order.total;

    // Items
    final String itemsSummary = order.items.isNotEmpty
        ? order.items.map((i) => i.name).join(', ')
        : 'See details';

    // Delivery address
    final String deliveryAddress = order.deliveryAddress;

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => TrackOrderPage(
                orderId: order.id,
                status: status,
                deliveryAddress: order.deliveryAddressMap,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header (Matching Screenshot) ─────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text('Order #$orderId',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Colors.black87)),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Order Type Badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: order.isSubscription
                              ? AppColors.primaryDark.withValues(alpha: 0.1)
                              : Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                              color: order.isSubscription
                                  ? AppColors.primaryDark
                                      .withValues(alpha: 0.3)
                                  : Colors.grey.shade300),
                        ),
                        child: Text(
                          (order.orderType ?? 'One-time').toUpperCase(),
                          style: TextStyle(
                              color: order.isSubscription
                                  ? AppColors.primaryDark
                                  : Colors.grey.shade600,
                              fontWeight: FontWeight.bold,
                              fontSize: 9),
                        ),
                      ),
                      // Status Badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color:
                              const Color(0xFFE2F5E9), // Light green for status
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _formatStatus(status),
                          style: const TextStyle(
                              color: Color(0xFF2E7D32), // Dark green text
                              fontWeight: FontWeight.bold,
                              fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const Divider(height: 32, thickness: 1, color: Color(0xFFF3F4F6)),

              // ── Item Row ────────────────────────────────────────────────────
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product image with fallback
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F4F6),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ClipRRect(
                       borderRadius: const BorderRadius.all(Radius.circular(12)),
                       child: _buildItemImage(order),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(itemsSummary,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Color(0xFF1E293B))),
                        const SizedBox(height: 4),
                        Text(
                          'Total Quantity: ${order.items.fold(0, (sum, i) => sum + i.quantity)}',
                          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                        ),
                        if (order.deliverySlot != null && order.deliverySlot!.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Text(
                              'Slot: ${order.deliverySlot}',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),
              
              Text(
                'Placed: ${order.date.toLocal().toString().substring(0, 16).replaceAll('T', ', ')}',
                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
              ),

              const SizedBox(height: 16),

              // ── Plant Section (Added) ──────────────────────────────────
              if (order.plantName.isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4), // Very light green
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFDCFCE7)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.factory_outlined,
                          color: Color(0xFF16A34A), size: 24),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Plant / Retailer',
                                style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF16A34A),
                                    fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text(order.plantName,
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: Colors.black87)),
                          ],
                        ),
                      ),
                      if (order.plantPhone.isNotEmpty)
                        IconButton(
                          icon: const Icon(Icons.call, color: Color(0xFF16A34A)),
                          onPressed: () async {
                            final Uri uri = Uri.parse('tel:${order.plantPhone}');
                            if (await canLaunchUrl(uri)) {
                              await launchUrl(uri);
                            }
                          },
                          constraints: const BoxConstraints(),
                          padding: EdgeInsets.zero,
                          tooltip: 'Call Plant',
                        ),
                    ],
                  ),
                ),
              ],

              // ── Location Section (Matching Screenshot) ──────────────────────
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.location_on_outlined,
                        color: Colors.grey, size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Delivery Address',
                              style:
                                  TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500)),
                          const SizedBox(height: 4),
                          Text(deliveryAddress,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w500, fontSize: 13, color: Colors.black87)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // ── Price & View Details ───────────────────────────────────────────
              Align(
                alignment: Alignment.centerRight,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('₹${total.toStringAsFixed(0)}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                            color: Colors.black)),
                    const SizedBox(height: 4),
                    Text('View Details',
                        style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey.shade500,
                            decoration: TextDecoration.underline)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatStatus(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'PENDING';
      case 'accepted':
      case 'rider_assigned':
        return 'RIDER ASSIGNED';
      case 'pickedup':
      case 'picked_up':
        return 'PICKED UP';
      case 'ontheway':
      case 'out_for_delivery':
      case 'out for delivery':
        return 'OUT FOR DELIVERY';
      case 'delivered':
        return 'DELIVERED';
      default:
        return status.toUpperCase();
    }
  }

  Widget _buildItemImage(UserOrder order) {
    final String imageUrl =
        order.items.isNotEmpty ? order.items.first.image : '';

    if (imageUrl.startsWith('http')) {
      return Image.network(
        imageUrl,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _fallbackImage(),
      );
    }

    return _fallbackImage();
  }

  Widget _fallbackImage() {
    return Image.asset(
      AppImages.waterBottle,
      fit: BoxFit.contain,
      errorBuilder: (_, __, ___) => const Center(
        child: Icon(Icons.water_drop, color: Color(0xFF14532D), size: 32),
      ),
    );
  }
}

class _ShimmerBox extends StatefulWidget {
  const _ShimmerBox();

  @override
  State<_ShimmerBox> createState() => _ShimmerBoxState();
}

class _ShimmerBoxState extends State<_ShimmerBox>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat(reverse: true);
    _anim = Tween<double>(begin: 0.3, end: 0.7)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) => Container(
        decoration: BoxDecoration(
          color: Colors.grey.withValues(alpha: _anim.value),
          borderRadius: BorderRadius.circular(24),
        ),
      ),
    );
  }
}

