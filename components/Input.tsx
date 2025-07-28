import { radius, spacingX } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import { InputProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const Input = (props: InputProps) => {
    // colors hook
    const colors = useThemeColors();
    return (
      <View style={[styles.container,{ borderColor: colors.neutral300 }, props.containerStyle && props.containerStyle ]} >

          {props.icon && props.icon}

        <TextInput
          style={[styles.input , props.inputStyle, {color: colors.text}]} 
          placeholderTextColor={colors.neutral400}
          ref={props.inputRef && props.inputRef}
          {...props}
        />
        
      </View>
    )
}

export default Input;

const styles = StyleSheet.create({
    container : {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        gap: spacingX._10,
    },
    input : {
        flex: 1,
        fontSize: verticalScale(14),
    }

});