import { useContext } from 'react';
import { ThemeContext } from '../app/contexts/ThemeContext';

export function useColorScheme() {
  const { theme } = useContext(ThemeContext);
  return theme;
}
