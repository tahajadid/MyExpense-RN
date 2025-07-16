import { colors, darkTheme, lightTheme } from '@/constants/theme';
import { ScreenWrapperProps } from '@/types';
import React from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

const {height} = Dimensions.get("window");

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {

    // check for phone dark/light mode
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    let paddingTop = Platform.OS == "ios" ? height * 0.06 : 30;

    return (
        <View style={[
            {
                paddingTop,
                flex : 1,
                backgroundColor : theme.screenBackground,
            },
            style,
        ]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.neutral900}/>
            {children}
        </View>
    )
}

export default ScreenWrapper

const styles = StyleSheet.create({})