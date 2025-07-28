import { radius } from '@/constants/theme'
import useThemeColors from '@/hooks/useThemeColors'
import { getFielPath } from '@/services/imageService'
import { ImageUploadProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as Icons from "phosphor-react-native"
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Typo from './Typo'

const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder = "",
}: ImageUploadProps) => {
    // colors hook
    const colors = useThemeColors();
  
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4,3],
            quality: 0.5,
        })

        if(!result.canceled){
            onSelect(result.assets[0]);
        }
    }

  return (
    <View>
        {!file && (
            <TouchableOpacity
                onPress={pickImage}
                 style={[styles.inputContainer, { borderColor: colors.neutral300, backgroundColor: colors.neutral500},containerStyle && containerStyle]}>
                <Icons.UploadSimple color={colors.neutral200} />
                {placeholder && <Typo size={15} color={colors.text}>{placeholder}</Typo>}
            </TouchableOpacity>
        )}

        {
            file && (
                <View style={[styles.image, imageStyle && imageStyle]}>
                    <Image 
                        style={{flex:1}}
                        source={getFielPath(file)}
                        contentFit="cover"
                        transition={100}
                    />
                    <TouchableOpacity style={[styles.deletIcon, { shadowColor: colors.black}]} onPress={onClear}>
                        <Icons.XCircle 
                            size={verticalScale(24)}
                            weight='fill'
                            color={colors.redClose}
                        />
                    </TouchableOpacity>
                    
                </View>
            )
        }
    </View>
  )
}

export default ImageUpload;

const styles = StyleSheet.create({
    inputContainer: {
        height: verticalScale(54),
        borderRadius: radius._15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderStyle: "dashed"
    },
    image : {
        height: scale(150),
        width: scale(150),
        borderRadius: radius._15,
        borderCurve: "continuous",
        overflow:"hidden"
    },
    deletIcon :{
        position:"absolute",
        top: scale(6),
        right: scale(6),
        shadowOffset: { width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 10
    }
});