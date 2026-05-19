import 'package:flutter/material.dart';
import '../../../data/models/auth_models.dart';
import '../../../data/repository/auth_repository.dart';

class AuthController extends ChangeNotifier {
  final AuthRepository _authRepository = AuthRepository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Future<AuthResponseModel> sendOtp({required String phoneNumber}) async {
    _setLoading(true);
    final response = await _authRepository.sendOtp(phoneNumber: phoneNumber);
    _setLoading(false);
    return response;
  }

  Future<AuthResponseModel> verifyOtp({
    required String phoneNumber,
    required String otp,
  }) async {
    _setLoading(true);
    final response = await _authRepository.verifyOtp(
      phoneNumber: phoneNumber,
      otp: otp,
    );
    _setLoading(false);
    return response;
  }

  Future<void> logout() async {
    await _authRepository.logout();
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
