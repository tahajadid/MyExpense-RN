import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setExpanded(false); // collapse list after selection
  };

  const getLanguageLabel = (lng: string) => {
    if (lng === 'fr') return 'Français';
    if (lng === 'ar') return 'العربية';
    return 'Automatic';
  };

  return (
    <ScreenWrapper style={{ paddingHorizontal: spacingX._20 }}>
      {/* Header */}
      <Header
        title={t("settings_001")}
        leftIcon={<BackButton />}
        style={{ marginBottom: spacingY._10, marginTop: spacingY._15 }}
      />

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
          style={{
            backgroundColor: colors.neutral800,
            borderRadius: 10,
            marginTop: 6,
            marginBottom: spacingY._10,
            overflow: "hidden",
          }}
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
        style={[styles.languageSection, { backgroundColor: colors.neutral800 }]}
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
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: spacingX._10,
    marginTop: spacingX._15,
  },
});
