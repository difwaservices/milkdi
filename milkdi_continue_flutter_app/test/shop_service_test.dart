import 'package:flutter_test/flutter_test.dart';
import 'package:difwawaterapp/app/data/services/shop_service.dart';
import 'package:difwawaterapp/app/data/network/api_client.dart';
import 'package:difwawaterapp/app/data/models/shop_product_model.dart';
import 'package:difwawaterapp/app/data/models/food_models.dart';
import 'package:dio/dio.dart';

// A simple mock for ApiClient to avoid using mockito which might not be installed
class MockApiClient extends ApiClient {
  MockApiClient() : super(Dio());

  @override
  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    bool requiresAuth = false,
  }) async {
    if (path.contains('/shops') && !path.contains('/products')) {
      // Mock getShops response
      return {
        'data': [
          {
            '_id': 'shop123',
            'name': 'Test Shop',
            'description': 'A test shop',
            'rating': 4.5,
            'isOpen': true,
          }
        ]
      };
    } else if (path.contains('/categories')) {
      // Mock getCategories response
      return {
        'data': [
          {
            '_id': 'cat123',
            'name': 'Beverages',
            'image': 'beverages.png',
          }
        ]
      };
    } else if (path.contains('/products')) {
      // Mock getShopProducts response
      return {
        'data': [
          {
            '_id': 'prod123',
            'name': 'Water Bottle',
            'price': 15,
            'shopId': 'shop123',
          }
        ]
      };
    }
    return {'data': []};
  }
}

void main() {
  group('ShopService Tests', () {
    late ShopService shopService;
    late MockApiClient mockApiClient;

    setUp(() {
      mockApiClient = MockApiClient();
      shopService = ShopService(client: mockApiClient);
    });

    test('getShops returns list of shops', () async {
      final shops = await shopService.getShops();
      expect(shops, isNotEmpty);
      expect(shops.first.name, 'Test Shop');
    });

    test('getCategories returns list of categories', () async {
      final categories = await shopService.getCategories();
      expect(categories, isNotEmpty);
      expect(categories.first.name, 'Beverages');
    });

    test('getShopProducts returns list of products', () async {
      final products = await shopService.getShopProducts('shop123');
      expect(products, isNotEmpty);
      expect(products.first.name, 'Water Bottle');
      expect(products.first.price, 15);
    });
  });
}
