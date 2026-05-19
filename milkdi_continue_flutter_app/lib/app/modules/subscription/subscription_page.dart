import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../data/models/food_models.dart';
import '../../data/models/subscription_model.dart';
import '../../data/services/subscription_service.dart';
import '../../data/services/order_service.dart';
import '../../data/services/wallet_service.dart' show walletBalanceProvider;
import '../orders/view/order_tracking_page.dart';

import '../../core/utils/auth_helper.dart';
import 'package:difwawaterapp/core/state/auth_store.dart';

class SubscriptionPage extends ConsumerStatefulWidget {
  const SubscriptionPage({super.key});

  @override
  ConsumerState<SubscriptionPage> createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends ConsumerState<SubscriptionPage> {
  DateTime _selectedDate = DateTime.now();
  late final DateTime _startDate;

  @override
  void initState() {
    super.initState();
    // Show 3 days in the past and scroll forward from there
    _startDate = DateTime.now().subtract(const Duration(days: 3));
  }

  /// Returns true if the subscription delivers on the given date (ignoring vacation)
  bool _isPotentialDeliveryDay(UserSubscription sub, DateTime date) {
    final normalizedDate = DateTime(date.year, date.month, date.day);
    final normalizedStart =
        DateTime(sub.startDate.year, sub.startDate.month, sub.startDate.day);
    if (normalizedDate.isBefore(normalizedStart)) return false;

    if (sub.endDate != null) {
      final normalizedEnd =
          DateTime(sub.endDate!.year, sub.endDate!.month, sub.endDate!.day);
      if (normalizedDate.isAfter(normalizedEnd)) return false;
    }

    switch (sub.frequency) {
      case 'Daily':
        return true;
      case 'Alternate Days':
        final diff = normalizedDate.difference(normalizedStart).inDays;
        return diff % 2 == 0;
      case 'Weekly':
        const dayNames = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ];
        final dayName = dayNames[date.weekday % 7];
        return sub.customDays.contains(dayName);
      default:
        return false;
    }
  }

  /// Returns true if the subscription delivers on the given date
  bool _deliversOn(UserSubscription sub, DateTime date) {
    if (!_isPotentialDeliveryDay(sub, date)) return false;

    // Finally check vacation
    return !sub.isOnVacationOn(date);
  }

