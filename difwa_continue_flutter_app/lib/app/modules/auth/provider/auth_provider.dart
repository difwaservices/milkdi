import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/state/auth_store.dart' as core;

// Re-export the new sealed state types so UI logic (is AuthAuthenticated, etc.) works.
export '../../../../core/state/auth_store.dart' show 
  AuthState, 
  AuthInitial, 
  AuthLoading, 
  AuthAuthenticated, 
  AuthUnauthenticated, 
  AuthOtpSent,
  AuthError,
  AuthSuccess;

// ── UNIFIED AUTH ARCHITECTURE BRIDGE ──
// This file maintains compatibility with existing UI imports while
// redirecting all logic and state to the single source of truth in core.

typedef ProviderAuthState = core.AuthState;

/// Alias for the unified source of truth.
final authProvider = core.authStoreProvider;

/// Unified providers re-exposed for convenience.
final authServiceProvider = core.authServiceProvider;
final secureStorageProvider = core.secureStorageProvider;
final currentUserProvider = core.currentUserProvider;
