import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const Settings = () => {
  const { i18n } = useTranslation();
  const colors = useThemeColors();


  const openBottomSheet = useCallback(() => {

  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // bottomSheetRef.current?.dismiss();
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
        title="Settings"
        leftIcon={<BackButton />}
        style={{ marginBottom: spacingY._10, marginTop: spacingY._15 }}
      />

      <View style={styles.header}>
        <Typo style={styles.title} color={colors.text}>
          Change language
        </Typo>
        <Typo style={styles.subtitle} color={colors.descriptionText}>
          Choose a language for the app
        </Typo>
      </View>

      {/* Language Row */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.neutral300,
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 18,
          marginTop: 10,
          marginBottom: 10,
        }}
        onPress={openBottomSheet}
        activeOpacity={0.7}
      >
        <Typo size={16} color={colors.text}>Language</Typo>
        <Typo size={16} color={colors.text}>{getLanguageLabel(i18n.language)}</Typo>
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});
