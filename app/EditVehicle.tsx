import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { createThemedStyles } from '../constants/Styles';
import api from '../services/api';
import { useTheme } from './contexts/ThemeContext';

export default function EditVehicle() {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { id } = route.params || {};
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  const [form, setForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/vehicles/${id}`)
        .then((res) => {
          setForm(res.data);
        })
        .catch(() => {
          Alert.alert('Erro ao carregar dados');
          navigation.goBack();
        });
    }
  }, [id, navigation]);

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateAno(ano: string) {
    return /^\d{4}$/.test(ano);
  }

  function validatePlaca(placa: string) {
    // Aceita ABC1D23, ABC1234, ABC-1234 (tudo maiúsculo)
    const regex = /^([A-Z]{3}\d{1}[A-Z]{1}\d{2}|[A-Z]{3}\d{4}|[A-Z]{3}-\d{4})$/;
    return regex.test(placa.toUpperCase());
  }

  async function handleSave() {
    // Validação obrigatória dos campos
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
      await api.put(`/vehicles/${id}`, { placa, marca, modelo, ano, cor });
      Alert.alert('Sucesso', 'Veículo atualizado');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar');
    }
  }

  const handleDelete = async () => {
    if (!id) {
      Alert.alert('Erro', 'ID do veículo não encontrado');
      return;
    }
    setShowConfirm(true);
  };

  const pageStyles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: styles.container.backgroundColor,
    },
    container: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    backButton: {
      marginRight: 12,
    },
    title: {
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
    deleteButton: {
      backgroundColor: '#dc3545',
      marginTop: 8,
    },
    placeholderText: {
      color: styles.text.color,
      opacity: 0.5,
    },
  });

  return (
    <SafeAreaView style={pageStyles.wrapper} edges={['top']}>
      <ScrollView contentContainerStyle={pageStyles.container}>
        <View style={pageStyles.header}>
          <View style={pageStyles.headerLeft}>
            <TouchableOpacity 
              style={pageStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather 
                name="arrow-left" 
                size={24} 
                color={styles.text.color} 
              />
            </TouchableOpacity>
            <Text style={pageStyles.title}>Editar Veículo</Text>
          </View>
          <ThemeToggleButton />
        </View>

        {(Object.keys(form) as (keyof typeof form)[]).map((field) => (
          <TextInput
            key={field}
            placeholder={field.toUpperCase()}
            placeholderTextColor={pageStyles.placeholderText.color}
            style={pageStyles.input}
            value={form[field]}
            onChangeText={(text) =>
              field === 'placa'
                ? handleChange('placa', text.toUpperCase())
                : handleChange(field, text)
            }
          />
        ))}

        <TouchableOpacity style={pageStyles.button} onPress={handleSave}>
          <Text style={pageStyles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[pageStyles.button, pageStyles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={pageStyles.buttonText}>Excluir Veículo</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de confirmação customizado */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
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
              Deseja mesmo excluir?
            </Text>
            <TouchableOpacity
              onPress={async () => {
                setShowConfirm(false);
                try {
                  const response = await api.delete(`/vehicles/${id}`);
                  if (response.status === 200 || response.status === 204) {
                    setShowSuccess(true);
                    setTimeout(() => {
                      setShowSuccess(false);
                      navigation.goBack();
                    }, 1200);
                  } else {
                    alert('Não foi possível excluir o veículo');
                  }
                } catch (error) {
                  alert('Não foi possível excluir o veículo');
                }
              }}
              style={{
                backgroundColor: '#dc3545',
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowConfirm(false)}
              style={{
                marginTop: 12,
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
                backgroundColor: '#ccc',
              }}
            >
              <Text style={{ color: '#333', fontSize: 16, fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de sucesso customizado */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
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
            <Text style={{ fontSize: 18, color: '#333' }}>
              Veículo removido com sucesso!
            </Text>
          </View>
        </View>
      </Modal>

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