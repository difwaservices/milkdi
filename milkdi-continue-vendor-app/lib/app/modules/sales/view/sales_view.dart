import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controller/sales_controller.dart';
import '../../dashboard/widgets/summary_chart.dart';
import '../../../core/constants/app_colors.dart';

class SalesView extends ConsumerWidget {
  const SalesView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(salesControllerProvider);
    final breakdown = (state.stats['earningsBreakdown'] as List?) ?? [];
    // Convert breakdown to chart data (simplified for this view)
    final chartData = breakdown.reversed.map((e) => {
      'name': (e['date'] as String).substring(5, 10), // MM-DD
      'sales': e['net'] ?? 0,
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Revenue Analytics', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: state.isLoading && state.stats.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => ref.read(salesControllerProvider.notifier).refresh(),
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  _buildSummaryHeader(state.stats),
                  const SizedBox(height: 32),
                  const Text('REVENUE TREND', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 16),
                  SummaryChart(data: chartData, isRevenue: true),
                  const SizedBox(height: 32),
                  const Text('REVENUE BREAKDOWN', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 16),
                  _buildStatRow('Total Earnings (Gross)', '₹${state.stats['totalGrossEarnings'] ?? 0}'),
                  _buildStatRow('Commission Share', '- ₹${state.stats['totalCommissionDeducted'] ?? 0}', isRed: true),
                  const Divider(height: 32),
                  _buildStatRow('Net Payout (Lifetime)', '₹${state.stats['totalEarnings'] ?? 0}', isMajor: true),
                  const SizedBox(height: 48),
                  const Text('ORDER VOLUME', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 16),
                  _buildStatRow('Total Orders', '${(state.stats['earningsBreakdown'] as List?)?.length ?? 0}'),
                  _buildStatRow('Available Balance', '₹${state.stats['availableBalance'] ?? 0}'),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryHeader(Map<String, dynamic> stats) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      child: Column(
        children: [
          const Text('TOTAL NET EARNINGS', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),
          Text(
            '₹${stats['totalEarnings'] ?? '0'}',
            style: const TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.w900, letterSpacing: -1),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(12)),
            child: Text(
              '${(stats['earningsBreakdown'] as List?)?.length ?? 0} Completed Orders',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatRow(String label, String value, {bool isRed = false, bool isMajor = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: isMajor ? 18 : 16, fontWeight: isMajor ? FontWeight.w900 : FontWeight.w500, color: Colors.black87)),
          Text(
            value,
            style: TextStyle(
              fontSize: isMajor ? 18 : 16,
              fontWeight: FontWeight.w900,
              color: isRed ? Colors.redAccent : (isMajor ? AppColors.primary : Colors.black),
            ),
          ),
        ],
      ),
    );
  }
}
