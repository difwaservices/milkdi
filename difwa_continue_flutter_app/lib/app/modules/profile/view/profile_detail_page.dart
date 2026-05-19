import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/order_service.dart';
import '../../../data/services/db_service.dart';
import '../../../data/services/subscription_service.dart';
import '../../../data/models/subscription_model.dart';
import '../../../data/models/food_models.dart';
import '../../../core/constants/app_colors.dart';
import 'address_form_page.dart';
import '../widgets/review_dialog.dart';

class ProfileDetailPage extends ConsumerStatefulWidget {
  final String title;

  const ProfileDetailPage({super.key, required this.title});

  @override
  ConsumerState<ProfileDetailPage> createState() => _ProfileDetailPageState();
}

class _ProfileDetailPageState extends ConsumerState<ProfileDetailPage> {
  int? _expandedOrderIndex = 0; // Default first one expanded as in Image 3

  // ── Subscriptions state ───────────────────────────────────────────────────
  final SubscriptionService _subscriptionService = SubscriptionService();
  List<SubscriptionPlan> _subscriptionPlans = [];
  bool _subscriptionsLoading = false;
  String? _subscriptionsError;
  final Map<String, bool> _notificationSettings = {
    'Allow Notifications': true, 
    'Email Notifications': false,
    'Order Notifications': false,
    'General Notifications': true,
  };
  String? _selectedPlanId;

