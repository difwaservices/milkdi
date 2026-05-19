import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/retailer_service.dart';

class ProductState {
  final bool isLoading;
  final List<dynamic> products;
  final List<dynamic> categories;
  final String? error;

  ProductState({
    this.isLoading = false,
    this.products = const [],
    this.categories = const [],
    this.error,
  });

  ProductState copyWith({
    bool? isLoading,
    List<dynamic>? products,
    List<dynamic>? categories,
    String? error,
  }) {
    return ProductState(
      isLoading: isLoading ?? this.isLoading,
      products: products ?? this.products,
      categories: categories ?? this.categories,
      error: error ?? this.error,
    );
  }
}

class ProductController extends Notifier<ProductState> {
  late RetailerService _retailerService;

  @override
  ProductState build() {
    _retailerService = ref.watch(retailerServiceProvider);
    Future.microtask(() => refresh());
    return ProductState();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final products = await _retailerService.getProducts();
      final categories = await _retailerService.getCategories();
      state = state.copyWith(
        isLoading: false,
        products: products,
        categories: categories,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> addProduct(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true);
    final success = await _retailerService.createProduct(data);
    if (success) {
      await refresh();
    } else {
      state = state.copyWith(isLoading: false);
    }
    return success;
  }

  Future<bool> editProduct(String id, Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true);
    final success = await _retailerService.updateProduct(id, data);
    if (success) {
      await refresh();
    } else {
      state = state.copyWith(isLoading: false);
    }
    return success;
  }

  Future<bool> deleteProduct(String id) async {
    state = state.copyWith(isLoading: true);
    final success = await _retailerService.deleteProduct(id);
    if (success) {
      await refresh();
    } else {
      state = state.copyWith(isLoading: false);
    }
    return success;
  }
}

final productControllerProvider = NotifierProvider<ProductController, ProductState>(() {
  return ProductController();
});
