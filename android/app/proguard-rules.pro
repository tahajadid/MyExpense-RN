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

# Remove loggers in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep annotations (important for some libraries)
-keepattributes *Annotation*

# General optimization
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose

# (OPTIONAL: If you have native libraries or dynamically loaded code, more rules may be needed)