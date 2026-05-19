import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:intl/intl.dart';
import '../controller/customer_controller.dart';
import '../../products/controller/product_controller.dart';
import '../../../core/constants/app_colors.dart';

class CustomersView extends ConsumerWidget {
  const CustomersView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(customerControllerProvider);
    final controller = ref.read(customerControllerProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'My Customers',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
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
      body: state.isLoading && state.customers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : state.customers.isEmpty
          ? _buildEmptyState()
          : _buildCustomerList(context, state, ref),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddCustomerForm(context, ref),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.person_add_rounded, color: Colors.white),
        label: const Text(
          'ADD CUSTOMER',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline_rounded,
            size: 80,
            color: Colors.grey.shade300,
          ),
          const SizedBox(height: 16),
          const Text(
            'No customers found',
            style: TextStyle(color: Colors.grey, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomerList(
    BuildContext context,
    CustomerState state,
    WidgetRef ref,
  ) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: state.customers.length,
      itemBuilder: (context, index) {
        final customer = state.customers[index];
        return GestureDetector(
          onTap: () => _showCustomerDetails(context, ref, customer),
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.grey.shade100),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Text(
                    (customer['name']?[0] ?? 'C'),
                    style: TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        customer['name'] ?? 'Guest Customer',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        customer['phone'] ?? 'No phone number',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
                if (customer['totalOrders'] != null)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'Orders',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${customer['totalOrders']}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ).animate().fadeIn(delay: (index * 50).ms).slideX(begin: 0.1),
        );
      },
    );
  }

  void _showCustomerDetails(
    BuildContext context,
    WidgetRef ref,
    dynamic customer,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _CustomerDetailsModal(customer: customer),
    );
  }

  void _showAddCustomerForm(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _AddCustomerModal(),
    );
  }
}

class _AddCustomerModal extends ConsumerWidget {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();

  _AddCustomerModal();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'REGISTER CUSTOMER',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _nameController,
            decoration: _inputDecoration('Customer Name', Icons.person_outline),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _phoneController,
            decoration: _inputDecoration('Phone Number', Icons.phone_outlined),
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _addressController,
            decoration: _inputDecoration(
              'Delivery Address',
              Icons.location_on_outlined,
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: () async {
                final success = await ref
                    .read(customerControllerProvider.notifier)
                    .addCustomer({
                      'name': _nameController.text,
                      'phone': _phoneController.text,
                      'address': _addressController.text,
                    });
                if (success && context.mounted) {
                  Navigator.pop(context);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'SAVE CUSTOMER',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, size: 20),
      filled: true,
      fillColor: Colors.grey.shade50,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
    );
  }
}

class _CustomerDetailsModal extends ConsumerWidget {
  final dynamic customer;

  const _CustomerDetailsModal({required this.customer});

  void _showHistory(BuildContext context, WidgetRef ref) async {
    final history = await ref
        .read(customerControllerProvider.notifier)
        .fetchHistory(customer['id']);
    if (!context.mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _OrderHistoryModal(
        customer: customer,
        history: history['orders'] ?? [],
      ),
    );
  }

