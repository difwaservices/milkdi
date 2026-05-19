import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/services/rider_service.dart';
import '../../../data/services/socket_service.dart';
import 'rider_home_page.dart';

final orderDetailsProvider = FutureProvider.autoDispose
    .family<Map<String, dynamic>, String>((ref, orderId) async {
  final result = await ref.read(riderServiceProvider).getOrderDetails(orderId);
  return result;
});

class RiderOrderDetailsPage extends ConsumerStatefulWidget {
  final Map<String, dynamic> order;
  final String? orderId;

  const RiderOrderDetailsPage({
    super.key,
    this.order = const {},
    this.orderId,
  });

  @override
  ConsumerState<RiderOrderDetailsPage> createState() =>
      _RiderOrderDetailsPageState();
}

class _RiderOrderDetailsPageState extends ConsumerState<RiderOrderDetailsPage> {
  /// Live-updated status from Socket.IO (falls back to the initial order status)
  late String _liveStatus;
  Map<String, dynamic>? _fetchedOrder;

  @override
  void initState() {
    super.initState();
    _liveStatus = widget.order['status']?.toString() ?? '';
    WidgetsBinding.instance.addPostFrameCallback((_) => _initSocket());
  }

  void _initSocket() {
    final orderId = widget.order['orderId']?.toString() ?? '';
    if (orderId.isEmpty) return;

    final socket = ref.read(socketServiceProvider);
    // Join the order-specific room for real-time updates
    socket.joinOrderRoom(orderId);

    // Listen for status changes emitted by the server
    socket.onOrderUpdate((data) {
      if (!mounted) return;
      final incomingId = data?['orderId']?.toString() ?? '';
      if (incomingId != orderId && incomingId.isNotEmpty)
        return; // not our order

      final newStatus = data?['status']?.toString() ?? '';
      if (newStatus.isNotEmpty && newStatus != _liveStatus) {
        setState(() => _liveStatus = newStatus);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('📍 Status updated: $newStatus'),
          backgroundColor: AppColors.accentGreen,
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          duration: const Duration(seconds: 2),
        ));
      }

      // Also refresh the home list so it stays in sync
      ref.invalidate(riderOrdersProvider);
    });
  }

  @override
  void dispose() {
    final orderId = widget.order['orderId']?.toString() ?? '';
    if (orderId.isNotEmpty) {
      ref.read(socketServiceProvider).leaveOrderRoom(orderId);
      ref.read(socketServiceProvider).offOrderUpdate();
    }
    super.dispose();
  }

  Future<void> _callCustomer(String phone) async {
    if (phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No phone number available')));
      return;
    }
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open dialer for $phone')));
    }
  }

  Future<void> _openMaps(String address) async {
    if (address.isEmpty || address == 'N/A') {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('No address available')));
      return;
    }
    // Using 'dir' action with destination automatically sets the rider's current location as the source
    final uri = Uri.parse(
        'https://www.google.com/maps/dir/?api=1&destination=${Uri.encodeComponent(address)}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else if (mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Could not open Maps')));
    }
  }

  @override
  Widget build(BuildContext context) {
    Map<String, dynamic> order = widget.order;

    if (order.isEmpty && widget.orderId != null) {
      final orderAsync = ref.watch(orderDetailsProvider(widget.orderId!));
      return orderAsync.when(
        data: (fetchedMap) {
          order = fetchedMap;
          if (order.isEmpty) {
            return Scaffold(
              appBar: AppBar(title: const Text('Order Error')),
              body: const Center(child: Text('Order not found')),
            );
          }
          return _buildOrderDetails(context, order);
        },
        loading: () => const Scaffold(
          body: Center(child: CircularProgressIndicator(color: AppColors.accentGreen)),
        ),
        error: (err, stack) => Scaffold(
          body: Center(child: Text('Error: $err')),
        ),
      );
    }

    return _buildOrderDetails(context, order);
  }

  Widget _buildOrderDetails(BuildContext context, Map<String, dynamic> order) {
    final items = (order['items'] as List<dynamic>?) ?? [];
    final user = order['user'];
    final customerName = (user is Map)
        ? (user['fullName']?.toString() ??
            user['name']?.toString() ??
            'Customer')
        : 'Customer';
    final customerPhone = (user is Map)
        ? (user['phoneNumber']?.toString() ?? user['phone']?.toString() ?? '')
        : '';
    final deliveryAddressMap = order['deliveryAddress'];
    String deliveryAddress = 'N/A';
    if (deliveryAddressMap is Map) {
      final name = deliveryAddressMap['fullName'] ?? deliveryAddressMap['name'] ?? '';
      final street = deliveryAddressMap['fullAddress'] ?? deliveryAddressMap['address'] ?? deliveryAddressMap['street'] ?? '';
      final city = deliveryAddressMap['city'] ?? '';
      final state = deliveryAddressMap['state'] ?? '';
      final pincode = deliveryAddressMap['pincode'] ?? '';
      
      List<String> parts = [];
      if (street.toString().isNotEmpty) parts.add(street.toString());
      if (city.toString().isNotEmpty) parts.add(city.toString());
      if (state.toString().isNotEmpty) parts.add(state.toString());
      if (pincode.toString().isNotEmpty) parts.add(pincode.toString());
      
      deliveryAddress = parts.isNotEmpty ? parts.join(', ') : 'N/A';
      if (name.toString().isNotEmpty) {
        deliveryAddress = '$name\n$deliveryAddress';
      }
    } else if (deliveryAddressMap != null) {
      deliveryAddress = deliveryAddressMap.toString();
    }

    // Use live status from socket, falls back to initial order status
    final status = _liveStatus.isNotEmpty
        ? _liveStatus
        : (order['status']?.toString() ?? '');
    final orderId = order['orderId']?.toString() ?? '';
    final shortId = orderId.length >= 6
        ? orderId.substring(orderId.length - 6).toUpperCase()
        : orderId.toUpperCase();
    final paymentType = (order['paymentMethod'] ??
            order['paymentType'] ??
            order['payment_method'] ??
            'N/A')
        .toString();
    final instructions = order['deliveryInstructions']?.toString() ??
        order['instructions']?.toString() ??
        'None';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        title: Text('#$shortId',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Quick Actions ─────────────────────────────────────────────
            Row(
              children: [
                Expanded(
                  child: _QuickActionButton(
                    icon: Icons.phone_rounded,
                    label: 'Call Customer',
                    color: Colors.blue,
                    onTap: () => _callCustomer(customerPhone),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _QuickActionButton(
                    icon: Icons.map_rounded,
                    label: 'Open Maps',
                    color: Colors.orange,
                    onTap: () => _openMaps(deliveryAddress),
                  ),
                ),
              ],
            ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0),

            const SizedBox(height: 20),

            // ── Customer Info ─────────────────────────────────────────────
            _SectionCard(
              title: 'Customer',
              child: Column(
                children: [
                  _InfoRow(
                      icon: Icons.person_rounded,
                      label: 'Name',
                      value: customerName),
                  if (customerPhone.isNotEmpty)
                    _InfoRow(
                        icon: Icons.phone_rounded,
                        label: 'Phone',
                        value: customerPhone),
                  _InfoRow(
                    icon: Icons.location_on_rounded,
                    label: 'Address',
                    value: deliveryAddress,
                    iconColor: Colors.red,
                  ),
                  if (instructions != 'None')
                    _InfoRow(
                        icon: Icons.notes_rounded,
                        label: 'Instructions',
                        value: instructions),
                ],
              ),
            ).animate(delay: 80.ms).fadeIn().slideY(begin: 0.1, end: 0),

            const SizedBox(height: 16),

            // ── Order Info ────────────────────────────────────────────────
            _SectionCard(
              title: 'Order Info',
              child: Column(
                children: [
                  _InfoRow(
                      icon: Icons.tag_rounded,
                      label: 'Order ID',
                      value: '#$shortId'),
                  _InfoRow(
                      icon: Icons.payment_rounded,
                      label: 'Payment',
                      value: paymentType),
                  _InfoRow(
                      icon: Icons.info_outline_rounded,
                      label: 'Status',
                      value: status.toUpperCase()),
                  const Divider(height: 24),
                  _InfoRow(
                    icon: Icons.currency_rupee_rounded,
                    label: 'Order Total Money',
                    value: '₹${(order['totalAmount'] ?? order['total'] ?? 0).toString()}',
                    valueColor: AppColors.accentGreen,
                    isBold: true,
                  ),
                ],
              ),
            ).animate(delay: 120.ms).fadeIn().slideY(begin: 0.1, end: 0),

            const SizedBox(height: 16),

            // ── Items ─────────────────────────────────────────────────────
            if (items.isNotEmpty)
              _SectionCard(
                title: 'Items (${items.length} Type • Total ${items.fold(0, (sum, i) => sum + (int.tryParse(i['quantity']?.toString() ?? '1') ?? 1))} qty)',
                child: Column(
                  children: items.map((item) {
                    final product = item['product'];
                    final name = (product is Map)
                        ? (product['name']?.toString() ?? 'Item')
                        : (item['name']?.toString() ?? 'Item');
                    final qty = item['quantity']?.toString() ?? '1';
                    final price = item['price']?.toString() ?? '';
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                                color: const Color(0xFFF1F4F8),
                                borderRadius: BorderRadius.circular(8)),
                            child: Center(
                                child: Text(qty,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold))),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                              child: Text(name,
                                  style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500))),
                          if (price.isNotEmpty)
                            Text('₹$price',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.accentGreen)),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ).animate(delay: 160.ms).fadeIn().slideY(begin: 0.1, end: 0),

            const SizedBox(height: 24),

            // Status Buttons REMOVED as per request. Use Dashboard for actions.
            const SizedBox(height: 20),
            const Center(
              child: Text(
                'Use the main Dashboard to update order status.',
                style: TextStyle(color: Colors.grey, fontSize: 12, fontStyle: FontStyle.italic),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

class _SectionCard extends StatelessWidget {
  final String title;
  final Widget child;
  const _SectionCard({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: Colors.grey,
                  letterSpacing: 0.5)),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color iconColor;
  final Color? valueColor;
  final bool isBold;
  const _InfoRow(
      {required this.icon,
      required this.label,
      required this.value,
      this.iconColor = Colors.grey,
      this.valueColor,
      this.isBold = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: iconColor),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        fontSize: 11,
                        color: Colors.grey,
                        fontWeight: FontWeight.bold)),
                Text(value,
                    style: TextStyle(
                        fontSize: isBold ? 15 : 13,
                        color: valueColor ?? const Color(0xFF1A1A1A),
                        fontWeight: isBold ? FontWeight.bold : FontWeight.w500)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickActionButton(
      {required this.icon,
      required this.label,
      required this.color,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 26),
            const SizedBox(height: 6),
            Text(label,
                style: TextStyle(
                    color: color, fontWeight: FontWeight.bold, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
