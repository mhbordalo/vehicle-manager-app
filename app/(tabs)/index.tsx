import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import VehicleCard from '../../components/VehicleCard';
import { useThemeColor } from '../../hooks/useThemeColor';
import api from '../../services/api';
import { Vehicle } from '../../types/vehicle';

export default function Home() {
  const isFocused = useIsFocused();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');

  async function fetchVehicles() {
    try {
      const response = await api.get('/vehicles');
      const ordered = response.data
        .filter((v: Vehicle) => v.id !== undefined)
        .sort((a: Vehicle, b: Vehicle) => (b.id ?? 0) - (a.id ?? 0));
      setVehicles(ordered);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchVehicles();
    }
  }, [isFocused]);

  const filtered = vehicles.filter((v) => {
    const termo = search.toLowerCase();
    return (
      v.marca.toLowerCase().includes(termo) ||
      v.modelo.toLowerCase().includes(termo)
    );
  });
  
  const textPrimary = useThemeColor({}, 'textPrimary');
  const background = useThemeColor({}, 'background');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    search: {
      backgroundColor: '#eaeaea',
      color: '#000',
      padding: 10,
      borderRadius: 8,
      marginBottom: 12,
    },
    list: {
      paddingBottom: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Gerenciamento de Veiculos</Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar por marca ou modelo"
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}
