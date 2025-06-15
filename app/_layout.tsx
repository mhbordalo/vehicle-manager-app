import { Slot } from 'expo-router';
import { ThemeProvider } from '../app/contexts/ThemeContext';

export default function RootLayout() {
  return(
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
