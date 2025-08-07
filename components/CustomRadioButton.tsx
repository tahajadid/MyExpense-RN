import useThemeColors from '@/hooks/useThemeColors';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type RadioButtonProps = {
  selected?: boolean;
  onPress: () => void;
  label?: string;
  size?: number;
  color?: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const CustomRadioButton: React.FC<RadioButtonProps> = ({
  selected = false,
  onPress,
  label,
  size = 24,
  color = '#D63384',
  labelStyle = {},
  containerStyle = {},
  disabled = false,
}) => {
  // colors hook
  const colors = useThemeColors();

  color = colors.primary

  const radioSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const innerSize = {
    width: size * 0.4,
    height: size * 0.4,
    borderRadius: (size * 0.4) / 2,
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.radioButton,
          radioSize,
          { borderColor: selected ? colors.primary : colors.neutral600 },
          disabled && styles.disabled,
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioButtonInner,
              innerSize,
              { backgroundColor: disabled ?  colors.screenBackground  : colors.primary },
            ]}
          />
        )}
      </View>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: disabled ?  colors.screenBackground :  colors.screenBackground },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

type RadioButtonOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type RadioButtonGroupProps = {
  options: RadioButtonOption[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  color?: string;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  optionContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  horizontal?: boolean;
};

const CustomRadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options = [],
  selectedValue,
  onValueChange,
  color = '#D63384',
  size = 24,
  containerStyle = {},
  optionContainerStyle = {},
  labelStyle = {},
  disabled = false,
  horizontal = false,
}) => {
  return (
    <View
      style={[
        styles.groupContainer,
        horizontal && styles.horizontalGroup,
        containerStyle,
      ]}
    >
      {options.map((option, index) => (
        <CustomRadioButton
          key={option.value}
          selected={selectedValue === option.value}
          onPress={() => onValueChange(option.value)}
          label={option.label}
          size={size}
          color={color}
          labelStyle={labelStyle}
          containerStyle={[
            horizontal && index > 0 && styles.horizontalSpacing,
            optionContainerStyle,
          ]}
          disabled={disabled || option.disabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0, // ✅ no extra spacing
  },
  radioButton: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    backgroundColor: '#D63384',
  },
  label: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333333',
  },
  disabled: {
    opacity: 0.5,
  },
  groupContainer: {
    paddingVertical: 8,
  },
  horizontalGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horizontalSpacing: {
    marginLeft: 20,
  },
});

export default CustomRadioButton;
export { CustomRadioButtonGroup };
