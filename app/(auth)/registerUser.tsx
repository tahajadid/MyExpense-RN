import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

const RegisterUser = () => {

    const emailRef = useRef("");
    const profileNameRef = useRef("");
    const passswordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if(!password || !emailRef.current || !profileNameRef.current){
            Alert.alert("Register","Please fill the fields !")
            return;
        }
        
        /*
        setIsLoading(true);
        const response = await registerUser(emailRef.current,password,profileNameRef.current);
        setIsLoading(false);
        console.log("register result :",response)

        */
    };

  return (
    <ScreenWrapper>
        <View style={styles.container}>

            <BackButton/>

            {/** Top label */}
            <View style={{gap:5, marginTop: spacingY._20}}>
                <Typo size={30} fontWeight={"800"}>
                    Create,
                </Typo>
                <Typo size={30} fontWeight={"800"}>
                    Your Profile
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo>
                    Create an account track every expense
                </Typo>

                {/** profile Input */}
                <Input
                    placeholder='Enter your profile id'
                    onChangeText={(value) => (profileNameRef.current = value)}
                    icon={
                        <Icons.User
                            size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill'
                        />
                    }
                />


                {/** email adress Input */}
                <Input
                    placeholder='Enter your email'
                    onChangeText={(value) => (emailRef.current = value)}
                    icon={
                        <Icons.At
                            size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill'
                        />
                    }
                />

                {/** password Input */}
                <Input
                    placeholder='Enter your password'
                    secureTextEntry={true} // 🔒 This hides the input
                    value={password}
                    onChangeText={setPassword}
                    icon={
                        <Icons.Lock
                            size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill'
                        />
                    }
                />

                <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo style={styles.submitButton}>
                        Sign Up
                    </Typo>
                </Button>

            </View>

            {/** footer */}
            <View style={styles.footer}>
                <Typo style={styles.footerText}>
                    Already have an account?
                </Typo>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Typo style={styles.underlinedText}>
                        Login
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
        paddingHorizontal: spacingY._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    forgetPassword:{
        fontSize: 14,
        color: colors.text,
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
        color: colors.text,
        fontSize: 14
    },
    underlinedText: {
        textDecorationLine: 'underline',
        fontSize: 14,
        color: colors.primary,
        fontWeight: "700"
      },
    submitButton: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "700"
    },
});