  void _showSettleModal(BuildContext context, WidgetRef ref) {
    final controller = TextEditingController(
      text: '${customer['balance'] ?? 0}',
    );
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Settle Balance'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: 'Amount to Settle (₹)',
            prefixText: '₹',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('CANCEL'),
          ),
          ElevatedButton(
            onPressed: () async {
              final amount = double.tryParse(controller.text) ?? 0;
              final ok = await ref
                  .read(customerControllerProvider.notifier)
                  .settleDue(customer['id'], amount);
              if (ok && context.mounted) {
                Navigator.pop(ctx); // Close dialog
                Navigator.pop(ctx); // Close details
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Balance settled!')),
                );
              }
            },
            child: const Text('CONFIRM'),
          ),
        ],
      ),
    );
  }

  void _shareInvoice(BuildContext context, WidgetRef ref) async {
    final invoice = await ref
        .read(customerControllerProvider.notifier)
        .fetchDueInvoice(customer['id']);
    if (invoice.isEmpty || !context.mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) =>
          _InvoiceViewModal(customer: customer, invoiceData: invoice),
    );
  }

  void _showOrderForm(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _ManualOrderModal(customer: customer),
    );
  }

  void _showSubscriptionForm(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _ManualSubscriptionModal(customer: customer),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final balance = double.tryParse('${customer['balance'] ?? 0}') ?? 0;

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: AppColors.primary.withOpacity(0.1),
                child: const Icon(
                  Icons.person,
                  size: 30,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      customer['name'] ?? 'Guest',
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      customer['phone'] ?? 'N/A',
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
              if (customer['status'] != null)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.purple.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    customer['status'],
                    style: TextStyle(
                      color: Colors.purple.shade700,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: _CustomerStatCard(
                  label: 'TOTAL ORDERS',
                  value: '${customer['totalOrders'] ?? 0}',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _CustomerStatCard(
                  label: 'TOTAL SPENT',
                  value: '₹${customer['spend'] ?? 0}',
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: balance > 0 ? Colors.orange.shade50 : Colors.green.shade50,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: balance > 0
                    ? Colors.orange.shade100
                    : Colors.green.shade100,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'DUE BALANCE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey,
                        ),
                      ),
                      Text(
                        '₹$balance',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: balance > 0
                              ? Colors.orange.shade800
                              : Colors.green.shade800,
                        ),
                      ),
                    ],
                  ),
                ),
                if (balance > 0) ...[
                  IconButton(
                    onPressed: () => _showSettleModal(context, ref),
                    icon: const Icon(
                      Icons.payment_rounded,
                      color: Colors.orange,
                    ),
                  ),
                  IconButton(
                    onPressed: () => _shareInvoice(context, ref),
                    icon: const Icon(
                      Icons.description_outlined,
                      color: Colors.orange,
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () => _showHistory(context, ref),
              icon: const Icon(Icons.history_rounded, color: Colors.white),
              label: const Text(
                'VIEW PURCHASE HISTORY',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
          const Spacer(),
          Row(
            children: [
              Expanded(
                child: _ActionButton(
                  onPressed: () => _showOrderForm(context, ref),
                  icon: Icons.add_shopping_cart_rounded,
                  label: 'NEW ORDER',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ActionButton(
                  onPressed: () => _showSubscriptionForm(context, ref),
                  icon: Icons.calendar_today_rounded,
                  label: 'SUBSCRIPTION',
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _CustomerStatCard extends StatelessWidget {
  final String label;
  final String value;
  final Color? color;
  const _CustomerStatCard({
    required this.label,
    required this.value,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: color ?? Colors.black,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final VoidCallback onPressed;
  final IconData icon;
  final String label;
  final Color? color;
  const _ActionButton({
    required this.onPressed,
    required this.icon,
    required this.label,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 20, color: Colors.white),
      label: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? AppColors.primary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}

class _OrderHistoryModal extends StatelessWidget {
  final dynamic customer;
  final List<dynamic> history;
  const _OrderHistoryModal({required this.customer, required this.history});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.7,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            '${customer['name']}\'s History',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: history.isEmpty
                ? const Center(child: Text('No history found'))
                : ListView.builder(
                    itemCount: history.length,
                    itemBuilder: (ctx, idx) {
                      final order = history[idx];
                      return ListTile(
                        title: Text(order['product'] ?? 'No Item'),
                        subtitle: Text(order['date'] ?? ''),
                        trailing: Text(
                          '₹${order['price']}',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _ManualOrderModal extends ConsumerStatefulWidget {
  final dynamic customer;
  const _ManualOrderModal({required this.customer});
  @override
  ConsumerState<_ManualOrderModal> createState() => _ManualOrderModalState();
}

class _ManualOrderModalState extends ConsumerState<_ManualOrderModal> {
  String? selectedProductId;
  int quantity = 1;

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(productControllerProvider).products;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Create Manual Order',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          if (products.isEmpty)
            const Text(
              'No products available. Please add products first.',
              style: TextStyle(color: Colors.red, fontSize: 13),
            )
          else
            DropdownButtonFormField<String>(
              value: products.any((p) => p['id'] == selectedProductId)
                  ? selectedProductId
                  : null,
              hint: const Text('Select Product'),
              items: products
                  .where((p) => p['id'] != null)
                  .map(
                    (p) => DropdownMenuItem<String>(
                      value: p['id'],
                      child: Text(p['name'] ?? 'Unnamed Product'),
                    ),
                  )
                  .toList(),
              onChanged: (v) => setState(() => selectedProductId = v),
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              ),
            ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Quantity'),
              Row(
                children: [
                  IconButton(
                    onPressed: () => setState(
                      () => quantity = (quantity > 1) ? quantity - 1 : 1,
                    ),
                    icon: const Icon(Icons.remove),
                  ),
                  Text('$quantity'),
                  IconButton(
                    onPressed: () => setState(() => quantity++),
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: selectedProductId == null
                  ? null
                  : () async {
                      final success = await ref
                          .read(customerControllerProvider.notifier)
                          .createOrder({
                            'customerId': widget.customer['id'],
                            'productId': selectedProductId,
                            'quantity': quantity,
                          });
                      if (success && context.mounted) {
                        Navigator.pop(context);
                      }
                    },
              child: const Text('PLACE ORDER'),
            ),
          ),
        ],
      ),
    );
  }
}

class _ManualSubscriptionModal extends ConsumerStatefulWidget {
  final dynamic customer;
  const _ManualSubscriptionModal({required this.customer});
  @override
  ConsumerState<_ManualSubscriptionModal> createState() =>
      _ManualSubscriptionModalState();
}

class _ManualSubscriptionModalState
    extends ConsumerState<_ManualSubscriptionModal> {
  String? selectedProductId;
  int quantity = 1;
  String frequency = 'Daily';

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(productControllerProvider).products;

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
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Create Subscription',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          if (products.isEmpty)
            const Text(
              'No products available.',
              style: TextStyle(color: Colors.red),
            )
          else
            DropdownButtonFormField<String>(
              value: products.any((p) => p['id'] == selectedProductId)
                  ? selectedProductId
                  : null,
              hint: const Text('Select Product'),
              items: products
                  .where((p) => p['id'] != null)
                  .map(
                    (p) => DropdownMenuItem<String>(
                      value: p['id'],
                      child: Text(p['name'] ?? 'Unnamed'),
                    ),
                  )
                  .toList(),
              onChanged: (v) => setState(() => selectedProductId = v),
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          const SizedBox(height: 20),
          DropdownButtonFormField<String>(
            value: frequency,
            hint: const Text('Frequency'),
            items: [
              'Daily',
              'Alternate Days',
              'Weekly',
            ].map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
            onChanged: (v) => setState(() => frequency = v!),
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Daily Quantity'),
              Row(
                children: [
                  IconButton(
                    onPressed: () => setState(
                      () => quantity = (quantity > 1) ? quantity - 1 : 1,
                    ),
                    icon: const Icon(Icons.remove),
                  ),
                  Text(
                    '$quantity',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    onPressed: () => setState(() => quantity++),
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: selectedProductId == null
                  ? null
                  : () async {
                      final success = await ref
                          .read(customerControllerProvider.notifier)
                          .createSubscription({
                            'customerId': widget.customer['id'],
                            'productId': selectedProductId,
                            'quantity': quantity,
                            'frequency': frequency,
                            'startDate': DateTime.now().toIso8601String(),
                          });
                      if (success && context.mounted) {
                        Navigator.pop(context);
                      }
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'CREATE SUBSCRIPTION',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InvoiceViewModal extends StatelessWidget {
  final dynamic customer;
  final Map<String, dynamic> invoiceData;

  const _InvoiceViewModal({required this.customer, required this.invoiceData});

  Future<void> _sharePDF(BuildContext context) async {
    // Let's reuse the same generation logic for sharing
    final bytes = await _generatePDFBytes(PdfPageFormat.a4);
    final directory = await getTemporaryDirectory();
    final file = File('${directory.path}/invoice_${customer['name']}.pdf');
    await file.writeAsBytes(bytes);

    await Share.shareXFiles(
      [XFile(file.path)],
      text:
          'Invoice for ${customer['name']} - Total Due: ₹${invoiceData['totalDue']}',
    );
  }

  @override
  Widget build(BuildContext context) {
    final orders = invoiceData['orders'] as List? ?? [];
    final totalDue = invoiceData['totalDue'] ?? 0.0;

    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Due Balance Invoice',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.shade200),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'DIFWA INVOICE',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w900,
                            fontSize: 18,
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'DATE GENERATED',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              DateFormat('dd MMMM yyyy').format(DateTime.now()),
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    const Text(
                      'BILLED TO',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.grey,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      customer['name'] ?? 'Customer',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    Text(
                      customer['phone'] ?? '',
                      style: const TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 32),
                    const Divider(height: 1),
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: orders.length,
                      separatorBuilder: (context, index) =>
                          const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final o = orders[index];
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '#${o['orderId']?.split('-')?.last ?? 'N/A'}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                  Text(
                                    DateFormat(
                                      'dd/MM/yyyy',
                                    ).format(DateTime.parse(o['createdAt'])),
                                    style: const TextStyle(
                                      color: Colors.grey,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                '₹${o['totalAmount']}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'TOTAL OUTSTANDING DUE',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            '₹${totalDue.toStringAsFixed(2)}',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w900,
                              fontSize: 24,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _sharePDF(context),
                    icon: const Icon(Icons.share, color: Colors.white),
                    label: const Text(
                      'SHARE ON WHATSAPP',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Printing.layoutPdf(
                      onLayout: (format) => _generatePDFBytes(format),
                    ),
                    icon: const Icon(Icons.download, color: Colors.white),
                    label: const Text(
                      'DOWNLOAD PDF',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<Uint8List> _generatePDFBytes(PdfPageFormat format) async {
    final doc = pw.Document();
    final orders = invoiceData['orders'] as List? ?? [];
    final retailer = invoiceData['retailer'] ?? {};
    final customerObj = invoiceData['customer'] ?? {};
    final totalDue = invoiceData['totalDue'] ?? 0.0;

    // Fetch a font that supports the Rupee symbol (₹)
    final font = await PdfGoogleFonts.robotoRegular();
    final boldFont = await PdfGoogleFonts.robotoBold();

    doc.addPage(
      pw.Page(
        pageFormat: format,
        theme: pw.ThemeData.withFont(base: font, bold: boldFont),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'DIFWA INVOICE',
                        style: pw.TextStyle(
                          fontSize: 24,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.blue,
                        ),
                      ),
                      pw.Text(
                        retailer['name'] ?? 'Shop Name',
                        style: pw.TextStyle(
                          fontSize: 18,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.Text(retailer['email'] ?? ''),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text(
                        'DATE GENERATED',
                        style: const pw.TextStyle(
                          fontSize: 10,
                          color: PdfColors.grey,
                        ),
                      ),
                      pw.Text(
                        DateFormat('dd MMMM yyyy').format(DateTime.now()),
                        style: pw.TextStyle(fontWeight: pw.FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 30),
              pw.Divider(),
              pw.SizedBox(height: 20),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'BILLED TO',
                        style: const pw.TextStyle(
                          fontSize: 10,
                          color: PdfColors.grey,
                        ),
                      ),
                      pw.Text(
                        customerObj['fullName'] ?? 'Customer',
                        style: pw.TextStyle(
                          fontSize: 14,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.Text(customerObj['phoneNumber'] ?? ''),
                    ],
                  ),
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: pw.BoxDecoration(
                      color: PdfColors.orange100,
                      borderRadius: pw.BorderRadius.circular(5),
                    ),
                    child: pw.Text(
                      'OUTSTANDING BALANCE',
                      style: pw.TextStyle(
                        color: PdfColors.orange900,
                        fontSize: 10,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              pw.SizedBox(height: 30),
              pw.Table(
                border: const pw.TableBorder(
                  bottom: pw.BorderSide(color: PdfColors.grey),
                ),
                children: [
                  pw.TableRow(
                    decoration: const pw.BoxDecoration(
                      color: PdfColors.grey100,
                    ),
                    children: [
                      pw.Padding(
                        padding: const pw.EdgeInsets.all(10),
                        child: pw.Text(
                          'ORDER ID',
                          style: pw.TextStyle(
                            fontWeight: pw.FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      pw.Padding(
                        padding: const pw.EdgeInsets.all(10),
                        child: pw.Text(
                          'DATE',
                          style: pw.TextStyle(
                            fontWeight: pw.FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      pw.Padding(
                        padding: const pw.EdgeInsets.all(10),
                        child: pw.Text(
                          'AMOUNT',
                          textAlign: pw.TextAlign.right,
                          style: pw.TextStyle(
                            fontWeight: pw.FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ],
                  ),
                  ...orders
                      .map(
                        (o) => pw.TableRow(
                          children: [
                            pw.Padding(
                              padding: const pw.EdgeInsets.all(10),
                              child: pw.Text(
                                '#${o['orderId']?.split('-')?.last ?? 'N/A'}',
                                style: const pw.TextStyle(fontSize: 10),
                              ),
                            ),
                            pw.Padding(
                              padding: const pw.EdgeInsets.all(10),
                              child: pw.Text(
                                DateFormat(
                                  'dd/MM/yyyy',
                                ).format(DateTime.parse(o['createdAt'])),
                                style: const pw.TextStyle(fontSize: 10),
                              ),
                            ),
                            pw.Padding(
                              padding: const pw.EdgeInsets.all(10),
                              child: pw.Text(
                                '₹${o['totalAmount']}',
                                textAlign: pw.TextAlign.right,
                                style: pw.TextStyle(
                                  fontWeight: pw.FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                      .toList(),
                ],
              ),
              pw.SizedBox(height: 20),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(
                    'TOTAL DUE',
                    style: pw.TextStyle(
                      fontSize: 16,
                      fontWeight: pw.FontWeight.bold,
                    ),
                  ),
                  pw.Text(
                    '₹${totalDue.toStringAsFixed(2)}',
                    style: pw.TextStyle(
                      fontSize: 20,
                      fontWeight: pw.FontWeight.bold,
                      color: PdfColors.blue,
                    ),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return doc.save();
  }
}
