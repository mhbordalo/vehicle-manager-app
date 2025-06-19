import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { brands } from '../constants/Brands';
import { createThemedStyles } from '../constants/Styles';
import api from '../services/api';
import { useTheme } from './contexts/ThemeContext';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  EditVehicle: { id: string };
};

export default function Register() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  
  const [form, setForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(key: keyof typeof form, value: string) {
    setForm({ ...form, [key]: value });
  }

  function validateAno(ano: string) {
    return /^\d{4}$/.test(ano);
  }

  function validatePlaca(placa: string) {
    // Aceita ABC1D23, ABC1234, ABC-1234 (tudo maiúsculo)
    const regex = /^([A-Z]{3}\d{1}[A-Z]{1}\d{2}|[A-Z]{3}\d{4}|[A-Z]{3}-\d{4})$/;
    return regex.test(placa.toUpperCase());
  }

  async function handleSubmit() {
    let { placa, marca, modelo, ano, cor } = form;
    if (!placa || !marca || !modelo || !ano || !cor) {
      setErrorMsg('Preencha todos os campos!');
      setShowError(true);
      return;
    }
    if (!validatePlaca(placa)) {
      setErrorMsg('Placa inválida! Use: ABC1D23, ABC1234 ou ABC-1234');
      setShowError(true);
      return;
    }
    if (!validateAno(ano)) {
      setErrorMsg('Ano inválido! ex: 2025');
      setShowError(true);
      return;
    }
    // Sempre salvar placa em maiúsculo
    placa = placa.toUpperCase();
    try {
      await api.post('/vehicles', { placa, marca, modelo, ano, cor });
      Alert.alert('Sucesso', 'Veículo cadastrado!');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch {
      Alert.alert('Erro ao cadastrar');
    }
  }

  const pageStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: styles.container.backgroundColor,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: styles.text.color,
    },
    input: {
      backgroundColor: styles.card.backgroundColor,
      color: styles.text.color,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      minHeight: 48,
      justifyContent: 'center',
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: styles.card.backgroundColor,
      padding: 20,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: styles.text.color,
    },
    modalOption: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: styles.card.backgroundColor,
    },
    modalOptionText: {
      fontSize: 16,
      color: styles.text.color,
    },
    cancelText: {
      color: styles.text.color,
      textAlign: 'center',
      marginTop: 16,
      fontSize: 16,
      opacity: 0.7,
    },
    placeholderText: {
      color: styles.text.color,
      opacity: 0.5,
    },
  });

  return (
    <SafeAreaView style={pageStyles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={pageStyles.header}>
          <Text style={pageStyles.heading}>Cadastrar Veículo</Text>
          <ThemeToggleButton />
        </View>

        <TextInput
          style={pageStyles.input}
          placeholder="Placa"
          placeholderTextColor={pageStyles.placeholderText.color}
          value={form.placa}
          onChangeText={(text) => handleChange('placa', text.toUpperCase())}
        />

        <TouchableOpacity
          style={pageStyles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={form.marca ? pageStyles.modalOptionText : pageStyles.placeholderText}>
            {form.marca || 'Selecionar a marca'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={pageStyles.input}
          placeholder="Modelo"
          placeholderTextColor={pageStyles.placeholderText.color}
          value={form.modelo}
          onChangeText={(text) => handleChange('modelo', text)}
        />

        <TextInput
          style={pageStyles.input}
          placeholder="Ano"
          placeholderTextColor={pageStyles.placeholderText.color}
          value={form.ano}
          onChangeText={(text) => handleChange('ano', text)}
          keyboardType="numeric"
        />

        <TextInput
          style={pageStyles.input}
          placeholder="Cor"
          placeholderTextColor={pageStyles.placeholderText.color}
          value={form.cor}
          onChangeText={(text) => handleChange('cor', text)}
        />

        <TouchableOpacity style={pageStyles.button} onPress={handleSubmit}>
          <Text style={pageStyles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={pageStyles.modalOverlay}>
          <View style={pageStyles.modalContent}>
            <Text style={pageStyles.modalTitle}>Escolha a marca</Text>
            {brands.map((b) => (
              <TouchableOpacity
                key={b}
                style={pageStyles.modalOption}
                onPress={() => {
                  handleChange('marca', b);
                  setModalVisible(false);
                }}
              >
                <Text style={pageStyles.modalOptionText}>{b}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={pageStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              {errorMsg || 'Preencha todos os campos!'}
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