import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import ToggleSwitch from '@/components/ToogleSwitch';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const [notificationActive, setNotification] = useState(false);
  const [isFaceIdActive, setFaceId] = useState(false);

  const isIos = Platform.OS === "ios";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    I18nManager.allowRTL(lng === "ar");
    I18nManager.forceRTL(lng === "ar");

    console.log("I18nManager.isRTL "+I18nManager.isRTL )
    setExpanded(false); // collapse list after selection
  };

  const getLanguageLabel = (lng: string) => {
    if (lng === 'fr') return 'Français';
    if (lng === 'ar') return 'العربية';
    return 'Automatic';
  };

  return (
    <ScreenWrapper style={{ paddingHorizontal: spacingX._20, }}>
      {/* Header */}
      <Header
        title={t("settings_001")}
        leftIcon={<BackButton />}
        style={{ marginBottom: spacingY._10, marginTop: spacingY._15 }}
      />

{isIos && (
  <>
    {/* FaceId Label */}
    <Typo
      style={{ marginTop: spacingX._20 }}
      size={16}
      color={colors.descriptionText}
    >
      Activer la connexion avec FaceId
    </Typo>

    {/* FaceId Row */}
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.notificationSection, { backgroundColor: colors.neutral800 }]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icons.ScanSmiley
          size={verticalScale(22)}
          color={colors.primary}
          weight="regular"
        />
        <Typo
          style={{ marginStart: spacingX._7 }}
          size={14}
          color={colors.text}
        >
          FaceId
        </Typo>
      </View>

      {/* Toggle */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ToggleSwitch
          value={isFaceIdActive}
          onValueChange={(value) => {
            setFaceId(value);
          }}
        />
      </View>
    </TouchableOpacity>
  </>
)}


      {/* Language Section */}
      <Typo
        style={{ justifyContent: "flex-end", marginTop: spacingX._20 }}
        size={16}
        color={colors.descriptionText}
      >
        {t("settings_002")}
      </Typo>

      {/* Language Row */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.languageSection, { backgroundColor: colors.neutral800 }]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icons.Translate
            size={verticalScale(20)}
            color={colors.primary}
            weight="regular"
          />
          <Typo
            style={{ marginStart: spacingX._10 }}
            size={14}
            color={colors.text}
          >
            Language
          </Typo>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Typo
            style={{
              justifyContent: "flex-end",
              marginEnd: spacingX._10,
              fontWeight: "bold",
            }}
            size={14}
            color={colors.primary}
          >
            {getLanguageLabel(i18n.language)}
          </Typo>
          {expanded ? (
            <Icons.CaretUp
              size={verticalScale(20)}
              color={colors.primary}
              weight="regular"
            />
          ) : (
            <Icons.CaretDown
              size={verticalScale(20)}
              color={colors.primary}
              weight="regular"
            />
          )}
        </View>
      </TouchableOpacity>

      {/* Language Options Dropdown */}
      {expanded && (
        <View
          style={[
            styles.dropDownContainer, 
            { backgroundColor: colors.neutral800}
          ]}
        >
          <TouchableOpacity
            onPress={() => changeLanguage("fr")}
            style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          >
            <Typo size={14} color={colors.text}>Français</Typo>
          </TouchableOpacity>

        {/* Separator */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.screenBackground,
            marginHorizontal: 12,
          }}
        />
          <TouchableOpacity
            onPress={() => changeLanguage("ar")}
            style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          >
            <Typo size={14} color={colors.text}>العربية</Typo>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications Section */}
      <Typo
        style={{ justifyContent: "flex-end", marginTop: spacingX._20 }}
        size={16}
        color={colors.descriptionText}
      >
        Activer les Notifications
      </Typo>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.notificationSection, { backgroundColor: colors.neutral800 }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icons.Bell
            size={verticalScale(20)}
            color={colors.primary}
            weight="regular"
          />
          <Typo
            style={{ marginStart: spacingX._10 }}
            size={14}
            color={colors.text}
          >
            Notifications
          </Typo>
        </View>
        {/* Automatic Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ToggleSwitch
            value={notificationActive}
            onValueChange={(value) => {
              setNotification(value)
              }
            }
          />
        </View>
      </TouchableOpacity>

    </ScreenWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  languageSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: spacingX._10,
    paddingVertical: spacingX._15,
    paddingHorizontal: spacingX._15,
    marginBottom: spacingX._10,
    marginTop: spacingX._15,
  },
  dropDownContainer:{
    borderRadius: 10,
    marginBottom: spacingY._10,
    overflow: "hidden",
  },
  notificationSection: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: spacingX._10,
    paddingVertical: spacingX._3,
    paddingHorizontal: spacingX._15,
    marginBottom: spacingX._10,
    marginTop: spacingX._15,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  }
});
