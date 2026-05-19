class SubscriptionPlan {
  final String id;
  final String name;
  final String description;
  final int price;
  final String billingCycle;
  final List<String> features;
  final int maxOrderQuantity;
  final int discountPercentage;
  final bool bulkOrdersAllowed;
  final int freeDeliveries;
  final bool priorityDelivery;
  final String? badge;
  final String status;

  const SubscriptionPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.billingCycle,
    required this.features,
    required this.maxOrderQuantity,
    required this.discountPercentage,
    required this.bulkOrdersAllowed,
    required this.freeDeliveries,
    required this.priorityDelivery,
    this.badge,
    required this.status,
  });

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) {
    return SubscriptionPlan(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      price: (json['price'] as num?)?.toInt() ?? 0,
      billingCycle: json['billingCycle']?.toString() ?? '',
      features: (json['features'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      maxOrderQuantity: (json['maxOrderQuantity'] as num?)?.toInt() ?? 0,
      discountPercentage: (json['discountPercentage'] as num?)?.toInt() ?? 0,
      bulkOrdersAllowed: json['bulkOrdersAllowed'] as bool? ?? false,
      freeDeliveries: (json['freeDeliveries'] as num?)?.toInt() ?? 0,
      priorityDelivery: json['priorityDelivery'] as bool? ?? false,
      badge: json['badge']?.toString(),
      status: json['status']?.toString() ?? '',
    );
  }
}

class UserSubscription {
  final String id;
  final String productId;
  final String productName;
  final String productImage;
  final String frequency;
  final int quantity;
  final List<String> customDays;
  final String status;
  final DateTime startDate;
  final DateTime? endDate;
  final String retailerName;
  // Always stored as midnight-normalized local dates (no time component)
  final List<DateTime> vacationDates;
  final double price;
  final String? deliverySlot;

  /// Raw delivery address map as returned by the API
  final Map<String, dynamic>? deliveryAddress;

  UserSubscription({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productImage,
    this.retailerName = '',
    required this.frequency,
    required this.quantity,
    required this.customDays,
    required this.status,
    required this.startDate,
    this.price = 0.0,
    this.deliverySlot,
    this.endDate,
    this.vacationDates = const [],
    this.deliveryAddress,
  });

  /// Human-readable delivery address string
  String get deliveryAddressString {
    final m = deliveryAddress;
    if (m == null || m.isEmpty) return '';

    final label = m['label']?.toString() ?? '';
    final name = m['fullName']?.toString() ?? m['name']?.toString() ?? '';

    final street = m['fullAddress'] ?? m['address'] ?? m['street'] ?? '';
    final city = m['city'] ?? '';
    final state = m['state'] ?? '';
    final pincode = m['pincode'] ?? '';

    final parts = [street, city, state, pincode]
        .where((p) => p.toString().isNotEmpty)
        .toList();

    String addrStr = parts.join(', ');
    String result = '';

    if (label.isNotEmpty) result += '[${label.toUpperCase()}] ';
    if (name.isNotEmpty) result += '$name: ';
    result += addrStr;

    return result;
  }

  /// Parse a date string safely without timezone shifting.
  /// The backend returns ISO strings like "2026-04-09T00:00:00.000Z".
  /// We only care about the date part (YYYY-MM-DD), not the time.
  static DateTime _parseDateOnly(String? raw) {
    if (raw == null) return DateTime.now();
    final s = raw.trim();
    // Take only the first 10 chars: "YYYY-MM-DD"
    if (s.length >= 10) {
      final parts = s.substring(0, 10).split('-');
      if (parts.length == 3) {
        final y = int.tryParse(parts[0]);
        final m = int.tryParse(parts[1]);
        final d = int.tryParse(parts[2]);
        if (y != null && m != null && d != null) {
          return DateTime(y, m, d); // midnight local — no UTC shift
        }
      }
    }
    // Fallback: parse and normalize to midnight local
    final dt = DateTime.tryParse(s);
    if (dt != null) return DateTime(dt.year, dt.month, dt.day);
    return DateTime.now();
  }

  /// Returns true if this subscription has [date] in its vacation list.
  bool isOnVacationOn(DateTime date) {
    final d = DateTime(date.year, date.month, date.day);
    return vacationDates.any((vd) => vd == d);
  }

  factory UserSubscription.fromJson(Map<String, dynamic> json) {
    // 1. Extract potentially multiple items (combinations)
    final rawItems = (json['items'] ?? json['products']) as List? ?? [];
    String combinedName = '';
    String imageUrl = '';
    double totalPrice = 0.0;

    if (rawItems.isNotEmpty) {
      final names = <String>[];
      for (final item in rawItems) {
        final p = item['product'] is Map ? item['product'] : item;
        names.add("${p['name'] ?? 'Product'} (${item['quantity'] ?? 1})");

        // Use first product's image for the card
        if (imageUrl.isEmpty) {
          final images = p['images'] as List?;
          imageUrl = (images != null && images.isNotEmpty)
              ? images.first.toString()
              : p['image']?.toString() ?? '';
        }

        final unitPrice = (item['price'] as num?)?.toDouble() ??
            (p['price'] as num?)?.toDouble() ??
            0.0;
        totalPrice += unitPrice * (item['quantity'] ?? 1);
      }
      combinedName = names.join(" + ");
    }

    // 2. Fallback to single product if items is empty
    final product = json['product'];
    if (combinedName.isEmpty && product is Map) {
      combinedName = product['name']?.toString() ?? 'Product';
      final images = product['images'] as List?;
      imageUrl = (images != null && images.isNotEmpty)
          ? images.first.toString()
          : product['image']?.toString() ?? '';

      final pPrice = (product['price'] as num?)?.toDouble() ?? 0.0;
      totalPrice = pPrice * ((json['quantity'] as num?)?.toInt() ?? 1);
    }

    // Use top-level price if available
    final topLevelPrice =
        (json['totalAmount'] ?? json['price'] as num?)?.toDouble() ?? 0.0;
    if (topLevelPrice > 0) totalPrice = topLevelPrice;

    final retailer =
        json['retailer'] ?? (product is Map ? product['retailer'] : null);
    String retailerName = '';
    if (retailer is Map) {
      final biz = retailer['businessDetails'];
      if (biz is Map) {
        retailerName = biz['storeDisplayName']?.toString() ??
            biz['businessName']?.toString() ??
            '';
      } else {
        retailerName = retailer['name']?.toString() ?? '';
      }
    }

    return UserSubscription(
      id: json['_id']?.toString() ?? '',
      productId: product is Map ? product['_id']?.toString() ?? '' : '',
      productName: combinedName.isEmpty ? 'Subscription' : combinedName,
      productImage: imageUrl,
      retailerName: retailerName,
      frequency: json['frequency']?.toString() ?? 'Daily',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      price: totalPrice /
          ((json['quantity'] as num?)?.toInt() ?? 1), // Store unit price
      customDays: (json['customDays'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      status: json['status']?.toString() ?? 'Active',
      startDate: _parseDateOnly(json['startDate']?.toString()),
      endDate: json['endDate'] != null
          ? _parseDateOnly(json['endDate'].toString())
          : null,
      // Use timezone-safe parser so UTC "2026-04-09T00:00Z" stays as Apr 9
      vacationDates: (json['vacationDates'] as List<dynamic>?)
              ?.map((e) => _parseDateOnly(e.toString()))
              .toList() ??
          [],
      deliverySlot: json['deliverySlot']?.toString(),
      deliveryAddress: json['deliveryAddress'] is Map
          ? Map<String, dynamic>.from(json['deliveryAddress'])
          : null,
    );
  }


  UserSubscription copyWith({
    String? id,
    String? productId,
    String? productName,
    String? productImage,
    String? frequency,
    int? quantity,
    double? price,
    List<String>? customDays,
    String? status,
    DateTime? startDate,
    DateTime? endDate,
    String? retailerName,
    List<DateTime>? vacationDates,
    String? deliverySlot,
    Map<String, dynamic>? deliveryAddress,
  }) {
    return UserSubscription(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      productImage: productImage ?? this.productImage,
      frequency: frequency ?? this.frequency,
      quantity: quantity ?? this.quantity,
      price: price ?? this.price,
      customDays: customDays ?? this.customDays,
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      retailerName: retailerName ?? this.retailerName,
      vacationDates: vacationDates ?? this.vacationDates,
      deliverySlot: deliverySlot ?? this.deliverySlot,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
    );
  }
}
