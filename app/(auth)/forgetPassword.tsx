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
import { Alert, Platform, StyleSheet, View } from 'react-native';

const forgetPassword = () => {

    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {forgotPassword: forgotPassword} = useAuth();

    const isIos = Platform.OS === "ios";

    // colors hook
    const colors = useThemeColors();
    

    const handleForgetPassword = async () =>{
        if(!emailRef.current){
            Alert.alert("Forgot Password","Please enter your email address")
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(emailRef.current)){
            Alert.alert("Invalid Email","Please enter a valid email address")
            return;
        }
        
        setIsLoading(true);
        console.log("📧 Initiating forgot password for:", emailRef.current);
        
        const res = await forgotPassword(emailRef.current);
        setIsLoading(false);
        
        if(res.success){
            Alert.alert(
                "Email Sent", 
                res.msg || "Password reset email has been sent. Please check your inbox and spam folder.",
                [
                    { 
                        text: "OK",
                        onPress: ()=> {router.push("/(auth)/login")}
                    }]
            );
        } else {
            console.error("Forgot password failed:", res.msg);
            Alert.alert(
                "Error", 
                res.msg || "Failed to send password reset email. Please try again.",
                [{ text: "OK" }]
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
                    Reset password
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo color={colors.text}>
                    Enter youe email adress to reset your password
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
                

                <Button loading={isLoading} onPress={handleForgetPassword}>
                    <Typo style={styles.submitButton} color={colors.neutral900}>
                        Send
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