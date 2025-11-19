import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useThemeColors from '@/hooks/useThemeColors';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

const login = () => {

    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState('');
    const {login: loginUser} = useAuth();
    const {forgotPassword: forgotPassword} = useAuth();
    const { t } = useTranslation();

    const isIos = Platform.OS === "ios";

    // colors hook
    const colors = useThemeColors();
    
    const handleSubmit = async () => {
        if(!password || !emailRef.current){
            Alert.alert(t("auth_login_alert_001"), t("auth_login_alert_002"));
            return;
        }
        setIsLoading(true);
        const res = await loginUser(emailRef.current, password);
        setIsLoading(false);
        if(!res.success){
            Alert.alert(t("auth_login_alert_003"), res.msg)
        }
    };

    const handleForgetPassword = async () =>{
        if(!emailRef.current){
            Alert.alert(t("auth_login_alert_004"), t("auth_login_alert_005"));
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(emailRef.current)){
            Alert.alert(t("auth_login_alert_006"), t("auth_login_alert_007"));
            return;
        }
        
        setIsLoading(true);
        console.log("📧 Initiating forgot password for:", emailRef.current);
        
        const res = await forgotPassword(emailRef.current);
        setIsLoading(false);
        
        if(res.success){
            Alert.alert(
                t("auth_login_alert_008"), 
                res.msg || t("auth_login_alert_009"),
                [{ text: t("auth_login_alert_010") }]
            );
        } else {
            console.error("Forgot password failed:", res.msg);
            Alert.alert(
                t("auth_login_alert_011"), 
                res.msg || t("auth_login_alert_012"),
                [{ text: t("auth_login_alert_013") }]
            );
        }
    }

  return (
    <ScreenWrapper>
        <View style={styles.container}>

            <BackButton/>

            {/** Top label */}
            <View style={{gap:5, marginTop: spacingY._40}}>
                <Typo size={30} fontWeight={"800"} color={colors.text}>
                    {t("auth_login_001")}
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo color={colors.text}>
                    {t("auth_login_002")}
                </Typo>


                {/** email adress Input */}
                <Input
                    placeholder={t("auth_login_003")}
                    onChangeText={(value) => (emailRef.current = value)}
                    icon={
                        <Icons.At
                            size={verticalScale(26)}
                            color={colors.primary}
                            weight='fill'
                        />
                    }
                />
                
                
                {/** password Input */}
                <Input
                    placeholder={t("auth_login_004")}
                    secureTextEntry={true} // 🔒 This hides the input
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

                <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo style={styles.submitButton} color={colors.neutral900}>
                        {t("auth_login_005")}
                    </Typo>
                </Button>

                <Pressable  onPress={() => router.push("/(auth)/forgetPassword")}>
                    <Typo style={styles.forgetPassword} color={colors.primary} >
                        {t("auth_login_006")}
                    </Typo>
                </Pressable>

                { isIos && (
                    <Pressable style={[styles.faceIdContainer,{backgroundColor: colors.faceIdBackground, marginTop:-20}]}>
                        <Icons.ScanSmiley
                            size={verticalScale(32)}
                            color={colors.primary}
                            style={styles.iconFaceId}
                            weight="regular"
                            />
                    </Pressable>
                )}

            </View>

            {/** footer */}
            <View style={styles.footer}>
                <Typo style={styles.footerText} color={colors.text}>
                    {t("auth_login_007")}
                </Typo>
                <Pressable onPress={() => router.push("/(auth)/registerUser")}>
                    <Typo style={styles.underlinedText} color={colors.primary}>
                        {t("auth_login_008")}
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
        paddingHorizontal: spacingY._20,
        marginVertical: spacingY._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
    },
    form: {
        gap: spacingY._20
    },
    forgetPassword:{
        padding:spacingX._5,
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
        fontSize: 18,
        fontWeight: "600"
    },
});