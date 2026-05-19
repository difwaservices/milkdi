import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/product_service.dart';
import '../../../data/models/food_models.dart';

class FilterResult {
  final RangeValues priceRange;
  final List<String> selectedCategoryIds;
  final List<String> selectedDeliverySlots;

  FilterResult({
    required this.priceRange,
    required this.selectedCategoryIds,
    required this.selectedDeliverySlots,
  });
}

class FilterBottomSheet extends ConsumerStatefulWidget {
  final FilterResult? initialResult;

  const FilterBottomSheet({super.key, this.initialResult});

  static Future<FilterResult?> show(BuildContext context, {FilterResult? initialResult}) {
    return showModalBottomSheet<FilterResult>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FilterBottomSheet(initialResult: initialResult),
    );
  }

  @override
  ConsumerState<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends ConsumerState<FilterBottomSheet> {
  // State variables for filters
  late RangeValues _priceRange;
  final List<String> _selectedCategoryIds = [];
  final List<String> _selectedDeliverySlots = [];
  List<FoodCategory> _categories = [];
  bool _isLoadingCategories = true;

  final List<String> _defaultDeliverySlots = [
    '8-9 AM',
    '9-10 AM',
    '10-11 AM',
    '11 AM-12 PM',
    '4-5 PM',
    '5-6 PM',
    '6-7 PM'
  ];

  final Color _primaryColor = const Color(0xFF15803D);
  final Color _bgColor = const Color(0xFFF8F9FA);

  @override
  void initState() {
    super.initState();
    _priceRange = widget.initialResult?.priceRange ?? const RangeValues(10, 2000);
    _selectedCategoryIds.addAll(widget.initialResult?.selectedCategoryIds ?? []);
    _selectedDeliverySlots.addAll(widget.initialResult?.selectedDeliverySlots ?? []);
    _fetchCategories();
  }

  Future<void> _fetchCategories() async {
    try {
      final cats = await ref.read(productServiceProvider).getCategories();
      if (mounted) {
        setState(() {
          _categories = cats;
          _isLoadingCategories = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingCategories = false);
      }
    }
  }

  void _resetFilters() {
    setState(() {
      _priceRange = const RangeValues(10, 2000);
      _selectedCategoryIds.clear();
      _selectedDeliverySlots.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85, // Increased height for more content
      decoration: BoxDecoration(
        color: _bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            height: 4,
            width: 40,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                  splashRadius: 24,
                ),
                const Expanded(
                  child: Text(
                    'Filters',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: _resetFilters,
                  child: Text(
                    'Reset',
                    style: TextStyle(
                      color: _primaryColor,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          const Divider(height: 1),

          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              children: [
                // Price Range
                _buildCard([
                  _buildSectionTitle('Price Range'),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('₹${_priceRange.start.round()}', style: _labelStyle),
                      Text('₹${_priceRange.end.round()}', style: _labelStyle),
                    ],
                  ),
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: _primaryColor,
                      inactiveTrackColor: Colors.grey.shade200,
                      thumbColor: Colors.white,
                      overlayColor: _primaryColor.withValues(alpha: 0.1),
                      trackHeight: 6,
                      rangeThumbShape: const RoundRangeSliderThumbShape(
                          elevation: 3, pressedElevation: 6),
                    ),
                    child: RangeSlider(
                      values: _priceRange,
                      min: 0,
                      max: 2000,
                      divisions: 100,
                      onChanged: (RangeValues values) {
                        setState(() {
                          _priceRange = values;
                        });
                      },
                    ),
                  ),
                ]),
                const SizedBox(height: 16),

                // Delivery Slots
                _buildCard([
                  _buildSectionTitle('Delivery Slots'),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _defaultDeliverySlots.map((slot) {
                      final isSelected = _selectedDeliverySlots.contains(slot);
                      return FilterChip(
                        label: Text(slot),
                        selected: isSelected,
                        onSelected: (selected) {
                          setState(() {
                            if (selected) {
                              _selectedDeliverySlots.add(slot);
                            } else {
                              _selectedDeliverySlots.remove(slot);
                            }
                          });
                        },
                        backgroundColor: Colors.white,
                        selectedColor: _primaryColor.withValues(alpha: 0.2),
                        checkmarkColor: _primaryColor,
                        labelStyle: TextStyle(
                          color: isSelected ? _primaryColor : Colors.black87,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: isSelected ? _primaryColor : Colors.grey.shade300,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ]),
                const SizedBox(height: 16),

                // Categories
                _buildCard([
                   _buildSectionTitle('Categories'),
                   const SizedBox(height: 12),
                   if (_isLoadingCategories)
                      const Center(child: CircularProgressIndicator())
                   else if (_categories.isEmpty)
                      const Text('No categories available')
                   else
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _categories.map((cat) {
                          final isSelected = _selectedCategoryIds.contains(cat.id);
                          return FilterChip(
                            label: Text(cat.name),
                            selected: isSelected,
                            onSelected: (selected) {
                               setState(() {
                                 if (selected) {
                                   _selectedCategoryIds.add(cat.id);
                                 } else {
                                   _selectedCategoryIds.remove(cat.id);
                                 }
                               });
                            },
                            backgroundColor: Colors.white,
                            selectedColor: _primaryColor.withValues(alpha: 0.2),
                            checkmarkColor: _primaryColor,
                            labelStyle: TextStyle(
                              color: isSelected ? _primaryColor : Colors.black87,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: isSelected ? _primaryColor : Colors.grey.shade300,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                ]),
                const SizedBox(height: 24),
              ],
            ),
          ),

          // Bottom Sticky CTA
          Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: ElevatedButton(
              onPressed: () {
                final result = FilterResult(
                  priceRange: _priceRange,
                  selectedCategoryIds: _selectedCategoryIds,
                  selectedDeliverySlots: _selectedDeliverySlots,
                );
                Navigator.pop(context, result);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: _primaryColor,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Apply Filters',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard(List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: Color(0xFF1A1A1A),
      ),
    );
  }

  TextStyle get _labelStyle => const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: Colors.black87,
      );
}



