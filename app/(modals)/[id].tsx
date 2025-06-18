import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../app/contexts/ThemeContext';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { createThemedStyles } from '../../constants/Styles';
import api from '../../services/api';

type FormFields = {
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
};

export default function Edit() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  const [form, setForm] = useState<FormFields>({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/vehicles/${id}`)
        .then((res) => {
          setForm(res.data);
        })
        .catch(() => {
          Alert.alert('Erro ao carregar dados');
          router.back();
        });
    }
  }, [id, router]);

  function handleChange(key: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      await api.put(`/vehicles/${id}`, form);
      Alert.alert('Sucesso', 'Veículo atualizado');
      router.back();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar');
    }
  }

  const handleDelete = async () => {
    console.log('handleDelete chamado para id:', id);
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
      flexGrow: 1,
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
      gap: 16,
    },
    backButton: {
      padding: 8,
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
      marginBottom: 12,
    },
    button: {
      backgroundColor: styles.text.color,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: styles.container.backgroundColor,
      fontSize: 16,
      fontWeight: '600',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
    },
    placeholderText: {
      color: styles.text.color,
      opacity: 0.5,
    },
  });

  console.log('Tela de edição renderizada');

  return (
    <SafeAreaView style={pageStyles.wrapper} edges={['top']}>
      <ScrollView contentContainerStyle={pageStyles.container}>
        <View style={pageStyles.header}>
          <View style={pageStyles.headerLeft}>
            <TouchableOpacity 
              style={pageStyles.backButton}
              onPress={() => router.back()}
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

        {(Object.keys(form) as (keyof FormFields)[]).map((field) => (
          <TextInput
            key={field}
            placeholder={field.toUpperCase()}
            placeholderTextColor={pageStyles.placeholderText.color}
            style={pageStyles.input}
            value={form[field]}
            onChangeText={(text) => handleChange(field, text)}
          />
        ))}

        <TouchableOpacity style={pageStyles.button} onPress={handleSave}>
          <Text style={pageStyles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[pageStyles.button, pageStyles.deleteButton]}
          onPress={() => {
            console.log('Botão excluir pressionado');
            handleDelete();
          }}
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
            width: 300,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, marginBottom: 16, color: '#333' }}>
              Tem certeza que deseja excluir este veículo?
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity onPress={() => setShowConfirm(false)}>
                <Text style={{ color: '#007bff', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setShowConfirm(false);
                  try {
                    const response = await api.delete(`/vehicles/${id}`);
                    if (response.status === 200 || response.status === 204) {
                      setShowSuccess(true);
                      setTimeout(() => {
                        setShowSuccess(false);
                        router.replace('/');
                      }, 1200);
                    } else {
                      alert('Não foi possível excluir o veículo');
                    }
                  } catch (error) {
                    alert('Não foi possível excluir o veículo');
                  }
                }}
              >
                <Text style={{ color: '#dc3545', fontSize: 16 }}>Excluir</Text>
              </TouchableOpacity>
            </View>
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

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
