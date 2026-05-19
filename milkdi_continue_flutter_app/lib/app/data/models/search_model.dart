/// Model for a shop returned in global search results.
class SearchShop {
  final String id;
  final String name;
  final String businessName;
  final String image;
  final String location;
  final bool isShopActive;
  final double rating;
  final String deliveryTime;

  const SearchShop({
    required this.id,
    required this.name,
    this.businessName = '',
    this.image = '',
    this.location = '',
    this.isShopActive = true,
    this.rating = 4.5,
    this.deliveryTime = '30-45 mins',
  });

  factory SearchShop.fromJson(Map<String, dynamic> json) {
    return SearchShop(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      businessName: (json['businessName'] ?? '').toString(),
      image: (json['image'] ?? json['logo'] ?? json['banner'] ?? '').toString(),
      location: (json['location'] ?? json['address'] ?? '').toString(),
      isShopActive: json['isShopActive'] ?? json['isActive'] ?? true,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.5,
      deliveryTime: (json['deliveryTime'] ?? '30-45 mins').toString(),
    );
  }
}

/// Model for a product returned in global search results.
class SearchProduct {
  final String id;
  final String name;
  final double price;
  final String image;
  final String description;
  final String stockStatus;
  final String shopId;
  final String shopName;
  final String categoryId;
  final String categoryName;
  final bool isShopActive;

  const SearchProduct({
    required this.id,
    required this.name,
    required this.price,
    this.image = '',
    this.description = '',
    this.stockStatus = 'In Stock',
    required this.shopId,
    required this.shopName,
    this.categoryId = '',
    this.categoryName = '',
    this.isShopActive = true,
  });

  bool get isAvailable => stockStatus == 'In Stock';

  String get displayImage {
    if (image.length > 5) return image;
    return '';
  }

  factory SearchProduct.fromJson(Map<String, dynamic> json) {
    final shopData = json['shop'];
    String shopId = '';
    String shopName = '';
    bool isShopActiveRetailer = true;

    if (shopData is Map<String, dynamic>) {
      shopId = (shopData['id'] ?? shopData['_id'] ?? '').toString();
      shopName = (shopData['name'] ?? '').toString();
      isShopActiveRetailer = shopData['isShopActive'] ?? true;
    }

    final categoryData = json['category'];
    String categoryId = '';
    String categoryName = '';
    if (categoryData is Map<String, dynamic>) {
      categoryId = (categoryData['id'] ?? categoryData['_id'] ?? '').toString();
      categoryName = (categoryData['name'] ?? '').toString();
    } else if (categoryData != null) {
      categoryId = categoryData.toString();
    }

    // Resolve image from various possible fields
    String image = '';
    final rawImages = json['images'];
    if (rawImages is List && rawImages.isNotEmpty) {
      image = rawImages.first.toString();
    }
    final singleImage = json['image'] ?? json['imageUrl'] ?? json['productImage'];
    if (image.isEmpty && singleImage != null && singleImage.toString().isNotEmpty) {
      image = singleImage.toString();
    }

    return SearchProduct(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      image: image,
      description: (json['description'] ?? '').toString(),
      stockStatus: (json['stockStatus'] ?? 'In Stock').toString(),
      shopId: shopId,
      shopName: shopName,
      categoryId: categoryId,
      categoryName: categoryName,
      isShopActive: isShopActiveRetailer,
    );
  }
}

/// Model for the pagination metadata.
class SearchPagination {
  final int totalItems;
  final int currentPage;
  final int totalPages;

  const SearchPagination({
    this.totalItems = 0,
    this.currentPage = 1,
    this.totalPages = 1,
  });

  factory SearchPagination.fromJson(Map<String, dynamic> json) {
    return SearchPagination(
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
      currentPage: (json['currentPage'] as num?)?.toInt() ?? 1,
      totalPages: (json['totalPages'] as num?)?.toInt() ?? 1,
    );
  }
}

/// Paginated result container for products.
class PaginatedSearchProducts {
  final List<SearchProduct> products;
  final SearchPagination pagination;

  const PaginatedSearchProducts({
    this.products = const [],
    this.pagination = const SearchPagination(),
  });

  factory PaginatedSearchProducts.fromJson(Map<String, dynamic> json) {
    final list = (json['products'] as List? ?? [])
        .map((e) => SearchProduct.fromJson(e as Map<String, dynamic>))
        .toList();
    
    return PaginatedSearchProducts(
      products: list,
      pagination: SearchPagination.fromJson(json['pagination'] ?? {}),
    );
  }
}

/// Combined search results container.
class SearchResult {
  final List<SearchShop> shops;
  final List<SearchProduct> products;

  const SearchResult({
    this.shops = const [],
    this.products = const [],
  });

  bool get isEmpty => shops.isEmpty && products.isEmpty;
  int get totalCount => shops.length + products.length;
}
