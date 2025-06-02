import { colors, spacingY } from '@/constants/theme';
import { ModalWrapperProps } from '@/types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const isIos = Platform.OS == "ios";
const ModalWrapper = ({
    style,
    children,
    bg = colors.neutral800
}: ModalWrapperProps) => {
  return (
    <View style={[style && style, styles.container, {backgroundColor: bg} ]}>
        {children}
    </View>
  )
}

export default ModalWrapper;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: isIos? spacingY._15 : 50,
        paddingBottom: isIos? spacingY._20 : spacingY._10,
    }
});