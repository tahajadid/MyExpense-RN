import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { spacingX, spacingY } from '@/constants/theme'
import useThemeColors from '@/hooks/useThemeColors'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const welcome = () => {
    const router = useRouter();

    // colors hook
    const colors = useThemeColors();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* login image & btn */}
                <View>
                    <TouchableOpacity onPress={()=> router.push("/(auth)/login")} style={styles.loginButton}>
                        <Typo fontWeight={"700"}  color={colors.blueText}> Sign in</Typo>
                    </TouchableOpacity>

                    <Animated.Image
                        entering={FadeIn.duration(1500)} 
                        source={require('../../assets/images/onboardingTwo.png')}
                        style={styles.welcomeImage}
                        resizeMode="contain"
                    />
                </View>

                {/* footer */}
                <View style={[styles.footer, {backgroundColor: colors.neutral800}]}>
                    <Animated.View 
                    entering={FadeInDown.duration(1000).springify().damping(12)}
                    style={{ alignItems: "center" }}>
                        <Typo size={28} fontWeight={"800"} color={colors.text}>
                            Prenez toujours le controle
                        </Typo>
                        <Typo size={28} fontWeight={"800"} color={colors.text}>
                            de vos depenses
                        </Typo>
                    </Animated.View>

                    <Animated.View 
                    entering={FadeInDown.duration(1000).delay(100).springify().damping(12)}
                    style={{alignItems: "center" , gap: 2}}>
                        <Typo size={17} color={colors.text}>
                            Finance must be arranged
                        </Typo>
                    </Animated.View>

                    <Animated.View 
                    entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}
                    style={styles.buttomContainer}>
                        <Button onPress={()=> router.push("/(auth)/registerUser")}>
                            <Typo size={22} fontWeight={"700"} color={colors.neutral800}>Start</Typo>
                        </Button>
                    </Animated.View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({ 
    container: { 
        flex: 1,
        justifyContent: "space-between",
        paddingTop: spacingY._7,
    },
    welcomeImage: {
        width: "80%",
        height: verticalScale(280),
        alignSelf: "center",
        marginTop: verticalScale(100),
        marginRight: spacingX._40,
        marginLeft: spacingX._40
    },
        loginButton: {
        alignSelf: "flex-end",
        marginRight: spacingX._20,
        },
    footer: { 
        alignItems: "center",
        paddingTop: verticalScale (30),
        paddingBottom: verticalScale(45),
        gap: spacingY._20,
        shadowColor: "white",
        shadowOffset: { width: 0, height: -1},
        elevation: 100,
        shadowRadius: 5,
        shadowOpacity: 0.35,
    },
    buttomContainer:{
        width: "100%",
        paddingHorizontal: spacingX._20
    }
});

export default welcome;
