/// Data model for a dairy listing on the home screen.
class RestaurantModel {
  final String id;
  final String name;
  final String cuisineType; // Used for Milk Type
  final double rating;
  final int reviewCount;
  final String deliveryTime;
  final double distanceKm;
  final String offerText;
  final int offerAbove;
  final int offerAmount;
  final String heroImage;
  final String topDishLabel;
  final bool isFeatured;

  const RestaurantModel({
    required this.id,
    required this.name,
    required this.cuisineType,
    required this.rating,
    required this.reviewCount,
    required this.deliveryTime,
    required this.distanceKm,
    required this.offerText,
    required this.offerAbove,
    required this.offerAmount,
    required this.heroImage,
    required this.topDishLabel,
    this.isFeatured = false,
  });
}

/// Static list of dummy dairy farms.
const List<RestaurantModel> kRestaurants = [
  RestaurantModel(
    id: 'r1',
    name: 'Sunrise Dairy Farm',
    cuisineType: 'Cow · Buffalo Milk',
    rating: 4.8,
    reviewCount: 1200,
    deliveryTime: 'By 6:30 AM',
    distanceKm: 0.8,
    offerText: 'Flat ₹10 OFF above ₹199',
    offerAbove: 199,
    offerAmount: 10,
    heroImage: 'assets/milkimage/milk1.svg',
    topDishLabel: 'Fresh Cow Milk · ₹60/L',
    isFeatured: true,
  ),
  RestaurantModel(
    id: 'r2',
    name: 'Green Valley Dairy',
    cuisineType: 'A2 · Organic Milk',
    rating: 4.6,
    reviewCount: 950,
    deliveryTime: 'By 7:00 AM',
    distanceKm: 1.5,
    offerText: 'Subscribe 7 days, get 1 free',
    offerAbove: 400,
    offerAmount: 60,
    heroImage: 'assets/milkimage/milk1.svg',
    topDishLabel: 'A2 Desi Milk · ₹90/L',
    isFeatured: true,
  ),
  RestaurantModel(
    id: 'r3',
    name: 'Nandini Farms',
    cuisineType: 'Full-Cream · Buffalo',
    rating: 4.9,
    reviewCount: 2100,
    deliveryTime: 'By 6:00 AM',
    distanceKm: 0.5,
    offerText: 'New User: 50% OFF first order',
    offerAbove: 100,
    offerAmount: 50,
    heroImage: 'assets/milkimage/milk1.svg',
    topDishLabel: 'Buffalo Milk · ₹70/L',
  ),
  RestaurantModel(
    id: 'r4',
    name: 'Organic Milk Hub',
    cuisineType: 'Toned · Skimmed',
    rating: 4.2,
    reviewCount: 450,
    deliveryTime: 'By 7:30 AM',
    distanceKm: 2.2,
    offerText: 'Flat ₹15 OFF above ₹299',
    offerAbove: 299,
    offerAmount: 15,
    heroImage: 'assets/milkimage/milk1.svg',
    topDishLabel: 'Toned Milk · ₹50/L',
  ),
  RestaurantModel(
    id: 'r5',
    name: 'Gokul Dairy Farm',
    cuisineType: 'Desi Cow · Goat Milk',
    rating: 4.5,
    reviewCount: 320,
    deliveryTime: 'By 6:45 AM',
    distanceKm: 3.1,
    offerText: 'Free 1L on first subscription',
    offerAbove: 999,
    offerAmount: 60,
    heroImage: 'assets/milkimage/milk1.svg',
    topDishLabel: 'Desi Cow Milk · ₹80/L',
  ),
];

/// Menu items shown when a dairy is tapped.
class RestaurantMenuItem {
  final String name;
  final String weight;
  final double price;
  final String image;
  bool isFavorite;

  RestaurantMenuItem({
    required this.name,
    required this.weight,
    required this.price,
    required this.image,
    this.isFavorite = false,
  });
}

List<RestaurantMenuItem> getMenuForRestaurant(String restaurantId) {
  return [
    RestaurantMenuItem(
      name: 'Full-Cream Cow Milk',
      weight: '1 Litre',
      price: 60,
      image: 'assets/milkimage/milk1.svg',
    ),
    RestaurantMenuItem(
      name: 'Buffalo Milk',
      weight: '1 Litre',
      price: 70,
      image: 'assets/milkbottle/milk_bottle.svg',
    ),
    RestaurantMenuItem(
      name: 'A2 Desi Cow Milk',
      weight: '1 Litre',
      price: 90,
      image: 'assets/milkimage/milk1.svg',
    ),
    RestaurantMenuItem(
      name: 'Toned Milk',
      weight: '500 ml',
      price: 30,
      image: 'assets/milkbottle/milk_bottle.svg',
    ),
    RestaurantMenuItem(
      name: 'Skimmed Milk',
      weight: '500 ml',
      price: 25,
      image: 'assets/milkimage/milk1.svg',
    ),
    RestaurantMenuItem(
      name: 'Goat Milk',
      weight: '1 Litre',
      price: 120,
      image: 'assets/milkbottle/milk_bottle.svg',
    ),
    RestaurantMenuItem(
      name: 'Organic A2 Milk',
      weight: '1 Litre',
      price: 100,
      image: 'assets/milkimage/milk1.svg',
    ),
    RestaurantMenuItem(
      name: 'Flavoured Milk (Chocolate)',
      weight: '200 ml',
      price: 35,
      image: 'assets/milkbottle/milk_bottle.svg',
    ),
  ];
}
