import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Settings = () => {

    return (
        <ScreenWrapper>
        <View style={styles.container}> 
            {/** Header */}
            <Header title="Setings"
                style={{marginVertical: spacingY._10}}
            />

        </View>
        </ScreenWrapper>
    )
}

export default Settings;

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
