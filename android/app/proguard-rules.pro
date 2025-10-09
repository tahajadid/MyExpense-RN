# Keep class names for native modules and React
-keep class com.facebook.react.** { *; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

# Keep necessary classes for React Native
-keep public class com.facebook.react.bridge.** { *; }
-keep public class com.facebook.react.modules.** { *; }
-keep public class com.facebook.react.views.** { *; }

# Keep JNI (native) method names
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep line numbers for crash reports
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable

# Keep required Gson components (if you use Gson)
-keep class com.google.gson.** { *; }
-keepattributes Signature
  
# (OPTIONAL: if you use Expo, Firebase, or other libraries, you may need to add rules for those. Examples below:)

# For Expo (if ejected)
#-keep class expo.modules.** { *; }

# For Firebase (add only if using Firebase)
#-keep class com.google.firebase.** { *; }
#-dontwarn com.google.firebase.**

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Optimize the bytecode
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove debug information
-assumenosideeffects class * {
    android.util.Log.d(...);
    android.util.Log.v(...);
    android.util.Log.i(...);
}

# Optimize Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep Firebase classes (if using Firebase)
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Keep Expo modules
-keep class expo.modules.** { *; }
-keep class com.facebook.react.** { *; }

# Keep React Native modules
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.modules.** { *; }

# Enable shrinking, optimization, and obfuscation for smaller builds
# (These are enabled by default in release builds)

# Remove unused resources and code more aggressively
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# Remove unused strings and resources (handled by R8 automatically)
# -removeunusedstrings
# -removeunusedresources

# Remove debug information and line numbers
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove unused code more aggressively
-dontwarn **
-ignorewarnings
