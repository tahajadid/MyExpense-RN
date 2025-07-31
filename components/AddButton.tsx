import useThemeColors from '@/hooks/useThemeColors';
import { CustomButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import Loading from './Loading';

interface AnimatedButtonProps extends CustomButtonProps {
  animatedWidth?: Animated.AnimatedInterpolation<number>;
}

const AddButton = ({
  style,
  onPress,
  loading = false,
  children,
  animatedWidth,
}: AnimatedButtonProps) => {
  const colors = useThemeColors();

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const containerStyle: StyleProp<ViewStyle> = [
    styles.button,
    style,
    {
      backgroundColor: colors.primary,
      width: animatedWidth ?? verticalScale(120),
    },
  ];

  if (loading) {
    return (
      <Animated.View style={containerStyle}>
        <Loading colorLoader={colors.black} />
      </Animated.View>
    );
  }

  return (
    <AnimatedTouchable onPress={onPress} style={containerStyle}>
      {children}
    </AnimatedTouchable>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: verticalScale(22),
    borderCurve: 'continuous',
    height: verticalScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
