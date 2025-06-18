import { FontAwesome } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useTheme } from '../../app/contexts/ThemeContext';
import Colors from '../../constants/Colors';
import { createThemedStyles } from '../../constants/Styles';

export default function TabsLayout() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[theme].accent,
        tabBarInactiveTintColor: Colors[theme].textSecondary,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'Cadastrar',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Sair',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="sign-out" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace('/login');
          },
        }}
      />
    </Tabs>
  );
}
