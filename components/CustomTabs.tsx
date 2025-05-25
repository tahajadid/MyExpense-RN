import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from '@react-navigation/elements';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomTabs({ 
    state,
    descriptors,
    navigation 
} : BottomTabBarProps) {

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label : any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
          key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            <Text style={{ color: isFocused ? colors.primary : colors.white }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
    tabbar : {
        flexDirection: 'row',
        width:"100%",
        height: Platform.OS == "ios" ? verticalScale(73) : verticalScale(55),
        backgroundColor: "space-around",
        alignItems: "center",
        borderTopColor: colors.neutral700,
        borderTopWidth: 1,
    },
    tabbarItem : {
        marginBottom: Platform.OS == "ios" ? spacingY._10 : spacingY._5,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
});