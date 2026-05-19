import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/search_model.dart';
import '../../../data/services/search_service.dart';

// ── State ────────────────────────────────────────────────────────────────────

/// Represents the current state of the search screen.
class SearchState {
  final String query;
  final bool isLoading;
  final SearchResult? result;
  final PaginatedSearchProducts? paginatedResult; // Added for advanced filtering
  final String? error;
  /// Filter: 'all' | 'shops' | 'products'
  final String activeFilter;

  // Advanced Filters
  final RangeValues? priceRange;
  final List<String> selectedCategoryIds;
  final List<String> selectedDeliverySlots;

  const SearchState({
    this.query = '',
    this.isLoading = false,
    this.result,
    this.paginatedResult,
    this.error,
    this.activeFilter = 'all',
    this.priceRange,
    this.selectedCategoryIds = const [],
    this.selectedDeliverySlots = const [],
  });

  SearchState copyWith({
    String? query,
    bool? isLoading,
    SearchResult? result,
    PaginatedSearchProducts? paginatedResult,
    String? error,
    bool clearError = false,
    bool clearResult = false,
    String? activeFilter,
    RangeValues? priceRange,
    List<String>? selectedCategoryIds,
    List<String>? selectedDeliverySlots,
  }) {
    return SearchState(
      query: query ?? this.query,
      isLoading: isLoading ?? this.isLoading,
      result: clearResult ? null : (result ?? this.result),
      paginatedResult: clearResult ? null : (paginatedResult ?? this.paginatedResult),
      error: clearError ? null : (error ?? this.error),
      activeFilter: activeFilter ?? this.activeFilter,
      priceRange: priceRange ?? this.priceRange,
      selectedCategoryIds: selectedCategoryIds ?? this.selectedCategoryIds,
      selectedDeliverySlots: selectedDeliverySlots ?? this.selectedDeliverySlots,
    );
  }

  bool get hasResults => (result != null && !result!.isEmpty) || (paginatedResult != null && paginatedResult!.products.isNotEmpty);
  bool get hasSearched => query.isNotEmpty || priceRange != null || selectedCategoryIds.isNotEmpty || selectedDeliverySlots.isNotEmpty;
}

// ── Notifier ─────────────────────────────────────────────────────────────────

class SearchNotifier extends Notifier<SearchState> {
  @override
  SearchState build() {
    return const SearchState();
  }

  /// Global Search: Shops + Products
  Future<void> search(String query) async {
    if (query.trim().isEmpty && state.priceRange == null && state.selectedCategoryIds.isEmpty && state.selectedDeliverySlots.isEmpty) {
      state = const SearchState();
      return;
    }

    state = state.copyWith(
      query: query,
      isLoading: true,
      clearError: true,
      clearResult: true,
    );

    try {
      final result = await ref.read(searchServiceProvider).search(query);
      state = state.copyWith(
        isLoading: false,
        result: result,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString().replaceFirst('ApiException: ', ''),
      );
    }
  }

  /// Advanced Filtering: Products only
  Future<void> applyAdvancedFilters({
    RangeValues? priceRange,
    List<String>? selectedCategoryIds,
    List<String>? selectedDeliverySlots,
  }) async {
    state = state.copyWith(
      isLoading: true,
      clearError: true,
      clearResult: true,
      priceRange: priceRange,
      selectedCategoryIds: selectedCategoryIds,
      selectedDeliverySlots: selectedDeliverySlots,
      activeFilter: 'products', // Advanced filters only apply to products
    );

    try {
      final result = await ref.read(searchServiceProvider).searchProducts(
        minPrice: priceRange?.start,
        maxPrice: priceRange?.end,
        category: selectedCategoryIds != null && selectedCategoryIds.isNotEmpty 
            ? selectedCategoryIds.join(',') 
            : null,
        deliverySlot: selectedDeliverySlots != null && selectedDeliverySlots.isNotEmpty
            ? selectedDeliverySlots.join(',')
            : null,
        search: state.query.isNotEmpty ? state.query : null,
      );
      
      state = state.copyWith(
        isLoading: false,
        paginatedResult: result,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString().replaceFirst('ApiException: ', ''),
      );
    }
  }

  void setFilter(String filter) {
    state = state.copyWith(activeFilter: filter);
  }

  void clear() {
    state = const SearchState();
  }
}

final searchProvider = NotifierProvider<SearchNotifier, SearchState>(() {
  return SearchNotifier();
});
