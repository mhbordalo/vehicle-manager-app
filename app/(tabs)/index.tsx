import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../app/contexts/ThemeContext';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import VehicleCard from '../../components/VehicleCard';
import { createThemedStyles } from '../../constants/Styles';
import api from '../../services/api';
import { Vehicle } from '../../types/vehicle';

export default function Home() {
  const isFocused = useIsFocused();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

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

  const pageStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: styles.container.backgroundColor,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: styles.text.color,
      textAlign: 'left',
    },
    search: {
      backgroundColor: styles.card.backgroundColor,
      color: styles.text.color,
      padding: 10,
      borderRadius: 8,
      marginBottom: 12,
    },
    list: {
      paddingBottom: 24,
    },
  });

  return (
    <SafeAreaView style={pageStyles.container}>
      <View style={pageStyles.headerContainer}>
        <Text style={pageStyles.heading}>Gerenciamento de Veiculos</Text>
        <ThemeToggleButton />
      </View>

      <TextInput
        style={pageStyles.search}
        placeholder="Buscar por marca ou modelo"
        placeholderTextColor={styles.text.color}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        contentContainerStyle={pageStyles.list}
      />
    </SafeAreaView>
  );
}
