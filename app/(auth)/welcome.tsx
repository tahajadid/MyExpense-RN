import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { spacingX, spacingY } from '@/constants/theme'
import useThemeColors from '@/hooks/useThemeColors'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const welcome = () => {
    const { t } = useTranslation();
    const router = useRouter();

    // colors hook
    const colors = useThemeColors();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* login image & btn */}
                <View>
                    <TouchableOpacity onPress={()=> router.push("/(auth)/login")} style={styles.loginButton}>
                        <Typo fontWeight={"700"}  color={colors.blueText}>{t("welcome_001")}</Typo>
                    </TouchableOpacity>

                    <Animated.Image
                        entering={FadeIn.duration(1500)} 
                        source={require('../../assets/images/welcome_icon.png')}
                        style={styles.welcomeImage}
                        resizeMode="contain"
                    />
                </View>

                {/* footer */}
                <View style={[styles.footer, {backgroundColor: colors.neutral800}]}>
                    <Animated.View 
                    entering={FadeInDown.duration(500).springify().damping(40)}
                    style={{ alignItems: "center" }}>
                        <Typo size={28} fontWeight={"800"} color={colors.text}>
                            {t("welcome_002")}
                        </Typo>
                        <Typo size={28} fontWeight={"800"} color={colors.text}>
                            {t("welcome_003")}
                        </Typo>
                    </Animated.View>

                    <Animated.View 
                    entering={FadeInDown.duration(500).delay(100).springify().damping(40)}
                    style={{alignItems: "center" , gap: 2}}>
                        <Typo size={17} color={colors.text}>
                            {t("welcome_004")}
                        </Typo>
                    </Animated.View>

                    <Animated.View 
                    entering={FadeInDown.duration(500).delay(200).springify().damping(40)}
                    style={styles.buttomContainer}>
                        <Button onPress={()=> router.push("/(auth)/registerUser")}> 
                            <Typo size={22} fontWeight={"700"} color={colors.neutral800}>{t("welcome_005")}</Typo>
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
        marginVertical: spacingY._20
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
        paddingHorizontal: spacingX._20,
    }
});

export default welcome;
