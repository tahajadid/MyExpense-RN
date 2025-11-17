import { spacingY } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Icons from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabs({ 
    state,
    descriptors,
    navigation 
} : BottomTabBarProps) {

    // colors hook
    const colors = useThemeColors();
    
    // Get safe area insets to handle Android system navigation bar
    const insets = useSafeAreaInsets();

    const tabbarIcons: any = {
        index: (isFocused: Boolean) => (
            <Icons.HouseSimple 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.white : colors.neutral400}
            />
        ),
        statistics: (isFocused: Boolean) => (
            <Icons.ChartBar 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.white : colors.neutral400}
            />
        ),
        wallet: (isFocused: Boolean) => (
            <Icons.CardsThree 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.white : colors.neutral400}
            />
        ),
        profile: (isFocused: Boolean) => (
            <Icons.UserCircle
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.white : colors.neutral400}
            />
        )
    } 
  return (
        <View style={[
            styles.tabbarWrapper, 
            {backgroundColor: colors.screenBackground},
            Platform.OS === 'android' && { paddingBottom: insets.bottom }
        ]}>
            <View style={[styles.tabbar, {backgroundColor: colors.tabBarBackground}]}>
                {state.routes
                    .filter(route => Object.keys(tabbarIcons).includes(route.name))
                    .map((route, index) => {
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
                            style={
                                [styles.tabbarItem,
                                {backgroundColor: colors.tabBarBackground, borderTopColor: colors.neutral900,}
                                ]}>
                            {
                                tabbarIcons[route.name] &&  tabbarIcons[route.name](isFocused)
                            }
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabbarWrapper: {
        width: '100%',
    },
    tabbar: {
        flexDirection: 'row',
        width: "100%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: Platform.OS == "ios" ? verticalScale(85) : verticalScale(60),
        alignItems: "center",
        overflow: 'hidden',
    },
    tabbarItem: {
        marginBottom: Platform.OS == "ios" ? spacingY._20 : spacingY._5,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
});