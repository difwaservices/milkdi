import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/food_models.dart';
import '../network/api_client.dart';
import 'socket_service.dart';

class OrderService {
  final ApiClient _apiClient;

  OrderService(this._apiClient);

  Future<Map<String, dynamic>> placeOrder({
    required List<Map<String, dynamic>> items,
    required double totalAmount,
    required Map<String, dynamic> deliveryAddress,
    required String paymentMethod,
    String? deliverySlot,
  }) async {
    try {
      final response = await _apiClient.post(
        '${ApiClient.baseUrl}/orders',
        data: {
          'items': items,
          'totalAmount': totalAmount,
          'deliveryAddress': deliveryAddress,
          'paymentMethod': paymentMethod,
          'orderType': 'One-time',
          if (deliverySlot != null) 'deliverySlot': deliverySlot,
        },
        requiresAuth: true,
      );

      return {
        'success': response['success'] ?? true,
        'order': response['order'] ?? response['data'],
        'message': response['message'],
      };
    } catch (e) {
      return {
        'success': false,
        'message': e.toString(),
      };
    }
  }

  Future<List<UserOrder>> getMyOrders() async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.baseUrl}/orders/history',
        requiresAuth: true,
      );

      final List<dynamic> rawData;
      if (response is List) {
        rawData = response;
      } else if (response is Map) {
        final data = response['data'];
        if (data is List) {
          rawData = data;
        } else if (data is Map) {
          rawData = data['orders'] ?? data['history'] ?? [];
        } else {
          rawData = response['orders'] ?? response['history'] ?? [];
        }
      } else {
        rawData = [];
      }

      // Senior Dev: Use isolate for mapping large lists of orders
      return await compute(_parseOrders, rawData);
    } catch (e) {
      debugPrint('Error fetching orders: $e');
      return [];
    }
  }

  static List<UserOrder> _parseOrders(List<dynamic> data) {
    return data
        .map((e) => UserOrder.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Map<String, dynamic>> placeSpotOrder({
    required Map<String, dynamic> deliveryAddress,
    required String paymentMethod,
  }) async {
    try {
      final response = await _apiClient.post(
        '${ApiClient.baseUrl}/orders/spot-order',
        data: {
          'deliveryAddress': deliveryAddress,
          'paymentMethod': paymentMethod,
          'orderType': 'One-time',
        },
        requiresAuth: true,
      );

      return {
        'success': response['success'] ?? true,
        'order': response['order'] ?? response['data'],
        'message': response['message'],
      };
    } catch (e) {
      return {
        'success': false,
        'message': e.toString(),
      };
    }
  }

  Future<List<UserOrder>> getActiveOrders() async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.baseUrl}/orders/active',
        requiresAuth: true,
      );

      final List<dynamic> rawData;
      if (response is List) {
        rawData = response;
      } else if (response is Map) {
        // Robust checking for common list keys
        final directList = response['orders'] ??
            response['data'] ??
            response['activeOrders'] ??
            response['items'] ??
            response['list'];
            
        if (directList is List) {
           rawData = directList;
        } else if (response['data'] is Map) {
          rawData = response['data']['orders'] ?? 
                    response['data']['activeOrders'] ?? 
                    response['data']['items'] ?? 
                    [];
        } else if (response['activeOrders'] is Map) {
          rawData = response['activeOrders']['orders'] ?? [];
        } else {
          // If response is a map but no list found, maybe the map itself is 
          // a single order (though unlikely for this endpoint)
          rawData = [];
        }
      } else {
        rawData = [];
      }

      return rawData
          .map((e) => UserOrder.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      debugPrint('OrderService: Error fetching active orders: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>> trackOrder(String orderIdOrMongId) async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.baseUrl}/orders/track/$orderIdOrMongId',
        requiresAuth: true,
      );
      if (response is Map && response['success'] == true) {
        return Map<String, dynamic>.from(
            response['order'] ?? response['data'] ?? {});
      }
      return {};
    } catch (e) {
      debugPrint('Error tracking order: $e');
      return {};
    }
  }

  /// Fetch the latest order associated with a subscription.
  /// The backend endpoint GET /app/orders/by-subscription/:subscriptionId
  /// should return the most recent order for that subscription.
  Future<Map<String, dynamic>> getOrderBySubscriptionId(
      String subscriptionId) async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.baseUrl}/orders/by-subscription/$subscriptionId',
        requiresAuth: true,
      );
      if (response is Map) {
        if (response['success'] == true) {
          final order = response['order'] ?? response['data'];
          if (order is Map) return Map<String, dynamic>.from(order);
        }
        // Fallback: if the response itself looks like an order
        if (response['_id'] != null) {
          return Map<String, dynamic>.from(response);
        }
      }
      return {};
    } catch (e) {
      debugPrint('Error fetching order by subscription: $e');
      return {};
    }
  }

  /// Fetch a single order by its MongoDB _id
  Future<Map<String, dynamic>> getOrderById(String mongoId) async {
    try {
      final response = await _apiClient.get(
        '${ApiClient.baseUrl}/orders/$mongoId',
        requiresAuth: true,
      );
      if (response is Map) {
        if (response['success'] == true) {
          final order = response['order'] ?? response['data'];
          if (order is Map) return Map<String, dynamic>.from(order);
        }
        if (response['_id'] != null) {
          return Map<String, dynamic>.from(response);
        }
      }
      return {};
    } catch (e) {
      debugPrint('Error fetching order by id: $e');
      return {};
    }
  }
}

