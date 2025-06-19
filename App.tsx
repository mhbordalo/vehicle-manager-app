import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import EditVehicleScreen from './app/EditVehicle';
import HomeScreen from './app/Home';
import RegisterScreen from './app/Register';
import { ThemeProvider, useTheme } from './app/contexts/ThemeContext';
import LoginScreen from './app/login';
import { createThemedStyles } from './constants/Styles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Cadastrar') iconName = 'add-circle';
          if (route.name === 'Logout') iconName = 'log-out-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          ...styles.tabBar,
          height: 58,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Cadastrar" component={RegisterScreen} />
      <Tab.Screen name="Logout" component={() => null} options={{
        tabBarButton: (props: any) => <LogoutTabButton {...props} />,
        tabBarIcon: () => null,
        title: 'Sair',
      }} />
    </Tab.Navigator>
  );
}

function LogoutTabButton(props: any) {
  const navigation = require('@react-navigation/native').useNavigation();
  return (
    <TouchableOpacity
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
      onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
      {...props}
    >
      <Ionicons name="log-out-outline" size={24} color="#dc3545" />
      <Text style={{ fontSize: 12, color: '#dc3545', marginTop: 2 }}>Sair</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 