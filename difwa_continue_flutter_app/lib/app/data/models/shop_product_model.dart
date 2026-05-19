import 'food_models.dart';

/// Model for an API-fetched product category (embedded inside a product).
class ShopProductCategory {
  final String id;
  final String name;

  const ShopProductCategory({required this.id, required this.name});

  factory ShopProductCategory.fromJson(Map<String, dynamic> json) {
    return ShopProductCategory(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
    );
  }
}

/// Model for an API-fetched product belonging to a shop.
class ShopProduct {
  final String id;
  final String name;
  final String description;
  final double price;
  final ShopProductCategory? category;
  final List<String> images;
  final int stock;
  final String stockStatus; // "In Stock" | "Out of Stock"
  final String retailerId;
  final String status; // "Published" | "Draft"
  final DateTime createdAt;

  const ShopProduct({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.category,
    required this.images,
    required this.stock,
    required this.stockStatus,
    required this.retailerId,
    required this.status,
    required this.createdAt,
  });

  bool get isAvailable =>
      status == 'Published' && stockStatus == 'In Stock' && stock > 0;

  String get primaryImage {
    if (images.isNotEmpty && images.first.length > 5) return images.first;

    // Fallback image by product name keyword (milk products)
    final lower = name.toLowerCase();
    if (lower.contains('full cream') || lower.contains('toned')) {
      return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.contains('a2') || lower.contains('organic')) {
      return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.contains('buffalo')) {
      return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.contains('skimmed') || lower.contains('low fat')) {
      return 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.contains('paneer') || lower.contains('curd') || lower.contains('ghee')) {
      return 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800&auto=format&fit=crop';
    }
    if (lower.contains('butter') || lower.contains('cream')) {
      return 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop';
    }
    // Generic milk fallback
    return 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?q=80&w=800&auto=format&fit=crop';
  }

  Product toProduct(bool shopActive, {String? shopName}) {
    return Product(
      id: id,
      name: name,
      image: primaryImage,
      price: price,
      weight: category?.name ?? 'Milk Variety',
      category: category?.name ?? 'Dairy',
      description: description,
      isShopActive: shopActive,
      badgeText: (stockStatus == 'Out of Stock' || stock <= 0) ? 'Out of Stock' : '',
      shopId: retailerId,
      shopName: shopName ?? '',
      stockStatus: stockStatus,
      stock: stock,
    );
  }

  factory ShopProduct.fromJson(Map<String, dynamic> json) {
    // Collect images from various possible fields
    final List<String> images = [];

    final rawImages = json['images'];
    if (rawImages is List) {
      images.addAll(rawImages.map((e) => e.toString()));
    }

    final singleImage =
        json['image'] ?? json['imageUrl'] ?? json['productImage'];
    if (singleImage != null && singleImage.toString().isNotEmpty) {
      if (!images.contains(singleImage.toString())) {
        images.add(singleImage.toString());
      }
    }

    ShopProductCategory? category;
    if (json['category'] is Map<String, dynamic>) {
      category = ShopProductCategory.fromJson(
          json['category'] as Map<String, dynamic>);
    }

    return ShopProduct(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      category: category,
      images: images,
      stock: (json['stock'] as num?)?.toInt() ?? 0,
      stockStatus: (json['stockStatus'] ?? 'Out of Stock').toString(),
      retailerId: (json['retailer'] ?? '').toString(),
      status: (json['status'] ?? 'Draft').toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// Model representing a Shop (shown as a restaurant card on the home screen).
class ShopModel {
  final String id;
  final String name;
  final String businessName;
  final String image;
  final String location;
  final double rating;
  final String deliveryTime;
  final bool isShopActive;
  final bool isFeatured;
  final List<String> deliverySlots;

  const ShopModel({
    required this.id,
    required this.name,
    this.businessName = '',
    this.image = '',
    this.location = '',
    this.rating = 4.5,
    this.deliveryTime = '30-45 mins',
    this.isShopActive = true,
    this.isFeatured = false,
    this.deliverySlots = const [],
  });

  ShopModel copyWith({
    String? id,
    String? name,
    String? businessName,
    String? image,
    String? location,
    double? rating,
    String? deliveryTime,
    bool? isShopActive,
    bool? isFeatured,
    List<String>? deliverySlots,
  }) {
    return ShopModel(
      id: id ?? this.id,
      name: name ?? this.name,
      businessName: businessName ?? this.businessName,
      image: image ?? this.image,
      location: location ?? this.location,
      rating: rating ?? this.rating,
      deliveryTime: deliveryTime ?? this.deliveryTime,
      isShopActive: isShopActive ?? this.isShopActive,
      isFeatured: isFeatured ?? this.isFeatured,
      deliverySlots: deliverySlots ?? this.deliverySlots,
    );
  }

  factory ShopModel.fromJson(Map<String, dynamic> json) {
    return ShopModel(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: (json['name'] ?? 'Difwa Shop').toString(),
      businessName: (json['businessName'] ?? '').toString(),
      image: (json['image'] ?? json['logo'] ?? json['banner'] ?? '').toString(),
      location: (json['location'] ?? json['address'] ?? '').toString(),
      rating: (json['rating'] as num?)?.toDouble() ?? 4.5,
      deliveryTime: (json['deliveryTime'] ?? '30-45 mins').toString(),
      isShopActive: json['isShopActive'] ?? json['isActive'] ?? true,
      isFeatured: json['isFeatured'] ?? json['featured'] ?? false,
      deliverySlots: (json['deliverySlots'] as List?)
              ?.map((e) => e.toString())
              .toList() ??
          (json['businessDetails']?['deliverySlots'] as List?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
    );
  }
}
