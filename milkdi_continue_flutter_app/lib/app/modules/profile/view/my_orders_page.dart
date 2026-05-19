import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/food_models.dart';
import '../../../data/services/order_service.dart';
import '../../orders/view/order_tracking_page.dart';
import '../../../data/models/product_model.dart';
import '../../../data/services/db_service.dart'; // For CartProviderScope
import 'package:intl/intl.dart';

class MyOrdersPage extends ConsumerWidget {
  const MyOrdersPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(myOrdersProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new,
              color: Color(0xFF14532D), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'My Orders',
          style: TextStyle(
            color: Color(0xFF14532D),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Color(0xFF14532D)),
            onPressed: () => ref.invalidate(myOrdersProvider),
          ),
        ],
      ),
      body: ordersAsync.when(
        data: (orders) {
          final deliveredOrders = orders
              .where((o) => o.status.toLowerCase() == 'delivered')
              .toList()
            ..sort((a, b) => b.date.compareTo(a.date));

          return deliveredOrders.isEmpty
              ? const _EmptyOrdersView()
              : RefreshIndicator(
                  onRefresh: () async => ref.refresh(myOrdersProvider),
                  color: const Color(0xFF14532D),
                  child: ListView.builder(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    physics: const AlwaysScrollableScrollPhysics(),
                    itemCount: deliveredOrders.length,
                    itemBuilder: (context, index) =>
                        _OrderCard(order: deliveredOrders[index]),
                  ),
                );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: Color(0xFF14532D)),
        ),
        error: (err, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Failed to load orders: $err'),
              TextButton(
                onPressed: () => ref.invalidate(myOrdersProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyOrdersView extends StatelessWidget {
  const _EmptyOrdersView();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.receipt_long_outlined,
              size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('No orders yet',
              style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey)),
          const SizedBox(height: 8),
          const Text('Your orders will appear here after you place one.',
              style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}

class _OrderCard extends ConsumerWidget {
  final UserOrder order;

  const _OrderCard({required this.order});

  String _orderTitle() =>
      order.items.isNotEmpty ? order.items.first.name : 'Order';

  String _orderDescription() {
    if (order.items.isEmpty) return 'No items';
    return order.items.map((item) => '${item.quantity}x ${item.name}').join(', ');
  }

  double _totalPrice() => order.total;

  String _orderStatus() => order.status;

  bool _isDelivered() => _orderStatus().toLowerCase() == 'delivered';

  Color _statusColor() {
    switch (_orderStatus().toLowerCase()) {
      case 'delivered':
        return Colors.orange.shade700;
      case 'pending':
        return Colors.orange;
      case 'out for delivery':
        return Colors.blue;
      case 'cancelled':
        return Colors.red;
      default:
        return const Color(0xFF14532D);
    }
  }

  String _imageUrl() => order.items.isNotEmpty ? order.items.first.image : '';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageUrl = _imageUrl();
    final status = _orderStatus();
    final statusColor = _statusColor();

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            // Left: Product Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(24),
                bottomLeft: Radius.circular(24),
              ),
              child: SizedBox(
                width: 120,
                height: 140, // Fixed height to match image look
                child: imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const _PlaceholderImage(),
                      )
                    : const _PlaceholderImage(),
              ),
            ),
            // Right: Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title and Status
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            _orderTitle(),
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: Colors.black87,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: statusColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            status.toUpperCase(),
                            style: TextStyle(
                              color: statusColor,
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    // Subtitle (Item details)
                    Text(
                      _orderDescription(),
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    // Times and Rider
                    Text(
                      'Placed: ${DateFormat('dd MMM yyyy, hh:mm a').format(order.date)}',
                      style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                    ),
                    if (_isDelivered())
                      Text(
                        'Delivered: ${DateFormat('dd MMM yyyy, hh:mm a').format(order.date.add(const Duration(hours: 1)))}', // mockup delivered time
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                      ),
                    if (order.riderName.isNotEmpty)
                      Text(
                        'Rider: ${order.riderName}',
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                      ),
                    const Spacer(),
                    // Bill and Action Action Button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Total Bill',
                              style: TextStyle(
                                color: Colors.grey.shade500,
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              '₹${_totalPrice().toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                        // Track/Reorder Action
                        GestureDetector(
                          onTap: () {
                            if (!_isDelivered()) {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      OrderTrackingPage(order: {
                                    '_id': order.id,
                                    'status': order.status,
                                  }),
                                ),
                              );
                            } else {
                              HapticFeedback.mediumImpact();
                              final cartProv = CartProviderScope.of(context);
                              for (var item in order.items) {
                                cartProv.addToCart(CartItem(
                                  id: item.id.isNotEmpty ? item.id : 'reorder_${item.name}',
                                  title: item.name,
                                  unitPrice: item.price,
                                  subtitle: '1 Unit',
                                  image: item.image,
                                  category: 'Reorder',
                                  quantity: item.quantity,
                                ));
                              }
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Added to cart for reorder!'),
                                  backgroundColor: Color(0xFF14532D),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(
                                color: const Color(0xFFE67E22),
                                width: 1.2,
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              _isDelivered() ? 'Reorder' : 'Track Order',
                              style: const TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlaceholderImage extends StatelessWidget {
  const _PlaceholderImage();
  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFE8F5E9),
      child: Center(
        child: Icon(
          Icons.set_meal_outlined,
          size: 40,
          color: const Color(0xFF14532D).withValues(alpha: 0.5),
        ),
      ),
    );
  }
}

