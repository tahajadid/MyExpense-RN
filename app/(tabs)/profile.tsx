import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/constants/ThemeContext';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageService';
import { accountOptionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from "phosphor-react-native";
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const Profile = () => {
    const {user} = useAuth()
    const rouetr = useRouter();
    const { mode, setMode } = useTheme();
    
    const accountOptions: accountOptionType[] = [
        {
            title: "Edit Profile",
            icon: (<Icons.User size={26} color={colors.neutral900} weight="fill"/>),
            routeName:"/(modals)/profileModal",
            bgColor:colors.primary
        },
        {
            title: "Settings Profile",
            icon: (<Icons.GearSix size={26} color={colors.neutral900} weight="fill"/>),
            //routeName:"/(modals)/profileModal",
            bgColor:colors.primary
        },
        {
            title: "Privacy Policy",
            icon: (<Icons.Lock size={26} color={colors.neutral900} weight="fill"/>),
            //routeName:"/(modals)/profileModal",
            bgColor:colors.primary
        },
        {
            title: "Logout",
            icon: (<Icons.Power size={26} color={colors.white} weight="fill"/>),
            //routeName:"/(modals)/profileModal",
            bgColor:"#e11d48"
        }
    ]

    const handleLogout = async () => {
        await signOut(auth);
    };

    const showLogoutAlert = () => {
        Alert.alert("Confirm", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                onPress: ()=> console.log("cancel logout"),
                style: "cancel"
            },
            {
                text: "Logout",
                onPress: () => handleLogout(),
                style: "destructive"
            }
        ])
    }

    const handlePress = (item: accountOptionType) => {
        if(item.title == "Logout"){
            showLogoutAlert()
        }

        if(item.routeName){
            rouetr.push(item.routeName)
        }
    }

    const getSegmentIndex = () => {
        switch (mode) {
            case 'light': return 0;
            case 'dark': return 1;
            case 'system': return 2;
            default: return 2;
        }
    };

    return (
        <ScreenWrapper>
        <View style={styles.container}> 
            {/** Header */}
            <Header title="Profile"
                style={{marginVertical: spacingY._10}}
            />

            {/** User Info */}
            <View style={styles.userInfo}>
                {/** Avatar */}
                <View>
                    <Image 
                        source={getProfileImage(user?.image)}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={100}
                    />
                </View>
                {/** Name & Mail */}
                <View style={styles.nameContainer}>
                    <Typo size={24} fontWeight={"800"} color={colors.neutral200}>
                        {user?.name}
                    </Typo>
                    <Typo size={16} fontWeight={"300"} color={colors.neutral400}>
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
                            FadeInUp.delay(index * 50).springify().damping(14)}
                        style={styles.listItem}>
                            <TouchableOpacity style={styles.flexRow} onPress={()=>handlePress(item)}>
                                {/** icon */}
                                <View style={[
                                    styles.listIcon,
                                    {
                                        backgroundColor: item?.bgColor
                                    }
                                ]}>
                                    {item.icon && item.icon} 
                                </View>
                                <Typo size={16} style={{flex : 1}} fontWeight={"500"}>
                                    {item.title}
                                </Typo>
                                <Icons.CaretRight
                                size={verticalScale(20)}
                                weight="bold"
                                color={colors.white}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    )
                    })
                }
            </View>

            <View style={styles.themeSection}>
                <Typo size={18} fontWeight="600">Theme</Typo>
                <SegmentedControl
                    values={["Light", "Dark", "System"]}
                    selectedIndex={getSegmentIndex()}
                    onChange={(event) => {
                        const index = event.nativeEvent.selectedSegmentIndex;
                        const modes = ['light', 'dark', 'system'] as const;
                        setMode(modes[index]);
                    }}
                    tintColor={colors.primary}
                    backgroundColor={colors.neutral800}
                    appearance='dark'
                    style={styles.segmentStyle}
                />
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
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        overflow: "hidden",
        // position: "relative",
    },
    editIcon: {
        position: "absolute",
        bottom: 5,
        right: 8,
        borderRadius: 50,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    nameContainer: {
        gap: verticalScale(4),
        alignItems: "center",
    },
    listIcon: {
        height: verticalScale(44),
        width: verticalScale(44),
        backgroundColor: colors.neutral500,
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
        backgroundColor: colors.neutral800,
        paddingVertical: spacingY._15,
        paddingHorizontal: spacingX._20,
        borderRadius: radius._10,
    },
    activeThemeButton: {
        backgroundColor: colors.primary,
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
