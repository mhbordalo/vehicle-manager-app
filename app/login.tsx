import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { createThemedStyles } from '../constants/Styles';
import { useTheme } from './contexts/ThemeContext';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  EditVehicle: { id: string };
};

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function validateEmail(email: string) {
    // Regex para validação de e-mail
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function handleLogin() {
    if (!email || !senha) {
      setErrorMsg('Preencha todos os campos!');
      setShowError(true);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('E-mail inválido!');
      setShowError(true);
      return;
    }
    navigation.navigate('Main');
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

      {/* Modal de erro customizado */}
      <Modal
        visible={showError}
        transparent
        animationType="fade"
        onRequestClose={() => setShowError(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 12,
            width: 250,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, color: '#333', marginBottom: 16 }}>
              {errorMsg}
            </Text>
            <TouchableOpacity
              onPress={() => setShowError(false)}
              style={{
                backgroundColor: '#007bff',
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
