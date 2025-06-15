import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Vehicle } from '../types/vehicle';

interface Props {
  vehicle: Vehicle;
}

function getBrandIcon(brand: string): keyof typeof FontAwesome5.glyphMap {
  switch (brand.toLowerCase()) {
    case 'volkswagen':
      return 'car-side';
    case 'chevrolet':
      return 'car';
    case 'fiat':
      return 'car-alt';
    case 'hyundai':
      return 'flag-side';
    case 'Renault':
      return 'flag';
    case 'Toyota':
      return 'flag-alt';
    default:
      return 'car';
  }
}

export default function VehicleCard({ vehicle }: Props) {
  const router = useRouter();
  
  const accentColor = useThemeColor({}, 'accent');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'card');
  
  const styles = StyleSheet.create({
  card: {
    backgroundColor: cardColor,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    color: textPrimary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  text: {
    color: textSecondary,
    fontSize: 14,
  },
});

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome5
            name={getBrandIcon(vehicle.marca)}
            size={20}
            color={accentColor}
            />
          <Text style={styles.title}>
            {vehicle.marca} {vehicle.modelo}
          </Text>
        </View>
        {vehicle.id && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(modals)/edit/[id]',
                params: { id: String(vehicle.id) },
              })
            }
            >
            <Feather name="edit" size={18} color={textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.text}>Placa: {vehicle.placa}</Text>
      <Text style={styles.text}>Ano: {vehicle.ano}</Text>
      <Text style={styles.text}>Cor: {vehicle.cor}</Text>
    </View>
  );
}
