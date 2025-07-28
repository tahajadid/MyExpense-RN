import { spacingY } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import { HeaderProps } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

const TabHeader = ({
    title = "",
    style
}: HeaderProps) => {
    // colors hook
    const colors = useThemeColors();
    
  return (
    <View style={[styles.container, style]}>
        <Typo
            size={24}
            fontWeight={"700"}
            style={{
                textAlign:"center",
            }}
            color={colors.text}
        >
            {title}
        </Typo>
    </View>
  )
};

export default TabHeader;

const styles = StyleSheet.create({
    container: { 
        width: "100%",
        marginTop: spacingY._5,
        marginBottom: spacingY._15,
        alignItems:"flex-start",
        flexDirection: "row"
    },
    leftIconStyle: {
        alignSelf : "flex-start"
    }
    
});