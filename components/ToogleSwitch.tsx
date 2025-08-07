import useThemeColors from '@/hooks/useThemeColors';
import { ToggleSwitchProps } from '@/types';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, value, onValueChange, disabled = false }) => {

    // colors hook
    const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        thumbColor={value ? colors.white: colors.white}
        trackColor={{ false: colors.brightOrange, true: colors.primary }} // iOS green toggle color
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
  },
});

export default ToggleSwitch;
