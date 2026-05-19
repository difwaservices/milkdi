import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/retailer_service.dart';

class DashboardState {
  final bool isLoading;
  final bool isShopOpen;
  final double totalSales;
  final int totalOrders;
  final int activeProducts;
  final int totalCustomers;
  final List<dynamic> activities;
  final List<dynamic> chartData;
  final String? error;

  DashboardState({
    this.isLoading = false,
    this.isShopOpen = true,
    this.totalSales = 0.0,
    this.totalOrders = 0,
    this.activeProducts = 0,
    this.totalCustomers = 0,
    this.activities = const [],
    this.chartData = const [],
    this.error,
  });

  DashboardState copyWith({
    bool? isLoading,
    bool? isShopOpen,
    double? totalSales,
    int? totalOrders,
    int? activeProducts,
    int? totalCustomers,
    List<dynamic>? activities,
    List<dynamic>? chartData,
    String? error,
  }) {
    return DashboardState(
      isLoading: isLoading ?? this.isLoading,
      isShopOpen: isShopOpen ?? this.isShopOpen,
      totalSales: totalSales ?? this.totalSales,
      totalOrders: totalOrders ?? this.totalOrders,
      activeProducts: activeProducts ?? this.activeProducts,
      totalCustomers: totalCustomers ?? this.totalCustomers,
      activities: activities ?? this.activities,
      chartData: chartData ?? this.chartData,
      error: error ?? this.error,
    );
  }
}

class DashboardController extends Notifier<DashboardState> {
  late RetailerService _retailerService;

  @override
  DashboardState build() {
    _retailerService = ref.watch(retailerServiceProvider);
    // Auto-refresh when build
    Future.microtask(() => refresh());
    return DashboardState();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final data = await _retailerService.getDashboardStats();
      if (data.isNotEmpty) {
        final stats = data['stats'] ?? {};
        state = state.copyWith(
          isLoading: false,
          totalSales: (stats['totalRevenue'] as num?)?.toDouble() ?? 0.0,
          totalOrders: (stats['totalOrders'] as num?)?.toInt() ?? 0,
          activeProducts: (stats['activeProducts'] as num?)?.toInt() ?? 0,
          totalCustomers: (stats['totalCustomers'] as num?)?.toInt() ?? 0,
          isShopOpen: stats['isShopActive'] ?? true,
          activities: data['recentActivities'] ?? [],
          chartData: data['chartData'] ?? [],
        );
      } else {
        state = state.copyWith(isLoading: false, error: 'Failed to load stats');
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> toggleShopStatus() async {
    final newStatus = await _retailerService.toggleShopStatus();
    state = state.copyWith(isShopOpen: newStatus);
  }
}

final dashboardControllerProvider = NotifierProvider<DashboardController, DashboardState>(() {
  return DashboardController();
});
