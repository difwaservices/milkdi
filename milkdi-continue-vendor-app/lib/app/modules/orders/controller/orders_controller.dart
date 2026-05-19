import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/controller/auth_controller.dart';
import '../../../data/services/retailer_service.dart';
import '../../../data/services/socket_service.dart';

class OrdersState {
  final bool isLoading;
  final List<dynamic> orders;
  final Map<String, dynamic> stats;
  final String? error;

  OrdersState({
    this.isLoading = false,
    this.orders = const [],
    this.stats = const {},
    this.error,
  });

  OrdersState copyWith({
    bool? isLoading,
    List<dynamic>? orders,
    Map<String, dynamic>? stats,
    String? error,
  }) {
    return OrdersState(
      isLoading: isLoading ?? this.isLoading,
      orders: orders ?? this.orders,
      stats: stats ?? this.stats,
      error: error ?? this.error,
    );
  }
}

class OrdersController extends Notifier<OrdersState> {
  late RetailerService _retailerService;
  late SocketService _socketService;

  @override
  OrdersState build() {
    _retailerService = ref.watch(retailerServiceProvider);
    _socketService = ref.watch(socketServiceProvider);

    // Listen for real-time updates
    _socketService.onOrderUpdate((data) {
       debugPrint('🔔 Order update received: $data');
       refresh();
    });

    // Auto-refresh when build
    Future.microtask(() => refresh());

    return OrdersState();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final data = await _retailerService.getOrders();
      state = state.copyWith(
        isLoading: false,
        orders: data['orders'] ?? [],
        stats: data['stats'] ?? {},
      );
      
      // Join room if authenticated
      final authState = ref.read(authControllerProvider);
      if (authState.status == AuthStatus.authenticated && authState.user != null) {
          final userId = authState.user['_id'] ?? authState.user['id'];
          if (userId != null) {
            _socketService.joinRetailerRoom(userId.toString());
          }
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> updateStatus(String orderId, String status) async {
    final success = await _retailerService.updateOrderStatus(orderId, status);
    if (success) {
      refresh();
    }
    return success;
  }

  Future<List<dynamic>> fetchRiders() async {
    return await _retailerService.getRiders();
  }

  Future<bool> assignRider(String orderId, String riderId) async {
    final success = await _retailerService.assignRider(orderId, riderId);
    if (success) {
      refresh();
    }
    return success;
  }
}

final ordersControllerProvider = NotifierProvider<OrdersController, OrdersState>(() {
  return OrdersController();
});
