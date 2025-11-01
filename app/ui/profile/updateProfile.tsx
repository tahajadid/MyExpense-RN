import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useThemeColors from '@/hooks/useThemeColors';
import { getProfileImage } from '@/services/imageService';
import { updateUser } from '@/services/userService';
import { UserDataType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileModal = () => {

    const {user, updateUserData} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UserDataType>({
        name: "",
        image: null
    });

    const { t, i18n } = useTranslation();

    // colors hook
    const colors = useThemeColors();
    
    useEffect(()=>{
        setUserData({
            name : user?.name || "",
            image : user?.image || null
        })
    },[user]);

    const onPickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.5,
        })

        if(!result.canceled){
            setUserData({...userData, image: result.assets[0]})
        }
        
    }


    const onSubmit = async () => {
        let {name, image} = userData;
        if(!name.trim()){
            Alert.alert(t("update_profile_001"),t("update_profile_002"))
            return;
        }

        setLoading(true);
        const respose = await updateUser(user?.uid as string, userData);
        setLoading(false)

        if(respose.success){
            // data is updated
            updateUserData(user?.uid as string)
            router.back();
        } else {
            Alert.alert(t("update_profile_001"),t("update_profile_003"))
        }
    };

  return (
    <ModalWrapper>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                {/** Form */}
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacingX._20, paddingBottom: 20 }}>

                    {/** Header */}
                    <Header title={t("update_profile_004")}
                        leftIcon={<BackButton/>}
                        style={{ marginBottom: spacingY._10}}/>

                    <View style={styles.avatarContainer}>
                        <Image style={[styles.avatar, {backgroundColor: colors.neutral300, borderColor: colors.neutral500}]}
                            source={getProfileImage(userData.image)}
                            contentFit="cover"
                            transition={100}
                        />

                        <TouchableOpacity onPress={onPickImage} style={[styles.editIcon, {backgroundColor: colors.neutral100, shadowColor: colors.black}]}>
                            <Icons.Pencil
                                size={verticalScale(20)}
                                color={colors.neutral800}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>{t("update_profile_005")}</Typo>
                        <Input
                            placeholder="name"
                            value={userData.name}
                            onChangeText={(value) => {
                                setUserData({...userData, name: value})
                            }}
                        />
                    </View>
                </ScrollView>

                <View style={[styles.footer, { borderTopColor: colors.neutral500}]}>
                    <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                        <Typo color={colors.neutral900} fontWeight={"700"}>{t("update_profile_006")}</Typo>
                    </Button>
                </View>
            
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ModalWrapper>
  )
}

export default ProfileModal;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 16,
    },
    footer: {
        alignItems: "center",
        flexDirection:"row",
        justifyContent:"center",
        paddingHorizontal: spacingX._20,
        gap: scale(20),
        paddingTop: spacingY._15,
        marginBottom: Platform.OS === 'ios' ? spacingY._15 : 0,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
        marginTop: spacingX._20
    },
    avatar: {
        alignSelf: "center",
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1
    },
    editIcon:{
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.25,
        textShadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    inputContainer: {
        gap: spacingY._10,
        marginTop: spacingX._20
    }
})