import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Icons from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomTabs({ 
    state,
    descriptors,
    navigation 
} : BottomTabBarProps) {

    const tabbarIcons: any = {
        index: (isFocused: Boolean) => (
            <Icons.House 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.primary : colors.neutral400}
            />
        ),
        statistics: (isFocused: Boolean) => (
            <Icons.ChartBar 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.primary : colors.neutral400}
            />
        ),
        wallet: (isFocused: Boolean) => (
            <Icons.Wallet 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.primary : colors.neutral400}
            />
        ),
        profile: (isFocused: Boolean) => (
            <Icons.User 
            size={verticalScale(30)}
            weight={isFocused? "fill" : "regular"}
            color={isFocused? colors.primary : colors.neutral400}
            />
        )
    } 
  return (
        <View style={styles.tabbarWrapper}>
            <View style={styles.tabbar}>
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
                            style={styles.tabbarItem}
                        >
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
        backgroundColor: colors.neutral900,
        width: '100%',
    },
    tabbar: {
        flexDirection: 'row',
        width: "100%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: Platform.OS == "ios" ? verticalScale(80) : verticalScale(60),
        backgroundColor: colors.neutral500,
        alignItems: "center",
        overflow: 'hidden',
    },
    tabbarItem: {
        marginBottom: Platform.OS == "ios" ? spacingY._15 : spacingY._5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.neutral500,
        borderTopColor: colors.neutral900,
        flex: 1
    }
});