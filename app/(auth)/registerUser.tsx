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
import { Alert, Pressable, StyleSheet, View } from 'react-native';

const RegisterUser = () => {

    const emailRef = useRef("");
    const profileNameRef = useRef("");
    const passswordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState('');
    const { t } = useTranslation();

    const {register : registerUser} = useAuth();

    // colors hook
    const colors = useThemeColors();

    const handleSubmit = async () => {
        if(!password || !emailRef.current || !profileNameRef.current){
            Alert.alert(t("auth_register_001"), t("auth_register_002"))
            return;
        }
        
        setIsLoading(true);
        console.log("email entered by user:",emailRef.current)
        console.log("Password entered by user:",password)
        
        const response = await registerUser(emailRef.current,password,profileNameRef.current);
        
        //console.log("register result :",response)
        
        setIsLoading(false);


    };

  return (
    <ScreenWrapper>
        <View style={styles.container}>

            <BackButton/>

            {/** Top label */}
            <View style={{gap:5, marginTop: spacingY._20}}>
                <Typo size={30} fontWeight={"800"}  color={colors.text}>
                    {t("auth_register_003")}
                </Typo>
                <Typo size={30} fontWeight={"800"}  color={colors.text}>
                    {t("auth_register_004")}
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo  color={colors.text}>
                    {t("auth_register_005")}
                </Typo>

                {/** profile Input */}
                <Input
                    placeholder={t("auth_register_006")}
                    onChangeText={(value) => (profileNameRef.current = value)}
                    icon={
                        <Icons.User
                            size={verticalScale(26)}
                            color={colors.primary}
                            weight='fill'
                        />
                    }
                />


                {/** email adress Input */}
                <Input
                    placeholder={t("auth_register_007")}
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
                    placeholder={t("auth_register_008")}
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
                        {t("auth_register_009")}
                    </Typo>
                </Button>

            </View>

            {/** footer */}
            <View style={styles.footer}>
                <Typo style={styles.footerText} color={colors.text}>
                    {t("auth_register_010")}
                </Typo>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Typo style={styles.underlinedText} color={colors.primary}>
                        {t("auth_register_011")}
                    </Typo>
                </Pressable>
            </View>
        </View>
    </ScreenWrapper>
  )
};

export default RegisterUser;

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
        fontSize: 14,
        alignSelf:"flex-end",
    },
    footer: { 
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        alignItems: "center",
    },
    footerText: {
        textAlign:"center",
        fontSize: 14
    },
    underlinedText: {
        textDecorationLine: 'underline',
        fontSize: 14,
        fontWeight: "700"
      },
      submitButton: {
        fontSize: 18,
        fontWeight: "600"
    },
});