// hooks/useThemeColors.ts
import { useTheme } from '@/constants/ThemeContext';
import { darkTheme, lightTheme } from '@/constants/theme';

export default function useThemeColors() {
  const { theme } = useTheme();
  return theme === 'dark' ? darkTheme : lightTheme;
}