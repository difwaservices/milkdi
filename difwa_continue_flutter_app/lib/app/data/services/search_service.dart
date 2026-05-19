import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/search_model.dart';
import '../network/api_client.dart';

/// Provider for SearchService
final searchServiceProvider = Provider<SearchService>((ref) {
  return SearchService(client: ref.watch(apiClientProvider));
});

class SearchService {
  final ApiClient _client;

  SearchService({required ApiClient client}) : _client = client;

  /// Calls GET /api/app/search?query={query}
  /// Returns combined shops + products matching the query.
  Future<SearchResult> search(String query) async {
    if (query.trim().isEmpty) {
      return const SearchResult();
    }

    try {
      final json = await _client.get(
        '${ApiClient.baseUrl}/search',
        queryParameters: {'query': query.trim()},
        requiresAuth: false,
      );

      final data = json['data'];
      if (data is! Map<String, dynamic>) {
        return const SearchResult();
      }

      final rawShops = data['shops'] as List? ?? [];
      final rawProducts = data['products'] as List? ?? [];

      // Senior Dev: Offload complex search result parsing to an isolate
      return await compute(_parseSearchResult, {
        'shops': rawShops,
        'products': rawProducts,
      });
    } on ApiException catch (e) {
      throw ApiException(
          message: 'Search failed: ${e.message}', statusCode: e.statusCode);
    } catch (e) {
      throw ApiException(message: 'Search failed: ${e.toString()}');
    }
  }

  static SearchResult _parseSearchResult(Map<String, dynamic> data) {
    final rawShops = data['shops'] as List;
    final rawProducts = data['products'] as List;

    final shops = rawShops
        .map((e) => SearchShop.fromJson(e as Map<String, dynamic>))
        .toList();

    final products = rawProducts
        .map((e) => SearchProduct.fromJson(e as Map<String, dynamic>))
        .toList();

    return SearchResult(shops: shops, products: products);
  }

  /// Advanced product filtering: GET /api/app/search/products
  Future<PaginatedSearchProducts> searchProducts({
    double? minPrice,
    double? maxPrice,
    String? category,
    String? search,
    String? deliverySlot,
    int page = 1,
  }) async {
    try {
      final Map<String, dynamic> queryParams = {
        if (minPrice != null) 'minPrice': minPrice,
        if (maxPrice != null) 'maxPrice': maxPrice,
        if (category != null && category.isNotEmpty) 'category': category,
        if (search != null && search.isNotEmpty) 'search': search,
        if (deliverySlot != null && deliverySlot.isNotEmpty) 'deliverySlot': deliverySlot,
        'page': page,
      };

      final json = await _client.get(
        '${ApiClient.baseUrl}/search/products',
        queryParameters: queryParams,
        requiresAuth: false,
      );

      final data = json['data'];
      if (data == null) {
        return const PaginatedSearchProducts();
      }

      // Senior Dev: Use compute for parsing to keep UI responsive
      return await compute(_parsePaginatedProducts, data as Map<String, dynamic>);
    } on ApiException catch (e) {
      throw ApiException(
          message: 'Product filtering failed: ${e.message}', statusCode: e.statusCode);
    } catch (e) {
      throw ApiException(message: 'Product filtering failed: ${e.toString()}');
    }
  }

  static PaginatedSearchProducts _parsePaginatedProducts(Map<String, dynamic> data) {
    return PaginatedSearchProducts.fromJson(data);
  }
}
