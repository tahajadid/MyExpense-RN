import BackButton from '@/components/BackButton';
import { CustomRadioButtonGroup } from '@/components/CustomRadioButton';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import useThemeColors from '@/hooks/useThemeColors';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const Settings = () => {

    const darkImage =  require('./../../../assets/images/mock_up_dark.png')
    const lightImage =  require('./../../../assets/images/mock_up_light.png')
    const sunMoonImage =  require('./../../../assets/images/sun_moon.png')

    const [selectedTheme, setSelectedTheme] = useState("light");
    const [current, setCurrent] = useState<string | number>('one');
    
    // colors hook
    const colors = useThemeColors();
    
      
    return (
        <ScreenWrapper style={{paddingHorizontal: spacingX._20}}>
            {/* Header */}
            <Header title="Theme"
              leftIcon={<BackButton/>}
              style={{ marginBottom: spacingY._10, marginTop: spacingY._15 }}/>

            <View style={styles.header}>
                <Image source={sunMoonImage} style={styles.sunImage} />
                <Typo style={styles.title} color={colors.text}>Light Mode / Dark Mode</Typo>
                <Typo style={styles.subtitle} color={colors.descriptionText}>
                    Choose a theme to optimize your visual comfort
                </Typo>
            </View>

            {/* Theme Options */}
            <View style={styles.themesContainer}>
                {/* Light Mode */}
                <View style={styles.themeOption}>
                  <TouchableOpacity onPress={() => {
                      setCurrent("light")
                      }}>
                      <Image source={lightImage} style={styles.phoneImage} />
                  </TouchableOpacity>
                </View>

                {/* Dark Mode */}
                <View style={styles.themeOption}>
                    <TouchableOpacity onPress={() => {
                        setCurrent("dark")
                        }}>
                        <Image source={darkImage} style={styles.phoneImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <CustomRadioButtonGroup
              containerStyle={styles.radioButtonContainer}
              optionContainerStyle={styles.radioButtonOption} // ✅ add this
              options={[
                { label: '', value: 'light' },
                { label: '', value: 'dark' },
              ]}
              selectedValue={current}
              onValueChange={(value) => setCurrent(value)}
            />
            {/* Automatic Toggle */}
            <View style={styles.automaticContainer}>
                <Typo style={styles.automaticText}>Automatic</Typo>

            </View>
        </ScreenWrapper>
    )
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sunContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    marginRight: 8,
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
  themesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  themeOption: {
    alignItems: 'center',
  },
  sunImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  phoneImage: {
    width: 120,
    height: 240,
    borderRadius: 25,
    resizeMode: 'contain',
  },  
  radioContainer: {
    padding: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D63384',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonOption: {
    paddingVertical: 0, // ✅ override default padding in CustomRadioButton
    marginTop: -8,       // ✅ optional fine-tuning
  },
  radioButtonSelected: {
    backgroundColor: '#D63384',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  automaticContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  automaticText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#D63384',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
});
