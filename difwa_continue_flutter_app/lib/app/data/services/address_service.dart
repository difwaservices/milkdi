import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';

class AddressService {
  final ApiClient _client;

  AddressService(this._client);

  Future<dynamic> saveAddress({
    required String fullName,
    required String email,
    required String label,
    required String fullAddress,
    required String city,
    required String state,
    required String pincode,
    required bool isDefault,
  }) async {
    return await _client.post(
      '${ApiClient.baseUrl}/address',
      data: {
        "fullName": fullName,
        "email": email,
        "label": label,
        "fullAddress": fullAddress,
        "city": city,
        "state": state,
        "pincode": pincode,
        "isDefault": isDefault,
      },
      requiresAuth: true,
    );
  }

  Future<dynamic> getAddresses() async {
    return await _client.get(
      '${ApiClient.baseUrl}/address',
      requiresAuth: true,
    );
  }

  Future<dynamic> deleteAddress(String id) async {
    return await _client.delete(
      '${ApiClient.baseUrl}/address/$id',
      requiresAuth: true,
    );
  }
}

final addressServiceProvider = Provider<AddressService>((ref) {
  return AddressService(ref.watch(apiClientProvider));
});
