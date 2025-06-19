import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import ThemeToggleButton from '../components/ThemeToggleButton';
import VehicleCard from '../components/VehicleCard';
import Colors from '../constants/Colors';
import { createThemedStyles } from '../constants/Styles';
import api from '../services/api';
import { Vehicle } from '../types/vehicle';
import { useTheme } from './contexts/ThemeContext';

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const navigation = useNavigation();
  const dividerColor = Colors[theme].card;

  async function fetchVehicles() {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchVehicles();
    }
  }, [isFocused]);

  function normalize(text: string) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  const filtered = vehicles.filter((vehicle) => {
    const termo = normalize(search);
    return (
      normalize(vehicle.marca).includes(termo) ||
      normalize(vehicle.modelo).includes(termo) ||
      normalize(vehicle.placa).includes(termo) ||
      normalize(vehicle.cor).includes(termo) ||
      normalize(vehicle.ano).includes(termo)
    );
  });

  const pageStyles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: styles.container.backgroundColor,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: styles.text.color,
    },
    search: {
      backgroundColor: styles.card.backgroundColor,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      color: styles.text.color,
      marginHorizontal: 16,
    },
    divider: {
      borderBottomColor: dividerColor,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: 2,
      marginHorizontal: 0,
    },
    list: {
      padding: 16,
    },
  });

  return (
    <SafeAreaView style={pageStyles.wrapper}>
      <View style={pageStyles.header}>
        <Text style={pageStyles.title}>
          Gerenciamento de Veiculos
        </Text>
        <ThemeToggleButton />
      </View>

      <TextInput
        placeholder="Buscar veículo..."
        placeholderTextColor="#888"
        style={pageStyles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={pageStyles.divider} />

      <View style={pageStyles.container}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <VehicleCard
              vehicle={item}
              onPress={() => navigation.navigate('EditVehicle', { id: item.id })}
            />
          )}
          contentContainerStyle={pageStyles.list}
        />
      </View>
    </SafeAreaView>
  );
} 