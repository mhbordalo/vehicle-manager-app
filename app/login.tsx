import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { createThemedStyles } from '../constants/Styles';
import { useTheme } from './contexts/ThemeContext';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  function handleLogin() {
    if (email && senha) {
      router.replace('/');
    }
  }

  const pageStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: styles.container.backgroundColor,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: styles.text.color,
      textAlign: 'center',
      marginBottom: 32,
    },
    input: {
      backgroundColor: styles.card.backgroundColor,
      color: styles.text.color,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
    },
    button: {
      backgroundColor: styles.text.color,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: styles.container.backgroundColor,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={pageStyles.container}>
      <View style={pageStyles.header}>
        <ThemeToggleButton />
      </View>

      <Text style={pageStyles.title}>Gerenciamento de Veiculos</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={styles.text.color}
        value={email}
        onChangeText={setEmail}
        style={pageStyles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor={styles.text.color}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={pageStyles.input}
      />

      <TouchableOpacity style={pageStyles.button} onPress={handleLogin}>
        <Text style={pageStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
