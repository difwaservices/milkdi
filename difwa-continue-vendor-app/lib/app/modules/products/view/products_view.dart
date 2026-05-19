import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../controller/product_controller.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/text_styles.dart';

class ProductsView extends ConsumerWidget {
  const ProductsView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(productControllerProvider);
    final controller = ref.read(productControllerProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Inventory Management', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => controller.refresh(),
          ),
        ],
      ),
      body: state.isLoading && state.products.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : state.products.isEmpty
              ? _buildEmptyState()
              : _buildProductList(context, state, controller, ref),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showProductForm(context, ref),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('ADD PRODUCT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inventory_2_outlined, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('Your inventory is empty', style: TextStyle(color: Colors.grey, fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildProductList(BuildContext context, ProductState state, ProductController controller, WidgetRef ref) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: state.products.length,
      itemBuilder: (context, index) {
        final product = state.products[index];
        return _ProductCard(
          product: product,
          onEdit: () => _showProductForm(context, ref, product: product),
          onDelete: () => _confirmDelete(context, controller, product),
          onToggleStatus: (val) {
             final updated = Map<String, dynamic>.from(product);
             updated['isStockUpdate'] = val; // Backend field logic
             controller.editProduct(product['_id'], updated);
          },
        ).animate().fadeIn(delay: (index * 50).ms).slideX(begin: 0.1);
      },
    );
  }

  void _confirmDelete(BuildContext context, ProductController controller, dynamic product) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Product?'),
        content: Text('Are you sure you want to remove "${product['name']}" from your shop?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('CANCEL')),
          TextButton(
            onPressed: () {
              controller.deleteProduct(product['_id']);
              Navigator.pop(ctx);
            },
            child: const Text('DELETE', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showProductForm(BuildContext context, WidgetRef ref, {dynamic product}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _ProductFormModal(product: product),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final dynamic product;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final Function(bool) onToggleStatus;

  const _ProductCard({
    required this.product,
    required this.onEdit,
    required this.onDelete,
    required this.onToggleStatus,
  });

  @override
  Widget build(BuildContext context) {
    final bool isInStock = product['isStockUpdate'] ?? true;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              image: product['image'] != null && product['image'].toString().isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(product['image']),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: product['image'] == null || product['image'].toString().isEmpty
                ? Icon(Icons.inventory_2, color: AppColors.primary, size: 24)
                : null,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product['name']?.toString().toUpperCase() ?? 'UNKNOWN PRODUCT',
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
                ),
                const SizedBox(height: 4),
                Text(
                   '₹${product['price']} • ${product['weight'] ?? 'N/A'}',
                   style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: isInStock,
            onChanged: onToggleStatus,
            activeColor: AppColors.primary,
          ),
          const SizedBox(width: 8),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, color: Colors.grey),
            onSelected: (val) {
              if (val == 'edit') onEdit();
              if (val == 'delete') onDelete();
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'edit', child: Text('Edit')),
              const PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: Colors.red))),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProductFormModal extends ConsumerStatefulWidget {
  final dynamic product;
  const _ProductFormModal({this.product});

  @override
  ConsumerState<_ProductFormModal> createState() => _ProductFormModalState();
}

class _ProductFormModalState extends ConsumerState<_ProductFormModal> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _priceController;
  late TextEditingController _weightController;
  late TextEditingController _imageController;
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.product?['name']);
    _priceController = TextEditingController(text: widget.product?['price']?.toString());
    _weightController = TextEditingController(text: widget.product?['weight']);
    _imageController = TextEditingController(text: widget.product?['image']);
    _selectedCategory = widget.product?['category']?['_id'];
  }

  @override
  Widget build(BuildContext context) {
    final categories = ref.watch(productControllerProvider).categories;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 32,
        left: 24,
        right: 24,
        top: 32,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.product == null ? 'ADD NEW PRODUCT' : 'EDIT PRODUCT',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.5),
            ),
            const SizedBox(height: 24),
            TextFormField(
              controller: _nameController,
              decoration: _inputDecoration('Product Name', Icons.badge_outlined),
              validator: (v) => v!.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _priceController,
                    decoration: _inputDecoration('Price (₹)', Icons.currency_rupee),
                    keyboardType: TextInputType.number,
                    validator: (v) => v!.isEmpty ? 'Required' : null,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _weightController,
                    decoration: _inputDecoration('Weight (e.g. 500ml)', Icons.monitor_weight_outlined),
                    validator: (v) => v!.isEmpty ? 'Required' : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _imageController,
              decoration: _inputDecoration('Product Image URL', Icons.image_outlined),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: _inputDecoration('Category', Icons.category_outlined),
              items: categories.map((c) => DropdownMenuItem<String>(
                value: c['_id'],
                child: Text(c['name'] ?? 'Uncategorized'),
              )).toList(),
              onChanged: (v) => setState(() => _selectedCategory = v),
              validator: (v) => v == null ? 'Required' : null,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('SAVE PRODUCT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, size: 20),
      filled: true,
      fillColor: Colors.grey.shade50,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
    );
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final data = {
      'name': _nameController.text,
      'price': double.tryParse(_priceController.text) ?? 0.0,
      'weight': _weightController.text,
      'image': _imageController.text,
      'category': _selectedCategory,
    };

    bool success;
    if (widget.product == null) {
      success = await ref.read(productControllerProvider.notifier).addProduct(data);
    } else {
      success = await ref.read(productControllerProvider.notifier).editProduct(widget.product['_id'], data);
    }

    if (success && mounted) {
      Navigator.pop(context);
    }
  }
}
