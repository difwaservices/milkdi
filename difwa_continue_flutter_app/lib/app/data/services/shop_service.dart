import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/shop_product_model.dart';
import '../models/food_models.dart';
import '../network/api_client.dart';
import 'package:flutter/foundation.dart';

/// Provider for ShopService
final shopServiceProvider = Provider<ShopService>((ref) {
  return ShopService(client: ref.watch(apiClientProvider));
});

/// Reactive Provider for a specific shop's details
final shopDetailsProvider = FutureProvider.family<ShopModel?, String>((ref, id) {
  return ref.watch(shopServiceProvider).getShopDetails(id);
});

/// Service layer for shops.

class ShopService {
  final ApiClient _client;

  ShopService({required ApiClient client}) : _client = client;

  Future<List<ShopModel>> getShops() async {
    try {
      final json = await _client.get(
        '${ApiClient.baseUrl}/shops',
        requiresAuth: false,
      );

      final raw = json['data'] as List<dynamic>? ?? [];
      
      // Senior Dev: Offload complex shop listing to isolate
      return await compute(_parseShops, raw);
    } catch (e) {
      debugPrint('ShopService: Error fetching shops: $e');
      return [];
    }
  }

  static List<ShopModel> _parseShops(List<dynamic> data) {
    return data
        .map((e) => ShopModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<ShopProduct>> getShopProducts(String shopId) async {
    try {
      final json = await _client.get(
        '${ApiClient.baseUrl}/shops/$shopId/products',
        requiresAuth: false,
      );
      final raw = (json['data'] ?? json['products']) as List<dynamic>? ?? [];
      
      // Senior Dev: Background thread for shop product parsing
      return await compute(_parseShopProducts, raw);
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
          message:
              'Failed to fetch products for shop $shopId: ${e.toString()}');
    }
  }

  static List<ShopProduct> _parseShopProducts(List<dynamic> data) {
    return data
        .map((e) => ShopProduct.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<FoodCategory>> getCategories() async {
    try {
      final json = await _client.get(
        '${ApiClient.baseUrl}/categories',
        requiresAuth: false,
      );
      final raw = json['data'] as List<dynamic>? ?? [];
      
      // Senior Dev: Isolate for category mapping
      return await compute(_parseCategories, raw);
    } catch (e) {
      debugPrint('ShopService: Error fetching categories: $e');
      return [];
    }
  }

  static List<FoodCategory> _parseCategories(List<dynamic> data) {
    return data
        .map((e) => FoodCategory.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ShopModel?> getShopDetails(String shopId) async {
    try {
      final json = await _client.get(
        '${ApiClient.baseUrl}/shops/$shopId',
        requiresAuth: false,
      );
      final data = json['data'] ?? json;
      return ShopModel.fromJson(data as Map<String, dynamic>);
    } catch (e) {
      debugPrint('ShopService: Error fetching shop details for $shopId: $e');
      return null;
    }
  }
}
