import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useThemeColors from '@/hooks/useThemeColors';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

const login = () => {

    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState('');
    const {login: loginUser} = useAuth();

    const isIos = Platform.OS === "ios";

    // colors hook
    const colors = useThemeColors();
    
    const handleSubmit = async () => {
        if(!password || !emailRef.current){
            Alert.alert("Login","Please fill the fields !")
            return;
        }
        setIsLoading(true);
        const res = await loginUser(emailRef.current, password);
        setIsLoading(false);
        if(!res.success){
            Alert.alert("Login : ", res.msg)
        }
    };

  return (
    <ScreenWrapper>
        <View style={styles.container}>

            <BackButton/>

            {/** Top label */}
            <View style={{gap:5, marginTop: spacingY._40}}>
                <Typo size={30} fontWeight={"800"} color={colors.text}>
                    Welcome Back
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo color={colors.text}>
                    Login to your account
                </Typo>


                {/** email adress Input */}
                <Input
                    placeholder='Email'
                    onChangeText={(value) => (emailRef.current = value)}
                    icon={
                        <Icons.At
                            size={verticalScale(26)}
                            color={colors.primary}
                            weight='fill'
                        />
                    }
                />
                
                {isIos && (
                    <Input
                        placeholder='Password'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                            icon={
                                <Icons.Lock
                                    size={verticalScale(26)}
                                    color={colors.primary}
                                    weight='fill'
                                />
                            }
                        />
                )}


                <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo style={styles.submitButton} color={colors.neutral900}>
                        Login
                    </Typo>
                </Button>

                <Pressable>
                    <Typo style={styles.forgetPassword} color={colors.primary} >
                        Forget Password ?
                    </Typo>
                </Pressable>

                <Pressable style={[styles.faceIdContainer,{backgroundColor: colors.faceIdBackground, marginTop:-20}]}>
                    <Icons.ScanSmiley
                        size={verticalScale(32)}
                        color={colors.primary}
                        style={styles.iconFaceId}
                        weight="regular"
                        />
                </Pressable>


            </View>

            {/** footer */}
            <View style={styles.footer}>
                <Typo style={styles.footerText} color={colors.text}>
                    Don't have an account?
                </Typo>
                <Pressable onPress={() => router.push("/(auth)/registerUser")}>
                    <Typo style={styles.underlinedText} color={colors.primary}>
                        Sign up
                    </Typo>
                </Pressable>
            </View>


        </View>
        

    </ScreenWrapper>
  )
}

export default login;

const styles = StyleSheet.create({ 
    container: { 
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingY._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
    },
    form: {
        gap: spacingY._20
    },
    forgetPassword:{
        marginTop:-spacingY._5,
        fontSize: 16,
        textDecorationLine: 'underline',
        alignSelf:"flex-end",
    },
    footer: { 
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        alignItems: "center",
    },
    iconFaceId :{
        justifyContent: "center",
        alignSelf: "center",
    },
    faceIdContainer: {
        borderRadius: spacingY._10,
        padding: spacingY._10,
        alignSelf: "center",
        width:"16%"
    },
    footerText: {
        textAlign:"center",
        fontSize: 16
    },
    underlinedText: {
        textDecorationLine: 'underline',
        fontSize: 16,
        fontWeight: "700"
      },
    submitButton: {
        fontSize: 20,
        fontWeight: "700"
    },
});