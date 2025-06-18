import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

    // Para web, usar window.confirm
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Tem certeza que deseja excluir este veículo?');
      if (!confirmed) return;
      try {
        console.log('Confirmado excluir para id:', id);
        const response = await api.delete(`/vehicles/${id}`);
        console.log('Resposta do servidor:', response.status, response.data);

        if (response.status === 200 || response.status === 204) {
          alert('Veículo removido com sucesso');
          router.replace('/');
        } else {
          alert('Não foi possível excluir o veículo');
        }
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Não foi possível excluir o veículo');
      }
      return;
    }

    // Para mobile, segue o fluxo normal
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este veículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            console.log('Confirmado excluir para id:', id);
            try {
              const response = await api.delete(`/vehicles/${id}`);
              console.log('Resposta do servidor:', response.status, response.data);

              if (response.status === 200 || response.status === 204) {
                Alert.alert('Sucesso', 'Veículo removido com sucesso', [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/'),
                  },
                ]);
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o veículo');
              }
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível excluir o veículo');
            }
          },
        },
      ]
    );
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

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