final orderServiceProvider = Provider<OrderService>((ref) {
  return OrderService(ref.watch(apiClientProvider));
});

final myOrdersProvider = FutureProvider.autoDispose<List<UserOrder>>((ref) async {
  // keepAlive: order history can be large; cache it for the session so
  // navigating to/from My Orders page doesn't trigger a full re-fetch.
  ref.keepAlive();
  return ref.watch(orderServiceProvider).getMyOrders();
});

final activeOrdersProvider =
    AsyncNotifierProvider<ActiveOrdersNotifier, List<UserOrder>>(
        ActiveOrdersNotifier.new);

class ActiveOrdersNotifier extends AsyncNotifier<List<UserOrder>> {
  @override
  Future<List<UserOrder>> build() async {
    // Listen for real-time order status updates from socket
    final socket = ref.watch(socketServiceProvider);
    socket.onOrderUpdate((data) {
      debugPrint('🔔 ActiveOrdersNotifier: Order update received, refreshing...');
      ref.invalidateSelf();
    });

    ref.onDispose(() {
      socket.offOrderUpdate();
    });

    return _fetchActiveOrders();
  }

  Future<List<UserOrder>> _fetchActiveOrders() async {
    final service = ref.read(orderServiceProvider);
    try {
      // 1. Try dedicated active orders endpoint
      final active = await service.getActiveOrders();
      if (active.isNotEmpty) return active;

      // 2. Fallback: Parse history for anything not delivered/cancelled
      // This ensures orders show up even if the /active endpoint is inconsistent
      final history = await service.getMyOrders();
      return history.where((o) {
        final s = o.status.toLowerCase();
        return s != 'delivered' && s != 'cancelled';
      }).toList();
    } catch (e) {
      debugPrint('Error in _fetchActiveOrders: $e');
      return [];
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _fetchActiveOrders());
  }
}

/// Provider that fetches a single order by subscription ID (latest order).
final orderBySubscriptionProvider = FutureProvider.autoDispose
    .family<Map<String, dynamic>, String>((ref, subscriptionId) {
  return ref
      .watch(orderServiceProvider)
      .getOrderBySubscriptionId(subscriptionId);
});

/// Provider that fetches a single order by its MongoDB _id.
final orderByIdProvider = FutureProvider.autoDispose
    .family<Map<String, dynamic>, String>((ref, mongoId) {
  return ref.watch(orderServiceProvider).getOrderById(mongoId);
});
