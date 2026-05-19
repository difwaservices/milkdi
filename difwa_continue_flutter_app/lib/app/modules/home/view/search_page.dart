import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../data/models/search_model.dart';
import '../../../data/models/shop_product_model.dart';
import '../../../core/constants/app_colors.dart';
import '../provider/search_provider.dart';
import 'restaurant_menu_page.dart';
import '../widgets/filter_bottom_sheet.dart';

class SearchPage extends ConsumerStatefulWidget {
  const SearchPage({super.key});

  @override
  ConsumerState<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends ConsumerState<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onSearch(String value) {
    if (value.isNotEmpty) {
      ref.read(searchProvider.notifier).search(value);
    }
  }

  @override
  Widget build(BuildContext context) {
    final searchState = ref.watch(searchProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: Container(
          height: 45,
          decoration: BoxDecoration(
            color: const Color(0xFFF2F2F2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            controller: _searchController,
            focusNode: _focusNode,
            onSubmitted: _onSearch,
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              hintText: 'Search for products...',
              hintStyle: const TextStyle(fontSize: 14, color: Colors.grey),
              prefixIcon:
                  Icon(Icons.search, color: AppColors.primary, size: 20),
              suffixIcon: _searchController.text.isNotEmpty || searchState.priceRange != null || searchState.selectedCategoryIds.isNotEmpty || searchState.selectedDeliverySlots.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        _searchController.clear();
                        ref.read(searchProvider.notifier).clear();
                        setState(() {});
                      },
                    )
                  : null,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
            onChanged: (val) {
              setState(() {});
              if (val.trim().length >= 2) {
                ref.read(searchProvider.notifier).search(val.trim());
              } else if (val.isEmpty) {
                ref.read(searchProvider.notifier).clear();
              }
            },
          ),
        ),
      ),
      body: Column(
        children: [
          if (searchState.hasSearched && !searchState.isLoading)
            _buildFilters(searchState),
          Expanded(
            child: _buildBody(searchState),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters(SearchState state) {
    return Container(
      height: 50,
      color: Colors.white,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          _FilterChip(
            label: 'Products',
            isSelected: true,
            count: state.result?.products.length ?? state.paginatedResult?.products.length ?? 0,
            onTap: () {},
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () async {
               final initialResult = state.priceRange != null || state.selectedCategoryIds.isNotEmpty || state.selectedDeliverySlots.isNotEmpty
                  ? FilterResult(
                      priceRange: state.priceRange ?? const RangeValues(10, 2000),
                      selectedCategoryIds: state.selectedCategoryIds,
                      selectedDeliverySlots: state.selectedDeliverySlots,
                    )
                  : null;
               
               final result = await FilterBottomSheet.show(context, initialResult: initialResult);
               if (result != null) {
                  ref.read(searchProvider.notifier).applyAdvancedFilters(
                    priceRange: result.priceRange,
                    selectedCategoryIds: result.selectedCategoryIds,
                    selectedDeliverySlots: result.selectedDeliverySlots,
                  );
               }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.primary),
              ),
              child: const Center(
                child: Row(
                  children: [
                    Icon(Icons.tune, size: 16, color: AppColors.primary),
                    SizedBox(width: 4),
                    Text(
                      'Filters',
                      style: TextStyle(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(SearchState state) {
    if (state.isLoading) {
      return const Center(
          child: CircularProgressIndicator(color: Color(0xFF15803D)));
    }

    if (state.error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text(state.error!, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => _onSearch(_searchController.text),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (!state.hasSearched) {
      return _buildEmptyState(
          'Type something to search...', Icons.search_outlined);
    }

    if (!state.hasResults) {
      return _buildEmptyState('No results found for "${state.query}"',
          Icons.sentiment_dissatisfied);
    }

    final products = state.result?.products ?? [];
    final filteredProducts = state.paginatedResult?.products ?? [];

    if (state.priceRange != null || state.selectedCategoryIds.isNotEmpty || state.selectedDeliverySlots.isNotEmpty) {
       // Filtered view (Product Grid)
       if (filteredProducts.isEmpty) {
          return _buildEmptyState('No products match these filters', Icons.filter_list_off);
       }
       return GridView.builder(
         padding: const EdgeInsets.all(16),
         gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
           crossAxisCount: 2,
           childAspectRatio: 0.72,
           crossAxisSpacing: 16,
           mainAxisSpacing: 16,
         ),
         itemCount: filteredProducts.length,
         itemBuilder: (context, index) => _buildGridProductCard(filteredProducts[index]),
       );
    }

    if (products.isEmpty) {
       return _buildEmptyState('No products found for "${state.query}"', Icons.sentiment_dissatisfied);
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: products.length,
      itemBuilder: (context, index) {
        return _buildProductCard(products[index]);
      },
    );
  }

  Widget _buildGridProductCard(SearchProduct product) {
     return GestureDetector(
       onTap: () {
          final shopModel = ShopModel(id: product.shopId, name: product.shopName);
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => RestaurantMenuPage(shop: shopModel),
            ),
          );
       },
       child: Container(
         decoration: BoxDecoration(
           color: Colors.white,
           borderRadius: BorderRadius.circular(16),
           boxShadow: [
             BoxShadow(
               color: Colors.black.withOpacity(0.04),
               blurRadius: 8,
               offset: const Offset(0, 2),
             ),
           ],
         ),
         child: Column(
           crossAxisAlignment: CrossAxisAlignment.start,
           children: [
             Expanded(
               child: ClipRRect(
                 borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                 child: Stack(
                   children: [
                     Image.network(
                       product.displayImage,
                       width: double.infinity,
                       height: double.infinity,
                       fit: BoxFit.cover,
                       errorBuilder: (_, __, ___) => Container(
                         color: Colors.grey.shade100,
                         child: const Icon(Icons.local_drink_outlined, color: Colors.grey),
                       ),
                     ),
                     if (!product.isShopActive)
                        Container(
                          color: Colors.black.withOpacity(0.3),
                          child: const Center(
                            child: Text('CLOSED', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10)),
                          ),
                        ),
                   ],
                 ),
               ),
             ),
             Padding(
               padding: const EdgeInsets.all(12),
               child: Column(
                 crossAxisAlignment: CrossAxisAlignment.start,
                 children: [
                    Text(
                      product.name,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      product.shopName,
                      style: const TextStyle(color: Colors.grey, fontSize: 11),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '₹${product.price.toStringAsFixed(0)}',
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: Color(0xFF15803D)),
                    ),
                 ],
               ),
             ),
           ],
         ),
       ).animate().fadeIn().scale(duration: 300.ms),
     );
  }

  Widget _buildProductCard(SearchProduct product) {
    return Opacity(
      opacity: product.isShopActive ? 1.0 : 0.8,
      child: ColorFiltered(
        colorFilter: product.isShopActive
            ? const ColorFilter.mode(Colors.transparent, BlendMode.multiply)
            : const ColorFilter.mode(Colors.grey, BlendMode.saturation),
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Stack(
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      product.displayImage,
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        width: 80,
                        height: 80,
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.local_drink_outlined, color: Colors.grey),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          product.name,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 15),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'from ${product.shopName}',
                          style: const TextStyle(
                              color: Color(0xFF15803D),
                              fontSize: 11,
                              fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '₹${product.price.toStringAsFixed(0)}',
                          style: const TextStyle(
                              fontWeight: FontWeight.w900, fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: product.isShopActive
                        ? () {
                            // Navigation to Shop
                            final shopModel = ShopModel(
                                id: product.shopId, name: product.shopName);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    RestaurantMenuPage(shop: shopModel),
                              ),
                            );
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: product.isShopActive
                          ? const Color(0xFF15803D)
                          : Colors.grey,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    child: Text(product.isShopActive ? 'View' : 'Closed',
                        style: const TextStyle(
                            fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              if (!product.isShopActive)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.1),
                    ),
                  ),
                ),
            ],
          ),
        ).animate().fadeIn().slideX(begin: 0.05),
      ),
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(color: Colors.grey.shade500, fontSize: 16),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final int count;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF15803D) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF15803D) : Colors.grey.shade300,
          ),
        ),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  fontSize: 13,
                ),
              ),
              if (count > 0) ...[
                const SizedBox(width: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white.withOpacity(0.2)
                        : Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    count.toString(),
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.grey.shade700,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

