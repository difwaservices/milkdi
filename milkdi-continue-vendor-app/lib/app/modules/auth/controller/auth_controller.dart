import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/services/auth_service.dart';

enum AuthStatus { unknown, authenticated, unauthenticated, loading, error }

class AuthState {
  final AuthStatus status;
  final dynamic user;
  final String? error;

  AuthState({required this.status, this.user, this.error});

  factory AuthState.initial() => AuthState(status: AuthStatus.unknown);
  factory AuthState.loading() => AuthState(status: AuthStatus.loading);
  factory AuthState.authenticated(dynamic user) => AuthState(status: AuthStatus.authenticated, user: user);
  factory AuthState.unauthenticated({String? error}) => AuthState(status: AuthStatus.unauthenticated, error: error);
}

class AuthController extends Notifier<AuthState> {
  late AuthService _authService;

  @override
  AuthState build() {
    _authService = ref.watch(authServiceProvider);
    // Auto-check session on build
    Future.microtask(() => checkAuth());
    return AuthState.initial();
  }

  Future<void> checkAuth() async {
    state = AuthState.loading();
    final user = await _authService.getCurrentUser();
    if (user != null) {
      if (user['role'] == 'retailer') {
        state = AuthState.authenticated(user);
      } else {
        await _authService.logout();
        state = AuthState.unauthenticated(error: 'Access denied: Retailer role required');
      }
    } else {
      state = AuthState.unauthenticated();
    }
  }

  Future<void> login(String phone, String password) async {
    state = AuthState.loading();
    try {
      final response = await _authService.login(phone, password);
      if (response['success'] == true) {
        state = AuthState.authenticated(response['user']);
      } else {
        state = AuthState.unauthenticated(error: response['message'] ?? 'Login failed');
      }
    } catch (e) {
      state = AuthState.unauthenticated(error: e.toString());
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    state = AuthState.unauthenticated();
  }
}

final authControllerProvider = NotifierProvider<AuthController, AuthState>(() {
  return AuthController();
});
