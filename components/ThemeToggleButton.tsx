import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../app/contexts/ThemeContext';
import { useThemeColor } from '../hooks/useThemeColor';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const iconColor = useThemeColor({}, 'textPrimary');

  console.log('Tema atual:', theme);
  
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Feather
        name={theme === 'dark' ? 'sun' : 'moon'}
        size={24}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}
