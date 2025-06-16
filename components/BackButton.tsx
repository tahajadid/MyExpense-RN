import { colors, radius } from '@/constants/theme';
import { BackButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const BackButton = ({
    style,
    iconSize = 30,
}: BackButtonProps) => {
    const router = useRouter();
    const scaledSize = verticalScale(iconSize);
    
    const IconComponent = () => (
        <CaretLeft
            size={scaledSize}
            color={colors.white}
        />
    );
    
    return (
        <TouchableOpacity onPress={() => {router.back()}} 
            style={[style, styles.button]}>
            <View>
                <IconComponent />
            </View>
        </TouchableOpacity>
    )
};

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