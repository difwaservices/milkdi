import 'package:flutter/material.dart';
import '../../../widgets/common_card.dart';
import '../../../core/constants/app_images.dart';

class VegetablesPage extends StatelessWidget {
  const VegetablesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> products = [
      {
        'title': 'Full-Cream Cow Milk',
        'price': '₹60.00',
        'subtitle': 'Per litre · Fresh daily',
        'image': AppImages.milk1L,
        'hasCounter': true,
        'isFavorite': false,
        'badgeText': 'HOT',
        'badgeColor': const Color(0xFFFFCDD2),
        'badgeTextColor': const Color(0xFFE53935),
      },
      {
        'title': 'Buffalo Milk',
        'price': '₹70.00',
        'subtitle': 'Per litre · Rich & Creamy',
        'image': AppImages.milkSmall,
        'hasCounter': true,
        'isFavorite': false,
        'badgeText': 'NEW',
        'badgeColor': const Color(0xFFFFECB3),
        'badgeTextColor': const Color(0xFFFF9800),
      },
      {
        'title': 'A2 Desi Cow Milk',
        'price': '₹90.00',
        'subtitle': 'Per litre · Premium',
        'image': AppImages.milkBottle,
        'hasCounter': true,
        'isFavorite': true,
        'badgeText': null,
      },
      {
        'title': 'Toned Milk',
        'price': '₹50.00',
        'subtitle': 'Per litre · Low fat',
        'image': AppImages.milk1L,
        'hasCounter': true,
        'isFavorite': false,
        'badgeText': '-10%',
        'badgeColor': const Color(0xFFFFCDD2),
        'badgeTextColor': const Color(0xFFE53935),
      },
      {
        'title': 'Skimmed Milk',
        'price': '₹45.00',
        'subtitle': 'Per litre · 0% fat',
        'image': AppImages.milkSmall,
        'hasCounter': true,
        'isFavorite': false,
        'badgeText': 'NEW',
        'badgeColor': const Color(0xFFFFECB3),
        'badgeTextColor': const Color(0xFFFF9800),
      },
      {
        'title': 'Goat Milk',
        'price': '₹120.00',
        'subtitle': 'Per litre · Specialty',
        'image': AppImages.milkBottle,
        'hasCounter': false,
        'isFavorite': true,
        'badgeText': null,
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Milk & Dairy',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.72,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
          ),
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return CommonCard(
              title: product['title'],
              price: product['price'],
              subtitle: product['subtitle'],
              image: product['image'],
              hasCounter: product['hasCounter'],
              isFavorite: product['isFavorite'],
              badgeText: product['badgeText'],
              badgeColor: product['badgeColor'],
              badgeTextColor: product['badgeTextColor'],
            );
          },
        ),
      ),
    );
  }
}
