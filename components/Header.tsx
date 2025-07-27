import useThemeColors from '@/hooks/useThemeColors';
import { HeaderProps } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

const Header = ({
    title = "",
    leftIcon,
    style
}: HeaderProps) => {
    // colors hook
    const colors = useThemeColors();
    
  return (
    <View style={[styles.container, style]}>
        {leftIcon && <View style={styles.leftIconStyle}>{leftIcon}</View>}
        { title &&
            <Typo
                size={22}
                fontWeight={"600"}
                style={{
                    textAlign:"center",
                    width: leftIcon ? "82%" : "100%",
                }}
                color={colors.primary}
            >
                {title}
            </Typo>
        }
    </View>
  )
};

export default Header;

const styles = StyleSheet.create({
    container: { 
        width: "100%",
        alignItems: "center",
        flexDirection: "row"
    },
    leftIconStyle: {
        alignSelf : "flex-start"
    }
    
});