import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageService';
import { updateUser } from '@/services/userService';
import { UserDataType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const ProfileModal = () => {

    const {user, updateUserData} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UserDataType>({
        name: "",
        image: null
    });

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
            Alert.alert("User","Please enter the new name")
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
            Alert.alert("User","There is a probleme")
        }
    };

  return (
    <ModalWrapper>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Header title="Update profile information"
                leftIcon={<BackButton/>}
                style={{ marginBottom: spacingY._10 }}/>

                {/** Form */}
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatar}
                            source={getProfileImage(userData.image)}
                            contentFit="cover"
                            transition={100}
                        />

                        <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                            <Icons.Pencil
                                size={verticalScale(20)}
                                color={colors.neutral800}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Name</Typo>
                        <Input
                            placeholder="name"
                            value={userData.name}
                            onChangeText={(value) => {
                                setUserData({...userData, name: value})
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>

        <View style={styles.footer}>
            <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
                <Typo color={colors.black} fontWeight={"700"}>Update information</Typo>
            </Button>
        </View>
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