  @override
  Widget build(BuildContext context) {
    final isAuth = ref.watch(isAuthenticatedProvider);
    if (!isAuth) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: AuthHelper.loginRequiredPlaceholder(
          context: context,
          featureName: 'Daily Deliveries',
          description:
              'Keep track of your scheduled milk deliveries and pause anytime from here.',
        ),
      );
    }

    final subscriptionsAsync = ref.watch(mySubscriptionsProvider);
    final ordersAsync = ref.watch(myOrdersProvider);
    final balanceAsync = ref.watch(walletBalanceProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(mySubscriptionsProvider);
            ref.invalidate(myOrdersProvider);
            ref.invalidate(walletBalanceProvider);
          },
          color: const Color(0xFF15803D),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(balanceAsync),
              _buildHorizontalCalendar(subscriptionsAsync),
              Expanded(
                child: subscriptionsAsync.when(
                  data: (subs) => ordersAsync.when(
                    data: (orders) => SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          _buildStatusCard(subs, orders),
                          const SizedBox(height: 20),
                          _buildYourPlans(subs),
                          const SizedBox(height: 30),
                          _buildQuickActions(subs),
                        ],
                      ),
                    ),
                    loading: () => const Center(
                        child: CircularProgressIndicator(
                            color: Color(0xFF15803D))),
                    error: (e, _) => const Center(
                      child: Text(
                        'Could not load orders. Pull down to refresh.',
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                    ),
                  ),
                  loading: () => const Center(
                      child:
                          CircularProgressIndicator(color: Color(0xFF15803D))),
                  error: (e, _) => const Center(
                    child: Text(
                      'Could not load subscriptions. Pull down to refresh.',
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(AsyncValue<double> balanceAsync) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Daily Deliveries',
                    style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1A1A1A))),
                Text(DateFormat('MMMM yyyy').format(_selectedDate),
                    style: const TextStyle(color: Colors.grey, fontSize: 16)),
              ],
            ),
          ),
          // Wallet balance pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF15803D).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                  color: const Color(0xFF15803D).withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.account_balance_wallet,
                    color: Color(0xFF15803D), size: 16),
                const SizedBox(width: 6),
                balanceAsync.when(
                  data: (b) => Text('₹${b.toStringAsFixed(0)}',
                      style: const TextStyle(
                          color: Color(0xFF14532D),
                          fontWeight: FontWeight.bold,
                          fontSize: 14)),
                  loading: () => const SizedBox(
                      width: 12,
                      height: 12,
                      child: CircularProgressIndicator(strokeWidth: 2)),
                  error: (_, __) => const Text('--'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalCalendar(
      AsyncValue<List<UserSubscription>> subsAsync) {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 10),
        itemCount: 30,
        itemBuilder: (context, index) {
          final date = _startDate.add(Duration(days: index));
          final isSelected = date.day == _selectedDate.day &&
              date.month == _selectedDate.month;
          final isToday = date.day == DateTime.now().day &&
              date.month == DateTime.now().month;

          // Show dot if any subscriptions deliver that day
          final hasSub = subsAsync.maybeWhen(
            data: (subs) =>
                subs.any((s) => s.status == 'Active' && _deliversOn(s, date)),
            orElse: () => false,
          );

          // Show umbrella icon only if any active sub has this date in vacation
          final isPaused = subsAsync.maybeWhen(
            data: (subs) => subs.any((s) =>
                s.status == 'Active' && s.isOnVacationOn(date)),
            orElse: () => false,
          );

          return GestureDetector(
            onTap: () => setState(() => _selectedDate = date),
            child: Container(
              width: 60,
              margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFF15803D)
                    : isPaused
                        ? Colors.blue.withValues(alpha: 0.1)
                        : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
                border: isToday && !isSelected
                    ? Border.all(
                        color: const Color(0xFF15803D).withValues(alpha: 0.4))
                    : isPaused
                        ? Border.all(
                            color: Colors.blue.withValues(alpha: 0.3), width: 1)
                        : null,
              ),
              child: Opacity(
                opacity: isPaused ? 0.7 : 1.0,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(DateFormat('E').format(date).toUpperCase(),
                        style: TextStyle(
                            color: isSelected
                                ? Colors.white70
                                : isPaused
                                    ? Colors.blue
                                    : Colors.grey,
                            fontSize: 10,
                            fontWeight: FontWeight.bold)),
                    const SizedBox(height: 3),
                    Text(date.day.toString(),
                        style: TextStyle(
                            color: isSelected
                                ? Colors.white
                                : isPaused
                                    ? Colors.blue[800]
                                    : Colors.black,
                            fontSize: 17,
                            fontWeight: FontWeight.w900)),
                    if (hasSub)
                      Container(
                        margin: const EdgeInsets.only(top: 3),
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isSelected
                              ? Colors.white
                              : const Color(0xFF15803D),
                        ),
                      ),
                    if (isPaused)
                      const Icon(Icons.beach_access,
                          size: 14, color: Colors.blue),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatusCard(List<UserSubscription> subs, List<UserOrder> orders) {
    // 1. Find subscriptions that should deliver on this date
    final deliveringSubs = subs
        .where((s) => s.status == 'Active' && _deliversOn(s, _selectedDate))
        .toList();

    // 2. Find real orders created for this date
    final ordersForDate = orders.where((o) {
      final orderDate = o.date;
      return orderDate.day == _selectedDate.day &&
          orderDate.month == _selectedDate.month &&
          orderDate.year == _selectedDate.year;
    }).toList();

    // 3. Status card logic
    final anyPotentialSub =
        subs.any((s) => s.status == 'Active' && _isPotentialDeliveryDay(s, _selectedDate));
    final anySubOnVacation = subs.any((s) =>
        s.status == 'Active' &&
        _isPotentialDeliveryDay(s, _selectedDate) &&
        s.isOnVacationOn(_selectedDate));

    final hasDelivery = deliveringSubs.isNotEmpty || ordersForDate.isNotEmpty;
    // Show vacation color only if no other active deliveries are scheduled
    final showVacationStyle = anySubOnVacation && deliveringSubs.isEmpty && ordersForDate.isEmpty;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: showVacationStyle
            ? Colors.blue.withValues(alpha: 0.05)
            : const Color(0xFFCFFAFE).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
            color: showVacationStyle
                ? Colors.blue.withValues(alpha: 0.2)
                : const Color(0xFF15803D).withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: hasDelivery
                      ? const Color(0xFF15803D)
                      : anySubOnVacation
                          ? Colors.blue
                          : Colors.grey,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  hasDelivery
                      ? 'SCHEDULED'
                      : showVacationStyle
                          ? 'ON VACATION'
                          : anyPotentialSub
                              ? 'SKIPPED'
                              : 'NO DELIVERY',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold),
                ),
              ),
              const Spacer(),
              if (hasDelivery)
                Text('${deliveringSubs.length + ordersForDate.length} item(s)',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, color: Color(0xFF1A1A1A))),
            ],
          ),
          const SizedBox(height: 16),
          if (!hasDelivery)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Text(
                    anySubOnVacation
                        ? 'Deliveries are paused for this day.'
                        : 'No deliveries scheduled for this day.',
                    style: const TextStyle(color: Colors.grey)),
              ),
            )
          else ...[
            // Show matched/real orders first
            ...ordersForDate.map((order) {
              if (order.items.isEmpty) return const SizedBox();
              return _buildRealOrderItem(order);
            }),
            // Show subscriptions that haven't turned into orders yet
            ...deliveringSubs.where((sub) {
              // Avoid duplicates if order is already shown
              return !ordersForDate.any((o) {
                return o.items.any((item) =>
                    // Ideally check product ID here, but our model uses name for simplicity in some places
                    item.name == sub.productName);
              });
            }).map((sub) => _buildDeliveryItem(sub)),
          ],
        ],
      ),
    );
  }

  Widget _buildRealOrderItem(UserOrder order) {
    if (order.items.isEmpty) return const SizedBox();

    // Combine all item names into a single string for summary
    final itemsNames = order.items.map((i) => i.name).join(', ');
    final image = order.items.first.image;
    final totalQty = order.items.fold(0, (sum, i) => sum + i.quantity);
    final status = order.status;
    final isDelivered = status.toLowerCase() == 'delivered';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: image.isNotEmpty
                ? Image.network(image,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => _imagePlaceholder)
                : _imagePlaceholder,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  itemsNames,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 13),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Text('Qty $totalQty • ₹${order.total.toStringAsFixed(0)}',
                        style:
                            TextStyle(color: Colors.grey[600], fontSize: 11)),
                    if (order.deliverySlot != null &&
                        order.deliverySlot!.isNotEmpty)
                      _infoChip(
                        icon: Icons.schedule,
                        label: order.deliverySlot!,
                        color: Colors.teal,
                      ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: order.isSubscription
                            ? const Color(0xFF15803D).withValues(alpha: 0.1)
                            : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                            color: order.isSubscription
                                ? const Color(0xFF15803D).withValues(alpha: 0.3)
                                : Colors.grey.shade300),
                      ),
                      child: Text(
                        (order.orderType ?? 'ONE-TIME').toUpperCase() ==
                                'SUBSCRIPTION'
                            ? 'SUBS'
                            : (order.orderType ?? 'ONE-TIME').toUpperCase(),
                        style: TextStyle(
                            fontSize: 8,
                            color: order.isSubscription
                                ? const Color(0xFF15803D)
                                : Colors.grey.shade600,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Builder(builder: (context) {
            final now = DateTime.now();
            final today = DateTime(now.year, now.month, now.day);
            final selected = DateTime(
                _selectedDate.year, _selectedDate.month, _selectedDate.day);
            final isFuture = selected.isAfter(today);

            return Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                GestureDetector(
                  onTap: isFuture
                      ? null
                      : () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => OrderTrackingPage(order: {
                                '_id': order.id,
                                'status': order.status,
                              }),
                            ),
                          );
                        },
                  child: Row(
                    children: [
                      Icon(Icons.location_on_outlined,
                          color:
                              isFuture ? Colors.grey : const Color(0xFF15803D),
                          size: 14),
                      const SizedBox(width: 2),
                      Text(
                        status.toUpperCase(),
                        style: TextStyle(
                          color:
                              isFuture ? Colors.grey : const Color(0xFF15803D),
                          fontWeight: FontWeight.w900,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                if (!isFuture) ...[
                  const SizedBox(height: 4),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => OrderTrackingPage(order: {
                            '_id': order.id,
                            'status': order.status,
                          }),
                        ),
                      );
                    },
                    child: const Text(
                      'Track',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 10,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ],
            );
          }),
          const SizedBox(width: 12),
          Icon(isDelivered ? Icons.check_circle : Icons.radio_button_checked,
              color: const Color(0xFF15803D)),
        ],
      ),
    );
  }

  Widget _buildDeliveryItem(UserSubscription sub) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: sub.productImage.isNotEmpty
                ? Image.network(sub.productImage,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => _imagePlaceholder)
                : _imagePlaceholder,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(sub.productName,
                    style: const TextStyle(fontWeight: FontWeight.bold)),
                if (sub.retailerName.isNotEmpty)
                  Text(sub.retailerName,
                      style: TextStyle(
                          color: const Color(0xFF14532D).withValues(alpha: 0.7),
                          fontSize: 11,
                          fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                // Quantity + Frequency chips
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: [
                    _infoChip(
                      icon: Icons.water_drop,
                      label: 'Qty ${sub.quantity}',
                      color: const Color(0xFF15803D),
                    ),
                    _infoChip(
                      icon: Icons.repeat,
                      label: sub.frequency,
                      color: Colors.indigo,
                    ),
                    if (sub.deliverySlot != null &&
                        sub.deliverySlot!.isNotEmpty)
                      _infoChip(
                        icon: Icons.schedule,
                        label: sub.deliverySlot!,
                        color: Colors.teal,
                      ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF15803D).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                            color:
                                const Color(0xFF15803D).withValues(alpha: 0.3)),
                      ),
                      child: const Text('SUBS',
                          style: TextStyle(
                              fontSize: 8,
                              color: Color(0xFF15803D),
                              fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Builder(builder: (context) {
            final now = DateTime.now();
            final today = DateTime(now.year, now.month, now.day);
            final selected = DateTime(
                _selectedDate.year, _selectedDate.month, _selectedDate.day);
            final isFuture = selected.isAfter(today);

            return Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (!isFuture)
                  GestureDetector(
                    onTap: () => _openTrackingForSubscription(sub),
                    child: const Text(
                      'Upcoming',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 10,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  )
                else
                  const Text(
                    'Upcoming',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 10,
                    ),
                  ),
              ],
            );
          }),
          const SizedBox(width: 12),
          const Icon(Icons.check_circle, color: Color(0xFF15803D)),
        ],
      ),
    );
  }

  /// Fetches the latest order for [sub] from the backend and navigates
  /// to [OrderTrackingPage] with the real order data.
  Future<void> _openTrackingForSubscription(UserSubscription sub) async {
    // Show a loading snackbar while we fetch
    if (!mounted) return;
    final messenger = ScaffoldMessenger.of(context);
    messenger.showSnackBar(
      const SnackBar(
        content: Row(children: [
          SizedBox(
            width: 18,
            height: 18,
            child:
                CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
          ),
          SizedBox(width: 12),
          Text('Fetching order details…'),
        ]),
        duration: Duration(seconds: 10),
        backgroundColor: Color(0xFF14532D),
      ),
    );

    try {
      final orderService = ref.read(orderServiceProvider);
      Map<String, dynamic> order =
          await orderService.getOrderBySubscriptionId(sub.id);

      // If no backend order found, use a sensible stub so the page still opens
      if (order.isEmpty) {
        order = {
          '_id': sub.id,
          'orderId': sub.id,
          'status': 'Processing',
          'orderType': 'Subscription',
          'frequency': sub.frequency,
          'customDays': sub.customDays,
          'items': [
            {
              'quantity': sub.quantity,
              'price': 0,
              'product': {
                'name': sub.productName,
                'images': [sub.productImage],
              },
            }
          ],
        };
      }

      if (!mounted) return;
      messenger.hideCurrentSnackBar();

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OrderTrackingPage(order: order),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      messenger.hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Unable to load order details. Please try again.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget get _imagePlaceholder => Container(
        width: 50,
        height: 50,
        color: const Color(0xFFE8F5E9),
        child: const Icon(Icons.water_drop, color: Color(0xFF15803D), size: 24),
      );

  /// Small compact chip used inside delivery items
  Widget _infoChip(
      {required IconData icon, required String label, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 10, color: color),
          const SizedBox(width: 3),
          Text(label,
              style: TextStyle(
                  fontSize: 10, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildYourPlans(List<UserSubscription> subs) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Your Plans',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 15),
        if (subs.isEmpty)
          const Text('No active plans. Subscribe to a product to get started!',
              style: TextStyle(color: Colors.grey))
        else
          ...subs.map((sub) => _buildPlanItem(sub)),
      ],
    );
  }

  Widget _buildPlanItem(UserSubscription sub) {
    final isActive = sub.status == 'Active';
    final addressStr = sub.deliveryAddressString;
    final hasSlot = sub.deliverySlot != null && sub.deliverySlot!.isNotEmpty;
    final hasAddress = addressStr.isNotEmpty;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.12)),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 8,
              offset: const Offset(0, 2))
        ],
      ),
      child: Column(
        children: [
          // ── Main row ─────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor:
                      (isActive ? const Color(0xFF15803D) : Colors.grey)
                          .withValues(alpha: 0.12),
                  child: Icon(isActive ? Icons.check : Icons.pause,
                      color: isActive ? const Color(0xFF15803D) : Colors.grey),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(sub.productName,
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      // Chips: qty • frequency • slot
                      Wrap(
                        spacing: 6,
                        runSpacing: 4,
                        children: [
                          _infoChip(
                            icon: Icons.water_drop,
                            label: 'Qty ${sub.quantity}',
                            color: const Color(0xFF15803D),
                          ),
                          _infoChip(
                            icon: Icons.repeat,
                            label: sub.frequency,
                            color: Colors.indigo,
                          ),
                          if (hasSlot)
                            _infoChip(
                              icon: Icons.schedule,
                              label: sub.deliverySlot!,
                              color: Colors.teal,
                            ),
                          _infoChip(
                            icon: Icons.currency_rupee,
                            label:
                                '₹${(sub.price * sub.quantity).toStringAsFixed(0)}',
                            color: Colors.orange,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Pause / Resume toggle
                Switch(
                  value: isActive,
                  activeThumbColor: const Color(0xFF15803D),
                  onChanged: (val) async {
                    final confirmed = await _showConfirmationDialog(
                      title:
                          val ? 'Resume Subscription?' : 'Pause Subscription?',
                      message: val
                          ? 'Do you want to resume deliveries for ${sub.productName}?'
                          : 'Do you want to pause deliveries for ${sub.productName}?',
                      confirmText: val ? 'Resume' : 'Pause',
                      confirmColor:
                          val ? const Color(0xFF15803D) : Colors.orange,
                    );
                    if (!confirmed) return;

                    final newStatus = val ? 'Active' : 'Paused';
                    await ref
                        .read(mySubscriptionsProvider.notifier)
                        .updateStatus(sub.id, newStatus);
                  },
                ),
              ],
            ),
          ),

          // ── Delivery address row (only if address is available) ──────────
          if (hasAddress || sub.customDays.isNotEmpty)
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDFF),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(16),
                  bottomRight: Radius.circular(16),
                ),
                border: Border(
                    top: BorderSide(
                        color: const Color(0xFF15803D).withValues(alpha: 0.1))),
              ),
              child: Column(
                children: [
                  // Custom days (for weekly plans)
                  if (sub.customDays.isNotEmpty && sub.frequency == 'Weekly')
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_today,
                              size: 13, color: Color(0xFF14532D)),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Scheduled: ${sub.customDays.join(', ')}',
                              style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF14532D),
                                  fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  // Address row
                  if (hasAddress)
                    GestureDetector(
                      onTap: () => _showAddressSheet(sub),
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
                        child: Row(
                          children: [
                            const Icon(Icons.location_on,
                                size: 13, color: Color(0xFF14532D)),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                addressStr,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF14532D),
                                    fontWeight: FontWeight.w500),
                              ),
                            ),
                            const Icon(Icons.chevron_right,
                                size: 14, color: Color(0xFF15803D)),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /// Shows a bottom sheet with full delivery address details for the subscription
  void _showAddressSheet(UserSubscription sub) {
    final m = sub.deliveryAddress ?? {};
    final fullName = m['fullName']?.toString() ?? '';
    final label = m['label']?.toString() ?? '';
    final fullAddress =
        (m['fullAddress'] ?? m['address'] ?? m['street'] ?? '').toString();
    final city = m['city']?.toString() ?? '';
    final state = m['state']?.toString() ?? '';
    final pincode = m['pincode']?.toString() ?? '';

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle
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
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF15803D).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.location_on,
                      color: Color(0xFF15803D), size: 22),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Delivery Address',
                        style: TextStyle(
                            fontSize: 17, fontWeight: FontWeight.w800)),
                    Text(sub.productName,
                        style:
                            const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            _addressRow(Icons.person_outline,
                fullName.isNotEmpty ? fullName : '—', 'Recipient'),
            if (label.isNotEmpty)
              _addressRow(Icons.label_outline, label, 'Label'),
            if (fullAddress.isNotEmpty)
              _addressRow(Icons.home_outlined, fullAddress, 'Street'),
            if (city.isNotEmpty)
              _addressRow(Icons.location_city_outlined, city, 'City'),
            if (state.isNotEmpty)
              _addressRow(Icons.map_outlined, state, 'State'),
            if (pincode.isNotEmpty)
              _addressRow(Icons.pin_drop_outlined, pincode, 'Pincode'),
            if (sub.deliverySlot != null && sub.deliverySlot!.isNotEmpty) ...[
              const Divider(height: 24),
              _addressRow(Icons.schedule, sub.deliverySlot!, 'Delivery Slot'),
            ],
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _addressRow(IconData icon, String value, String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: const Color(0xFF15803D)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        fontSize: 10,
                        color: Colors.grey,
                        fontWeight: FontWeight.w500)),
                Text(value,
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(List<UserSubscription> subs) {
    final now = DateTime.now();
    final isAfterDeadline = now.hour >= 20; // 8 PM Deadline

    final today = DateTime(now.year, now.month, now.day);
    // Vacation is ON if any active subscription has a vacation date from today onwards
    final isVacationOn = subs.any((s) =>
        s.status == 'Active' &&
        s.vacationDates.any((vd) => !vd.isBefore(today)));

    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    // Tomorrow is considered 'paused' only if ALL active subs have it in vacation
    final activeSubs = subs.where((s) => s.status == 'Active').toList();
    final isTomorrowPaused = activeSubs.isNotEmpty &&
        activeSubs.every((s) => s.isOnVacationOn(tomorrow));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (isAfterDeadline && subs.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              children: [
                const Icon(Icons.info_outline, color: Colors.orange, size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Deadline passed (8 PM). Tomorrow\'s delivery is locked.',
                    style: TextStyle(
                      color: Colors.orange[800],
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        Row(
          children: [
            Expanded(
              child: _ActionButton(
                icon: isTomorrowPaused
                    ? Icons.play_circle_outline
                    : Icons.pause_circle_outline,
                label: isTomorrowPaused ? 'Resume Tomorrow' : 'Pause Tomorrow',
                color: isTomorrowPaused ? Colors.green : Colors.orange,
                // Always allow resume even after deadline;
                // only block new pauses after 8 PM.
                onTap: (subs.isEmpty || (isAfterDeadline && !isTomorrowPaused))
                    ? null
                    : () => _pauseTomorrow(subs),
              ),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: _ActionButton(
                icon: Icons.flight_takeoff,
                label: isVacationOn ? 'Vacation: ON' : 'Vacation: OFF',
                color: isVacationOn ? Colors.blue : Colors.redAccent,
                onTap: (subs.isEmpty)
                    ? null
                    : () => _toggleVacationMode(subs, isVacationOn),
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _pauseTomorrow(List<UserSubscription> subs) async {
    final now = DateTime.now();
    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    final activeSubs = subs.where((s) => s.status == 'Active').toList();
    if (activeSubs.isEmpty) return;

    final isTomorrowAlreadyPaused =
        activeSubs.every((s) => s.isOnVacationOn(tomorrow));

    // Only block new pauses after 8 PM — always allow resume
    if (now.hour >= 20 && !isTomorrowAlreadyPaused) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Deadline passed (8 PM). Cannot pause tomorrow\'s delivery.'),
          backgroundColor: Colors.orange,
        ));
      }
      return;
    }

    // (activeSubs / isTomorrowAlreadyPaused already computed above)

    final confirmed = await _showConfirmationDialog(
      title: isTomorrowAlreadyPaused ? 'Resume Tomorrow?' : 'Pause Tomorrow?',
      message: isTomorrowAlreadyPaused
          ? 'Are you sure you want to resume all scheduled deliveries for tomorrow?'
          : 'Are you sure you want to skip all scheduled deliveries for tomorrow?',
      confirmText: isTomorrowAlreadyPaused ? 'Resume' : 'Pause',
      confirmColor: isTomorrowAlreadyPaused ? Colors.green : Colors.orange,
    );
    if (!confirmed) return;

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Processing...'),
        duration: Duration(seconds: 1),
      ));
    }

    // Process all subs in parallel
    final notifier = ref.read(mySubscriptionsProvider.notifier);
    final futures = activeSubs
        .map((sub) => notifier.updateVacation(
              subscriptionId: sub.id,
              startDate: tomorrow,
              endDate: tomorrow,
              isResume: isTomorrowAlreadyPaused,
            ))
        .toList();

    await Future.wait(futures);
    await notifier.refresh(); // Single refresh at end

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(isTomorrowAlreadyPaused
            ? 'Tomorrow\'s delivery resumed!'
            : 'Tomorrow\'s delivery paused!'),
        backgroundColor: isTomorrowAlreadyPaused ? Colors.green : Colors.orange,
      ));
    }
  }

  void _toggleVacationMode(
      List<UserSubscription> subs, bool isCurrentlyOn) async {
    final now = DateTime.now();
    final isAfterDeadline = now.hour >= 20; // 8 PM Deadline

    // Cannot START a new vacation after 8 PM
    if (isAfterDeadline && !isCurrentlyOn) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Deadline passed (8 PM). Cannot start vacation for tomorrow.'),
          backgroundColor: Colors.orange,
        ));
      }
      return;
    }

    final activeSubs = subs.where((s) => s.status == 'Active').toList();
    if (activeSubs.isEmpty) return;

    if (isCurrentlyOn) {
      // --- VACATION MODE OFF ---
      final confirmed = await _showConfirmationDialog(
        title: 'Turn Off Vacation?',
        message: 'Turn off vacation mode? All paused deliveries will resume.',
        confirmText: 'Turn Off',
        confirmColor: Colors.green,
      );
      if (!confirmed) return;

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Clearing vacation dates...'),
          duration: Duration(seconds: 1),
        ));
      }

      // clearAllVacations: sends the exact future dates with isResume:true
      // so the backend removes them from the Do-Not-Pack list.
      // Each call does its own optimistic clear; we do ONE refresh at the end.
      final notifier = ref.read(mySubscriptionsProvider.notifier);
      for (final sub in activeSubs) {
        await notifier.clearAllVacations(sub.id);
      }
      // Single refresh to sync server state after all clears complete
      await notifier.refresh();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Vacation Mode OFF! Deliveries are resumed.'),
          backgroundColor: Colors.green,
        ));
      }
    } else {
      // --- VACATION MODE ON — user picks both start and end date ---
      // Earliest selectable start date is tomorrow (or day-after if past 8 PM)
      final firstPossible = isAfterDeadline
          ? DateTime(now.year, now.month, now.day + 2)
          : DateTime(now.year, now.month, now.day + 1);

      final DateTimeRange? picked = await showDateRangePicker(
        context: context,
        firstDate: firstPossible,
        initialDateRange: DateTimeRange(
          start: firstPossible,
          end: firstPossible.add(const Duration(days: 6)),
        ),
        lastDate: DateTime.now().add(const Duration(days: 90)),
        helpText: 'SELECT VACATION DATES',
        saveText: 'SET VACATION',
        builder: (context, child) => Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF15803D),
              onPrimary: Colors.white,
            ),
          ),
          child: child!,
        ),
      );

      if (picked == null) return;

      // Normalize to midnight local dates
      final startDate = DateTime(picked.start.year, picked.start.month, picked.start.day);
      final endDate   = DateTime(picked.end.year,   picked.end.month,   picked.end.day);

      final confirmed = await _showConfirmationDialog(
        title: 'Start Vacation?',
        message:
            'Pause all deliveries from ${DateFormat('MMM d').format(startDate)} to ${DateFormat('MMM d').format(endDate)}?',
        confirmText: 'Start Vacation',
        confirmColor: const Color(0xFF15803D),
      );
      if (!confirmed) return;

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Activating vacation mode...'),
          duration: Duration(seconds: 1),
        ));
      }

      // Send the full chosen range to backend for each active subscription
      final futures = activeSubs.map((sub) =>
          ref.read(mySubscriptionsProvider.notifier).updateVacation(
                subscriptionId: sub.id,
                startDate: startDate,
                endDate: endDate,
                isResume: false,
              ));
      await Future.wait(futures);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Vacation mode activated!'),
          backgroundColor: Colors.blue,
        ));
      }
    }
  }

  Future<bool> _showConfirmationDialog({
    required String title,
    required String message,
    String confirmText = 'Confirm',
    String cancelText = 'Cancel',
    Color? confirmColor,
  }) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: Text(title,
                style: const TextStyle(fontWeight: FontWeight.bold)),
            content:
                Text(message, style: const TextStyle(color: Colors.black87)),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: Text(cancelText,
                    style: const TextStyle(color: Colors.grey)),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                child: Text(confirmText,
                    style: TextStyle(
                        color: confirmColor ?? const Color(0xFF15803D),
                        fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ) ??
        false;
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(icon, color: onTap == null ? Colors.grey : color, size: 24),
            const SizedBox(height: 8),
            Text(label,
                style: TextStyle(
                    color: onTap == null ? Colors.grey : color,
                    fontWeight: FontWeight.bold,
                    fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
