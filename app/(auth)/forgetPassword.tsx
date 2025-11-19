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
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet, View } from 'react-native';

const forgetPassword = () => {

    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {forgotPassword: forgotPassword} = useAuth();
    const { t } = useTranslation();

    const isIos = Platform.OS === "ios";

    // colors hook
    const colors = useThemeColors();
    

    const handleForgetPassword = async () =>{
        if(!emailRef.current){
            Alert.alert(t("forget_password_001"), t("forget_password_002"))
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(emailRef.current)){
            Alert.alert(t("forget_password_003"), t("forget_password_004"))
            return;
        }
        
        setIsLoading(true);
        console.log("📧 Initiating forgot password for:", emailRef.current);
        
        const res = await forgotPassword(emailRef.current);
        setIsLoading(false);
        
        if(res.success){
            Alert.alert(
                t("forget_password_005"), 
                res.msg || t("forget_password_006"),
                [
                    { 
                        text: t("forget_password_007"),
                        onPress: ()=> {router.push("/(auth)/login")}
                    }]
            );
        } else {
            console.error("Forgot password failed:", res.msg);
            Alert.alert(
                t("forget_password_008"), 
                res.msg || t("forget_password_009"),
                [{ text: t("forget_password_010") }]
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
                    {t("forget_password_011")}
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo color={colors.text}>
                    {t("forget_password_012")}
                </Typo>


                {/** email adress Input */}
                <Input
                    placeholder={t("forget_password_013")}
                    onChangeText={(value) => (emailRef.current = value)}
                    icon={
                        <Icons.At
                            size={verticalScale(26)}
                            color={colors.primary}
                            weight='fill'
                        />
                    }
                />
                

                <Button loading={isLoading} onPress={handleForgetPassword}>
                    <Typo style={styles.submitButton} color={colors.neutral900}>
                        {t("forget_password_014")}
                    </Typo>
                </Button>

            </View>

        </View>
        

    </ScreenWrapper>
  )
}

export default forgetPassword;

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
    submitButton: {
        fontSize: 18,
        fontWeight: "600"
    },
});