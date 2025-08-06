import { radius } from '@/constants/theme'
import useThemeColors from '@/hooks/useThemeColors'
import { CustomButtonProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Loading from './Loading'

const DeleteButton = ({
    style,
    onPress,
    loading=false,
    children
}: CustomButtonProps) => {

    // colors hook
    const colors = useThemeColors();

    if(loading){
        return(
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading colorLoader={colors.black}/>
            </View>
        )
    }
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style, {backgroundColor: colors.rose}]}>
            {children}
        </TouchableOpacity>
    )
}

export default DeleteButton;

const styles = StyleSheet.create({
    button:{
        borderRadius: radius._17,
        borderCurve: "continuous",
        height: verticalScale(52),
        justifyContent:"center",
        alignItems:"center"
    }
})