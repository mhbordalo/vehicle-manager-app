import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { brands } from '../../constants/Brands';
import { useThemeColor } from '../../hooks/useThemeColor';
import api from '../../services/api';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const textPrimary = useThemeColor({}, 'textPrimary');
  const background = useThemeColor({}, 'background');

  function handleChange(key: keyof typeof form, value: string) {
    setForm({ ...form, [key]: value });
  }

  async function handleSubmit() {
    const { placa, marca, modelo, ano, cor } = form;
    if (!placa || !marca || !modelo || !ano || !cor) {
      return Alert.alert('Preencha todos os campos!');
    }

    try {
      await api.post('/vehicles', form);
      Alert.alert('Sucesso', 'Veículo cadastrado!');
      router.replace('/');
    } catch {
      Alert.alert('Erro ao cadastrar');
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      padding: 20,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: textPrimary,
      marginBottom: 20,
    },
    input: {
      backgroundColor: '#eaeaea',
      color: '#000',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      minHeight: 48,
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: '#333',
    },
    modalOption: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    modalOptionText: {
      fontSize: 16,
      color: '#333',
    },
    cancelText: {
      color: '#007bff',
      textAlign: 'center',
      marginTop: 16,
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.heading}>Cadastrar Veículo</Text>

        <TextInput
          style={styles.input}
          placeholder="Placa"
          placeholderTextColor="#777"
          value={form.placa}
          onChangeText={(text) => handleChange('placa', text)}
        />

        {/* Campo customizado */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: form.marca ? '#000' : '#777' }}>
            {form.marca || 'Selecionar a marca'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Modelo"
          placeholderTextColor="#777"
          value={form.modelo}
          onChangeText={(text) => handleChange('modelo', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Ano"
          placeholderTextColor="#777"
          value={form.ano}
          onChangeText={(text) => handleChange('ano', text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Cor"
          placeholderTextColor="#777"
          value={form.cor}
          onChangeText={(text) => handleChange('cor', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de seleção */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha a marca</Text>
            {brands.map((b) => (
              <TouchableOpacity
                key={b}
                style={styles.modalOption}
                onPress={() => {
                  handleChange('marca', b);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{b}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}
