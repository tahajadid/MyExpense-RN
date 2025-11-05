import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/constants/ThemeContext';
import { useAuth } from '@/contexts/authContext';
import useThemeColors from '@/hooks/useThemeColors';
import "@/i18n";
import { getProfileImage } from '@/services/imageService';
import { accountOptionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from "phosphor-react-native";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const Profile = () => {
    const {user} = useAuth()
    const router = useRouter();
    const { mode, setMode } = useTheme();
    const { t, i18n } = useTranslation();

    
    // colors hook
    const colors = useThemeColors();

    const accountOptions: accountOptionType[] = [
        {
            title: t("profile_001"),
            icon: (<Icons.User size={26} color={colors.white} weight="fill"/>),
            routeName:"./../ui/profile/updateProfile",
            bgColor:colors.primary
        },
        {
            title: t("profile_002"),
            icon: (<Icons.GearSix size={26} color={colors.white} weight="fill"/>),
            routeName:"./../ui/profile/settings",
            bgColor:colors.primary
        },
        {
            title: t("profile_003"),
            icon: (<Icons.Sun size={26} color={colors.white} weight="fill"/>),
            routeName:"./../ui/profile/themeSettings",
            bgColor:colors.primary
        },
        {
            title: t("profile_004"),
            icon: (<Icons.Power size={26} color={colors.white} weight="fill"/>),
            //routeName:"/(modals)/profileModal",
            bgColor:"#e11d48"
        }
    ]

    const handleLogout = async () => {
        await signOut(auth);
    };

    const showLogoutAlert = () => {
        Alert.alert(t("profile_005"), t("profile_006"), [
            {
                text: t("profile_007"),
                onPress: ()=> console.log("cancel logout"),
                style: "cancel"
            },
            {
                text: t("profile_008"),
                onPress: () => handleLogout(),
                style: "destructive"
            }
        ])
    }

    const handlePress = (item: accountOptionType) => {
        if(item.title == t("profile_008")){
            showLogoutAlert()
        } else if(item.title == t("profile_002")){
            router.push('./../ui/profile/settings');
        }else {
            router.push(item.routeName)
        }
    }


    return (
        <ScreenWrapper>
            <View style={styles.container}> 

                {/** User Info */}
                <View style={styles.userInfo}>
                    {/** Avatar */}
                    <View>
                        <Image 
                            source={getProfileImage(user?.image)}
                            style={[styles.avatar, { backgroundColor: colors.neutral300}]}
                            contentFit="cover"
                            transition={100}
                        />
                    </View>
                    {/** Name & Mail */}
                    <View style={styles.nameContainer}>
                        <Typo size={24} fontWeight={"800"} color={colors.neutral200}>
                            {user?.name}
                        </Typo>
                        <Typo size={16} fontWeight={"300"} color={colors.text}>
                            {user?.email }
                        </Typo>
                    </View>

                </View>


                {/** Account options */}
                <View style={styles.accountOptions}>
                    {accountOptions.map((item, index) => {
                        return(
                            <Animated.View
                            key={index.toString()}
                            entering={
                                FadeInUp.delay(index * 20).springify().damping(20).stiffness(200)}
                            style={styles.listItem}>
                                <TouchableOpacity style={styles.flexRow} onPress={()=>handlePress(item)}>
                                    {/** icon */}
                                    <View style={[
                                        styles.listIcon,
                                        {
                                            backgroundColor: item?.bgColor,
                                        }
                                    ]}>
                                        {item.icon && item.icon} 
                                    </View>
                                    <Typo size={16} style={{flex : 1}} fontWeight={"500"} color={colors.text}>
                                        {item.title}
                                    </Typo>
                                    <Icons.CaretRight
                                    size={verticalScale(20)}
                                    weight="bold"
                                    color={colors.primary}
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        )
                        })
                    }
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    userInfo: {
        marginTop: verticalScale(30),
        alignItems: "center",
        gap: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },
    avatar: {
        alignSelf: "center",
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        overflow: "hidden",
        // position: "relative",
    },
    nameContainer: {
        gap: verticalScale(4),
        alignItems: "center",
    },
    listIcon: {
        height: verticalScale(44),
        width: verticalScale(44),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius._15,
        borderCurve: "continuous",
    },
    listItem: {
        marginBottom:verticalScale(17),
    },
    accountOptions: {
        marginTop: spacingY._35,
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
    },
    themeSection: {
        marginTop: spacingY._20,
        gap: spacingY._10,
    },
    segmentStyle: {
        marginTop: spacingY._10,
    },
    themeButton: {
        paddingVertical: spacingY._15,
        paddingHorizontal: spacingX._20,
        borderRadius: radius._10,
    },
    themeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._10,
    },
    themeButtons: {
        flexDirection: 'row',
        gap: spacingX._10,
    },
});
