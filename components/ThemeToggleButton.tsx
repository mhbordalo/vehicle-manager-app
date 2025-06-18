import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../app/contexts/ThemeContext';
import { createThemedStyles } from '../constants/Styles';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const styles = createThemedStyles(theme);

  const buttonStyles = StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: styles.card.backgroundColor,
    },
    icon: {
      color: styles.text.color,
    }
  });
  
  return (
    <TouchableOpacity 
      style={buttonStyles.button}
      onPress={toggleTheme}
    >
      <Feather
        name={theme === 'dark' ? 'sun' : 'moon'}
        size={24}
        color={buttonStyles.icon.color}
      />
    </TouchableOpacity>
  );
}
