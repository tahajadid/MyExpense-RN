import { colors, radius } from '@/constants/theme';
import { BackButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const BackButton = ({
    style,
    iconSize = 30,
}: BackButtonProps) => {
    const router = useRouter();
  return (
    <TouchableOpacity onPress={() => {router.back()}} 
        style={[style, styles.button]}>
        <CaretLeft
            size={verticalScale(iconSize)}
            color={colors.white}
            weight='bold'
        />
    </TouchableOpacity>
  )
}

export default BackButton;

const styles = StyleSheet.create({
    button:{
        backgroundColor: colors.neutral600,
        alignSelf:"flex-start",
        borderRadius: radius._12,
        borderCurve: "continuous",
        padding: 5,
    }
})