  @override
  void initState() {
    super.initState();
    if (widget.title == 'Subscriptions') {
      _loadSubscriptions();
    }
    if (widget.title == 'My Orders') {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadOrders();
      });
    }
  }

  Future<void> _loadOrders() async {
    final cartProvider = CartProviderScope.of(context);
    cartProvider.setLoadingOrders(true);
    try {
      final orders = await ref.read(orderServiceProvider).getMyOrders();
      cartProvider.setOrders(orders);
    } catch (e) {
      debugPrint('Error loading orders: $e');
    } finally {
      cartProvider.setLoadingOrders(false);
    }
  }

  Future<void> _loadSubscriptions() async {
    setState(() {
      _subscriptionsLoading = true;
      _subscriptionsError = null;
    });
    try {
      final plans = await _subscriptionService.getSubscriptions();
      setState(() {
        _subscriptionPlans = plans;
        _subscriptionsLoading = false;
      });
    } catch (e) {
      setState(() {
        _subscriptionsError = e
            .toString()
            .replaceFirst('ApiException: ', '')
            .replaceFirst('ApiException(null): ', '');
        _subscriptionsLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = CartProviderScope.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: Text(
          widget.title,
          style: const TextStyle(
            color: Color(0xFF1A1A1A),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A1A)),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if (widget.title == 'Credit Cards')
            IconButton(
              icon: const Icon(
                Icons.add_circle_outline,
                color: Color(0xFF1A1A1A),
              ),
              onPressed: () {
                // Handle add new
              },
            ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          child: _buildContent(widget.title, cartProvider, context),
        ),
      ),
    );
  }

  Widget _buildContent(
    String title,
    CartProvider provider,
    BuildContext context,
  ) {
    switch (title) {
      case 'My Address':
        return _buildAddressDetail(provider);
      case 'My Orders':
        return _buildOrdersDetail(provider);
      case 'My Favorites':
        return _buildFavoritesDetail(provider);
      case 'Subscriptions':
        return _buildSubscriptionsDetail();
      case 'Transactions':
        return _buildTransactionsDetail();
      case 'Notifications':
        return _buildNotificationsDetail();
      case 'Credit Cards':
        return _buildCardsDetail(provider);
      case 'About me':
        return _buildAboutMeDetail(provider);
      default:
        return Center(child: Text('Content for $title coming soon!'));
    }
  }

  // --- MY ADDRESS DESIGN (Enhanced) ---
  Widget _buildAddressDetail(CartProvider provider) {
    final addresses = provider.addresses;
    final profile = provider.userProfile;

    return Column(
      children: [
        ...addresses.asMap().entries.map((entry) {
          final int index = entry.key;
          final addr = entry.value;
          final isSelected = provider.selectedAddressIndex == index;

          return GestureDetector(
            onTap: () {
              provider.selectAddress(index);
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected
                      ? const Color(0xFF15803D)
                      : Colors.transparent,
                  width: 2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: isSelected
                        ? const Color(0xFF15803D).withValues(alpha: 0.1)
                        : Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (addr.isDefault)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFCFFAFE),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'DEFAULT',
                            style: TextStyle(
                              color: Color(0xFF15803D),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        )
                      else
                        const SizedBox.shrink(),
                      // Selection Indicator (Radio Button style)
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF15803D)
                                : Colors.grey.shade300,
                            width: 2,
                          ),
                        ),
                        child: isSelected
                            ? Center(
                                child: Container(
                                  width: 10,
                                  height: 10,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF15803D),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              )
                            : null,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: const Color(0xFFCFFAFE),
                        child: Icon(
                          addr.title.toLowerCase() == 'home'
                              ? Icons.home_rounded
                              : addr.title.toLowerCase() == 'office' ||
                                      addr.title.toLowerCase() == 'work'
                                  ? Icons.work_rounded
                                  : Icons.location_on_rounded,
                          color: const Color(0xFF15803D),
                          size: 20,
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
                                  addr.title,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 16,
                                    color: Color(0xFF1A1A1A),
                                  ),
                                ),
                                Row(
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit_outlined,
                                          size: 18, color: Colors.grey),
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) =>
                                                AddressFormPage(address: addr),
                                          ),
                                        );
                                      },
                                      constraints: const BoxConstraints(),
                                      padding: EdgeInsets.zero,
                                    ),
                                    const SizedBox(width: 8),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline,
                                          size: 18, color: Colors.redAccent),
                                      onPressed: () {
                                        provider.removeAddress(addr.id);
                                      },
                                      constraints: const BoxConstraints(),
                                      padding: EdgeInsets.zero,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              profile.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: Color(0xFF4B5563),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${addr.street}\n${addr.details}',
                              style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 13,
                                  height: 1.4),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              profile.phone,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                                color: Color(0xFF1A1A1A),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }),
        const SizedBox(height: 24),
        // Add New Address Button
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: const Color(0xFFF1F4F8),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
                color: Colors.grey.shade300, style: BorderStyle.solid),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const AddressFormPage()),
                );
              },
              borderRadius: BorderRadius.circular(16),
              child: const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add_circle_outline, color: Color(0xFF15803D)),
                    SizedBox(width: 8),
                    Text(
                      'Add New Address',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF15803D),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildOrdersDetail(CartProvider provider) {
    if (provider.isOrdersLoading) {
      return const Padding(
        padding: EdgeInsets.only(top: 40),
        child:
            Center(child: CircularProgressIndicator(color: Color(0xFF15803D))),
      );
    }

    final orders = provider.orders;
    if (orders.isEmpty) {
      return const Padding(
        padding: EdgeInsets.only(top: 40),
        child: Center(child: Text('No orders yet.')),
      );
    }
    return Column(
      children: List.generate(orders.length, (index) {
        final isExpanded = _expandedOrderIndex == index;
        return _buildOrderCard(index, isExpanded, orders[index]);
      }),
    );
  }

  Widget _buildOrderCard(int index, bool isExpanded, UserOrder order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: CircleAvatar(
              radius: 30,
              backgroundColor: const Color(0xFFCFFAFE),
              child: const Icon(
                Icons.inventory_2_outlined,
                color: Color(0xFF15803D),
              ),
            ),
            title: Text(
              'Order #${order.id}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Placed on ${_formatDate(order.date)}',
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Text(
                      'Items:',
                      style: TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    Text(
                      ' ${order.items.length}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Total:',
                      style: TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    Text(
                      ' ₹${order.total.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            trailing: Icon(
              isExpanded
                  ? Icons.expand_less_rounded
                  : Icons.expand_more_rounded,
              color: const Color(0xFF15803D),
            ),
            onTap: () {
              setState(() {
                _expandedOrderIndex = isExpanded ? null : index;
              });
            },
          ),
          if (isExpanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                children: [
                  const Divider(),
                  const SizedBox(height: 16),
                  _buildTimelineItem(
                    'Order Placed',
                    _formatDate(order.date),
                    Icons.inventory_2_outlined,
                    true,
                    true,
                  ),
                  _buildTimelineItem(
                    'Order Confirmed',
                    _formatDate(order.date),
                    Icons.check_circle_outline,
                    true,
                    true,
                  ),
                  _buildTimelineItem(
                    'Order Shipped',
                    'Processing',
                    Icons.edit_road_outlined,
                    true,
                    true,
                  ),
                  _buildTimelineItem(
                    'Order Delivered',
                    order.status == 'Delivered' ? _formatDate(order.date) : 'Pending',
                    Icons.shopping_basket_outlined,
                    order.status == 'Delivered',
                    order.status == 'Delivered',
                    isLast: true,
                  ),
                  if (order.status == 'Delivered') ...[
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (context) => ReviewDialog(
                              orderId: order.id,
                              items: order.items
                                  .map((i) => {
                                        '_id': i.id,
                                        'name': i.name,
                                        'image': i.image,
                                      })
                                  .toList(),
                              retailerId: order.retailer?['_id']?.toString() ??
                                  '65e9f8f8f8f8f8f8f8f8f8f8',
                              isOrderReview: true,
                            ),
                          );
                        },
                        icon: const Icon(Icons.star_outline,
                            color: Color(0xFF15803D)),
                        label: const Text(
                          'Rate & Review',
                          style: TextStyle(
                              color: Color(0xFF15803D),
                              fontWeight: FontWeight.bold),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFF15803D)),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
        ],
      ),
    );
  }

  // --- NOTIFICATIONS DESIGN (Image 4) ---
  Widget _buildNotificationsDetail() {
    return Column(
      children: _notificationSettings.keys.map((key) {
        return _buildNotificationCard(
          key,
          'Get real-time updates for $key.',
          _notificationSettings[key]!,
        );
      }).toList() + [
        const SizedBox(height: 60),
        _buildSaveButton('Save settings'),
      ],
    );
  }

  Widget _buildCardsDetail(CartProvider provider) {
    if (provider.payments.isEmpty) {
      return const Padding(
        padding: EdgeInsets.only(top: 40),
        child: Center(
            child: Text('No credit cards saved yet.',
                style: TextStyle(color: Colors.grey, fontSize: 16))),
      );
    }
    
    return Column(
      children: [
        // Map over provider.payments here when ready
        const SizedBox(height: 32),
        _buildSaveButton('Save card'),
      ],
    );
  }

  // --- SHARED COMPONENTS ---

  Widget _buildIconTextField(
    IconData icon,
    String hint, {
    IconData? trailingIcon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF1F4F8),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: TextField(
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
          prefixIcon: Icon(icon, color: Colors.grey, size: 20),
          suffixIcon: trailingIcon != null
              ? Icon(trailingIcon, color: Colors.grey)
              : null,
        ),
      ),
    );
  }

  Widget _buildSaveButton(String text) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: () {},
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF15803D), // Darker designer green
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: Text(
          text,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildTimelineItem(
    String title,
    String subtitle,
    IconData icon,
    bool isActive,
    bool isCompleted, {
    bool isLast = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: isCompleted
                    ? const Color(0xFFCFFAFE)
                    : const Color(0xFFF1F4F8),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: isCompleted ? const Color(0xFF15803D) : Colors.grey,
                size: 24,
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 50,
                color: isCompleted
                    ? const Color(0xFFCFFAFE)
                    : const Color(0xFFF1F4F8),
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 14),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
              const Divider(height: 48),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNotificationCard(String title, String desc, bool value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  desc,
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Switch(
            value: value,
            onChanged: (v) {
              setState(() {
                _notificationSettings[title] = v;
              });
            },
            activeThumbColor: const Color(0xFF15803D),
            activeTrackColor: const Color(0xFFCFFAFE),
          ),
        ],
      ),
    );
  }

  // --- MY FAVORITES DESIGN (Image 5) ---
  Widget _buildFavoritesDetail(CartProvider provider) {
    if (provider.favRestaurants.isEmpty) {
      return const Padding(
        padding: EdgeInsets.only(top: 40),
        child: Center(
          child: Text('No favorites yet.',
              style: TextStyle(color: Colors.grey, fontSize: 16)),
        ),
      );
    }

    return Column(
      children: provider.favRestaurants.map((fav) {
        return _buildFavoriteCard(
          fav.name,
          fav.discount,
          '—',
          1,
          fav.image,
          const Color(0xFFE3F2FD),
        );
      }).toList(),
    );
  }

  Widget _buildFavoriteCard(
    String title,
    String weight,
    String price,
    int count,
    String image,
    Color bgColor,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 15,
            spreadRadius: 0,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  color: bgColor,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Image.asset(
                    image,
                    width: 45,
                    height: 45,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '₹$price x $count',
                    style: const TextStyle(
                      color: Color(0xFF15803D),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                  Text(
                    weight,
                    style: const TextStyle(color: Colors.grey, fontSize: 11),
                  ),
                ],
              ),
            ),
            Column(
              children: [
                IconButton(
                  icon: const Icon(
                    Icons.add,
                    size: 18,
                    color: Color(0xFF15803D),
                  ),
                  onPressed: () {},
                ),
                Text(
                  '$count',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.remove, size: 18, color: Colors.grey),
                  onPressed: () {},
                ),
              ],
            ),
            if (title == 'Black Grapes') // Match Image 5's swipe state
              Container(
                width: 60,
                height: 110,
                color: const Color(0xFFFF5252),
                child: const Icon(Icons.delete_outline, color: Colors.white),
              ),
          ],
        ),
      ),
    );
  }

  // --- TRANSACTIONS DESIGN ---
  Widget _buildTransactionsDetail() {
    final cartProvider = CartProviderScope.of(context);
    if (cartProvider.transactions.isEmpty) {
      return const Padding(
        padding: EdgeInsets.only(top: 40),
        child: Center(
          child: Text('No transactions found.',
              style: TextStyle(color: Colors.grey, fontSize: 16)),
        ),
      );
    }
    
    return Column(
      children: cartProvider.transactions.map((tx) {
        final amount = tx['amount'] ?? 0;
        final isNegative = tx['type'] == 'Debit';
        return _buildTransactionItem(
          tx['description'] ?? 'Transaction',
          _formatDate(tx['createdAt'] ?? ''),
          '${isNegative ? '-' : '+'}₹$amount',
          tx['status'] ?? 'Completed',
          isNegative: isNegative,
          isFailed: tx['status'] == 'Failed',
        );
      }).toList(),
    );
  }

  Widget _buildTransactionItem(
    String title,
    String date,
    String amount,
    String status, {
    bool isNegative = true,
    bool isFailed = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: isFailed
                ? Colors.red.withValues(alpha: 0.1)
                : (isNegative
                    ? Colors.orange.withValues(alpha: 0.1)
                    : AppColors.primary.withValues(alpha: 0.1)),
            child: Icon(
              isFailed
                  ? Icons.error_outline
                  : (isNegative
                      ? Icons.shopping_bag_outlined
                      : Icons.account_balance_wallet_outlined),
              color: isFailed
                  ? Colors.red
                  : (isNegative ? Colors.orange : AppColors.primary),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                Text(
                  date,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amount,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: isFailed
                      ? Colors.grey
                      : (isNegative ? Colors.black : AppColors.primary),
                ),
              ),
              Text(
                status,
                style: TextStyle(
                  fontSize: 10,
                  color: isFailed ? Colors.red : Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- ABOUT ME DESIGN (Image 4) ---
  Widget _buildAboutMeDetail(CartProvider provider) {
    final profile = provider.userProfile;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Personal Details',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: Color(0xFF1A1A1A),
          ),
        ),
        const SizedBox(height: 16),
        _buildIconTextField(Icons.person_outline, profile.name),
        const SizedBox(height: 12),
        _buildIconTextField(Icons.mail_outline, profile.email),
        const SizedBox(height: 12),
        _buildIconTextField(Icons.phone_android_outlined, profile.phone),
        const SizedBox(height: 32),
        const Text(
          'Change Password',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: Color(0xFF1A1A1A),
          ),
        ),
        const SizedBox(height: 16),
        _buildIconTextField(Icons.lock_outline, 'Current password'),
        const SizedBox(height: 12),
        _buildIconTextField(
          Icons.lock_outline,
          '••••••',
          trailingIcon: Icons.visibility_outlined,
        ),
        const SizedBox(height: 12),
        _buildIconTextField(Icons.lock_outline, 'Confirm password'),
        const SizedBox(height: 40),
        _buildSaveButton('Save settings'),
      ],
    );
  }

  // ── SUBSCRIPTIONS DESIGN ───────────────────────────────────────────────────
  Widget _buildSubscriptionsDetail() {
    if (_subscriptionsLoading) {
      return const SizedBox(
        height: 300,
        child: Center(
          child: CircularProgressIndicator(
            color: Color(0xFF15803D),
          ),
        ),
      );
    }

    if (_subscriptionsError != null) {
      return SizedBox(
        height: 300,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline,
                  color: Colors.redAccent, size: 48),
              const SizedBox(height: 12),
              Text(
                _subscriptionsError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _loadSubscriptions,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF15803D),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (_subscriptionPlans.isEmpty) {
      return const SizedBox(
        height: 300,
        child: Center(
          child: Text(
            'No subscription plans available.',
            style: TextStyle(color: Colors.grey, fontSize: 15),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF14532D), Color(0xFF15803D)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF15803D).withValues(alpha: 0.32),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.card_membership_outlined,
                  color: Colors.white,
                  size: 28,
                ),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Choose Your Plan',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Unlock exclusive Difwa benefits',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Plan cards
        ..._subscriptionPlans.map((plan) => _buildSubscriptionCard(plan)),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildSubscriptionCard(SubscriptionPlan plan) {
    final isSelected = _selectedPlanId == plan.id;
    final isSilver = plan.name.toLowerCase().contains('silver');
    final planColor =
        isSilver ? const Color(0xFF2979FF) : const Color(0xFFFF6D00);
    final planGradient = isSilver
        ? const LinearGradient(
            colors: [Color(0xFF1565C0), Color(0xFF42A5F5)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          )
        : const LinearGradient(
            colors: [Color(0xFFE65100), Color(0xFFFFB74D)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          );

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSelected ? planColor : Colors.transparent,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: planColor.withValues(alpha: isSelected ? 0.22 : 0.10),
            blurRadius: 18,
            spreadRadius: 0,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Plan header gradient strip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            decoration: BoxDecoration(
              gradient: planGradient,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(18),
                topRight: Radius.circular(18),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '₹${plan.price}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Text(
                              '/${plan.billingCycle}',
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (plan.badge != null && plan.badge!.isNotEmpty)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      plan.badge!,
                      style: TextStyle(
                        color: planColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Description
                Text(
                  plan.description,
                  style: const TextStyle(
                    color: Color(0xFF6B7280),
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 14),

                // Highlights row
                Row(
                  children: [
                    _buildHighlightChip(
                      Icons.discount_outlined,
                      '${plan.discountPercentage}% off',
                      planColor,
                    ),
                    const SizedBox(width: 8),
                    _buildHighlightChip(
                      Icons.shopping_bag_outlined,
                      'Up to ${plan.maxOrderQuantity}kg',
                      planColor,
                    ),
                    if (plan.priorityDelivery) ...[
                      const SizedBox(width: 8),
                      _buildHighlightChip(
                        Icons.bolt,
                        'Priority',
                        planColor,
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 16),

                // Features
                ...plan.features.map(
                  (f) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(
                            color: planColor.withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.check,
                            color: planColor,
                            size: 13,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            f,
                            style: const TextStyle(
                              fontSize: 13,
                              color: Color(0xFF374151),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 18),

                // Select button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => _selectedPlanId = plan.id);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isSelected
                          ? planColor
                          : planColor.withValues(alpha: 0.12),
                      foregroundColor: isSelected ? Colors.white : planColor,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: planColor,
                          width: isSelected ? 0 : 1.5,
                        ),
                      ),
                    ),
                    child: Text(
                      isSelected
                          ? 'Selected ✓'
                          : 'Select ${plan.name.split(' ').first} Plan',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHighlightChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}


