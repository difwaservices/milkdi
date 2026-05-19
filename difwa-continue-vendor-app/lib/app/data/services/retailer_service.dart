import '../network/api_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RetailerService {
  final ApiClient _apiClient;

  RetailerService(this._apiClient);

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final response = await _apiClient.get('/retailer/dashboard-stats');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  Future<Map<String, dynamic>> getOrders() async {
    try {
      final response = await _apiClient.get('/retailer/orders');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return {'orders': [], 'stats': {}};
    } catch (e) {
      return {'orders': [], 'stats': {}};
    }
  }

  Future<bool> updateOrderStatus(String orderId, String status) async {
    try {
      final response = await _apiClient.patch('/retailer/order-status', data: {
        'orderId': orderId,
        'status': status,
      });
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> toggleShopStatus() async {
    try {
      final response = await _apiClient.patch('/retailer/toggle-status');
      if (response != null && response['success'] == true) {
        return response['isShopActive'];
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // --- Product Management ---
  Future<List<dynamic>> getProducts() async {
    try {
      final response = await _apiClient.get('/retailer/products');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<List<dynamic>> getCategories() async {
    try {
      final response = await _apiClient.get('/retailer/categories');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> createProduct(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.post('/retailer/products', data: data);
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateProduct(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.put('/retailer/products/$id', data: data);
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deleteProduct(String id) async {
    try {
      final response = await _apiClient.delete('/retailer/products/$id');
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  // --- Customer & CRM ---
  Future<List<dynamic>> getCustomers() async {
    try {
      final response = await _apiClient.get('/retailer/customers');
      if (response != null && response['success'] == true) {
        return response['data']['customers'] ?? [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> addManualCustomer(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.post('/retailer/customers', data: data);
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  // --- Financials & Sales ---
  Future<Map<String, dynamic>> getRevenueStats() async {
    try {
      final response = await _apiClient.get('/retailer/revenue-stats');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  // --- Customer Detailed Support ---
  Future<Map<String, dynamic>> getCustomerOrders(String customerId) async {
    try {
      final response = await _apiClient.get('/retailer/orders', queryParameters: {'customerId': customerId});
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return {'orders': []};
    } catch (e) {
      return {'orders': []};
    }
  }

  Future<Map<String, dynamic>> getDueOrdersForCustomer(String customerId) async {
    try {
      final response = await _apiClient.get('/retailer/customers/$customerId/due-orders');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  Future<bool> settleCustomerDue(String customerId, double amount) async {
    try {
      final response = await _apiClient.post('/retailer/customers/settle-due', data: {
        'customerId': customerId,
        'amount': amount,
      });
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> createManualOrder(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.post('/retailer/orders/manual', data: data);
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> createManualSubscription(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.post('/retailer/subscriptions/manual', data: data);
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<List<dynamic>> getRiders() async {
    try {
      final response = await _apiClient.get('/rider/retailer');
      if (response != null && response['success'] == true) {
        return response['data'];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> assignRider(String orderId, String riderId) async {
    try {
      final response = await _apiClient.post('/retailer/assign-rider', data: {
        'orderId': orderId,
        'riderId': riderId,
      });
      return response != null && response['success'] == true;
    } catch (e) {
      return false;
    }
  }
}

final retailerServiceProvider = Provider<RetailerService>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return RetailerService(apiClient);
});
