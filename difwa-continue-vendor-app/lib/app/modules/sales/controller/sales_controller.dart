import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/retailer_service.dart';

class SalesState {
  final bool isLoading;
  final Map<String, dynamic> stats;
  final String? error;

  SalesState({
    this.isLoading = false,
    this.stats = const {},
    this.error,
  });

  SalesState copyWith({
    bool? isLoading,
    Map<String, dynamic>? stats,
    String? error,
  }) {
    return SalesState(
      isLoading: isLoading ?? this.isLoading,
      stats: stats ?? this.stats,
      error: error ?? this.error,
    );
  }
}

class SalesController extends Notifier<SalesState> {
  late RetailerService _retailerService;

  @override
  SalesState build() {
    _retailerService = ref.watch(retailerServiceProvider);
    Future.microtask(() => refresh());
    return SalesState();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final stats = await _retailerService.getRevenueStats();
      state = state.copyWith(isLoading: false, stats: stats);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final salesControllerProvider = NotifierProvider<SalesController, SalesState>(() {
  return SalesController();
});
