import { Slot } from 'expo-router';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../app/contexts/ThemeContext';
import { createThemedStyles } from '../constants/Styles';

function RootLayoutNav() {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
