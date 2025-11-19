import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { spacingX, spacingY } from '@/constants/theme'
import useThemeColors from '@/hooks/useThemeColors'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { I18nManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const welcome = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [expanded, setExpanded] = React.useState(false);

    // colors hook
    const colors = useThemeColors();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        I18nManager.allowRTL(lng === "ar");
        I18nManager.forceRTL(lng === "ar");
        setExpanded(false); // collapse after selection
    };
    const getLanguageLabel = (lng: string) => {
        if (lng === 'fr') return 'Français';
        if (lng === 'en') return 'English';
        return 'Automatic';
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Top bar with language selector (left) and login (right) */}
                <View style={styles.topBar}>
                  {/* Language button with local absolute dropdown */}
                  <View style={{ position: 'relative', flex: 1, alignItems: "flex-start" }}>
                    <TouchableOpacity
                      style={styles.langButton}
                      onPress={() => setExpanded((p) => !p)}
                    >
                      <Icons.Translate
                        size={verticalScale(22)}
                        color={colors.primary}
                        weight="bold"
                      />
                      <Typo style={{ marginStart: 8 }} size={14} color={colors.text}>
                        {getLanguageLabel(i18n.language)}
                      </Typo>
                      {expanded ? (
                        <Icons.CaretUp
                          style = {{marginStart: spacingX._5}}
                          size={verticalScale(18)}
                          color={colors.primary}
                          weight="bold"
                        />
                      ) : (
                        <Icons.CaretDown
                          style = {{marginStart: spacingX._5}}
                          size={verticalScale(18)}
                          color={colors.primary}
                          weight="bold"
                        />
                      )}
                    </TouchableOpacity>
                    {expanded && (
                      <View style={styles.dropdownRelative}> 
                        <TouchableOpacity onPress={() => changeLanguage('fr')} style={styles.dropdownItem}>
                          <Typo size={14} color={colors.text}>Français</Typo>
                        </TouchableOpacity>
                        <View style={styles.separator}/>
                        <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.dropdownItem}>
                          <Typo size={14} color={colors.text}>English</Typo>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={()=> router.push("/(auth)/login")}
                    style={styles.loginButton}>
                    <Typo fontWeight={"700"} color={colors.blueText}>{t("welcome_001")}</Typo>
                  </TouchableOpacity>
                </View>

                
                {/* Main image and rest of content below, never moving */}
                <View>
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
        marginBottom: spacingY._20,
    },
    welcomeImage: {
        width: "80%",
        height: verticalScale(280),
        alignSelf: "center",
        marginTop: verticalScale(0),
        marginRight: spacingX._40,
        marginLeft: spacingX._40
    },
    loginButton: {
        alignSelf: 'auto',
        marginRight: 0,
        paddingVertical: 7, // match langButton height
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
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center', // ensure inside row is centered too
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginTop: 0, // remove top margin
        marginLeft: spacingX._7,
        alignSelf: 'auto',
    },
    dropdown: {
        marginTop: 2,
        borderRadius: 10,
        shadowColor: '#1117',
        shadowOpacity: 0.15,
        elevation: 3,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd44',
        marginHorizontal: 8,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingLeft: spacingX._7,
        paddingRight: spacingX._20,
        marginBottom: spacingY._20,
        marginTop: spacingY._10,
        // backgroundColor: 'pink', // optional debug
    },
    dropdownRelative: {
        position: 'absolute',
        top: '100%',
        left: 0,
        marginStart: spacingY._15,
        zIndex: 20,
        minWidth: 120,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowOpacity: 0.05,
        elevation: 1,
        overflow: 'hidden',
    },
});

export default welcome;
