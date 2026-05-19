-keep class com.it_nomads.fluttersecurestorage.** { *; }

# Prevent R8 from crashing on Google Auth Credentials missing references in smart_auth
-dontwarn com.google.android.gms.auth.api.credentials.**
-keep class com.google.android.gms.auth.api.credentials.** { *; }
