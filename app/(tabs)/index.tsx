import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../app/contexts/ThemeContext';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import VehicleCard from '../../components/VehicleCard';
import { createThemedStyles } from '../../constants/Styles';
import api from '../../services/api';
import { Vehicle } from '../../types/vehicle';

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const router = useRouter();

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

  const filtered = vehicles.filter(
    (vehicle) =>
      vehicle.marca.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(search.toLowerCase())
  );

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
    list: {
      padding: 16,
    },
  });

  return (
    <SafeAreaView style={pageStyles.wrapper}>
      <View style={pageStyles.header}>
        <Text style={pageStyles.title}>Gerenciamento de Veiculos</Text>
        <ThemeToggleButton />
      </View>

      <View style={pageStyles.container}>
        <TextInput
          placeholder="Buscar veículo..."
          placeholderTextColor={styles.text.color}
          style={pageStyles.search}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <VehicleCard
              vehicle={item}
              onPress={() => router.push(`/(modals)/${item.id}`)}
            />
          )}
          contentContainerStyle={pageStyles.list}
        />
      </View>
    </SafeAreaView>
  );
}
