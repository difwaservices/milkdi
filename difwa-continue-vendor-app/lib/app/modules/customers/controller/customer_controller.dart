import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/retailer_service.dart';

class CustomerState {
  final bool isLoading;
  final List<dynamic> customers;
  final String? error;

  CustomerState({
    this.isLoading = false,
    this.customers = const [],
    this.error,
  });

  CustomerState copyWith({
    bool? isLoading,
    List<dynamic>? customers,
    String? error,
  }) {
    return CustomerState(
      isLoading: isLoading ?? this.isLoading,
      customers: customers ?? this.customers,
      error: error ?? this.error,
    );
  }
}

class CustomerController extends Notifier<CustomerState> {
  late RetailerService _retailerService;

  @override
  CustomerState build() {
    _retailerService = ref.watch(retailerServiceProvider);
    Future.microtask(() => refresh());
    return CustomerState();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final customers = await _retailerService.getCustomers();
      state = state.copyWith(isLoading: false, customers: customers);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> addCustomer(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true);
    final success = await _retailerService.addManualCustomer(data);
    if (success) {
      await refresh();
    } else {
      state = state.copyWith(isLoading: false);
    }
    return success;
  }

  Future<Map<String, dynamic>> fetchHistory(String customerId) async {
    return await _retailerService.getCustomerOrders(customerId);
  }

  Future<Map<String, dynamic>> fetchDueInvoice(String customerId) async {
    return await _retailerService.getDueOrdersForCustomer(customerId);
  }

  Future<bool> settleDue(String customerId, double amount) async {
    final success = await _retailerService.settleCustomerDue(customerId, amount);
    if (success) refresh();
    return success;
  }

  Future<bool> createOrder(Map<String, dynamic> data) async {
    final success = await _retailerService.createManualOrder(data);
    if (success) refresh();
    return success;
  }

  Future<bool> createSubscription(Map<String, dynamic> data) async {
    final success = await _retailerService.createManualSubscription(data);
    if (success) refresh();
    return success;
  }
}

final customerControllerProvider = NotifierProvider<CustomerController, CustomerState>(() {
  return CustomerController();
});
