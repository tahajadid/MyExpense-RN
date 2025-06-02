import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ModalWrapper from '@/components/ModalWrapper';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { getProfileImage } from '@/services/imageService';
import { scale, verticalScale } from '@/utils/styling';
import { Image } from 'expo-image';
import * as Icons from "phosphor-react-native";
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView, View } from 'react-native-reanimated/lib/typescript/Animated';
const ProfileModal = () => {
  return (
    <ModalWrapper>
        {/** Header */}
        <View style={styles.container}>
            <Header 
            title="Update profile information" 
            leftIcon={<BackButton/>}
            style={{ marginBottom: spacingY._10 }}/>
        </View>

        {/** Form */}
        <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.avatarContainer}>
                <Image style={styles.avatar}
                    source={getProfileImage(null)}
                    contentFit="cover"
                    transition={100}
                />

                <TouchableOpacity style={styles.editIcon}>
                    <Icons.Pencil
                        size={verticalScale(20)}
                        color={colors.neutral800}
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>

    </ModalWrapper>
  )
}

export default ProfileModal;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
    },
    footer: {
        alignItems: "center",
        flexDirection:"row",
        justifyContent:"center",
        paddingHorizontal: spacingX._20,
        gap: scale(20),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500
    },
    editIcon:{
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.25,
        textShadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    inputContainer: {
        gap: spacingY._10
    }
})