import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../app/contexts/ThemeContext';
import { createThemedStyles } from '../constants/Styles';
import { Vehicle } from '../types/vehicle';

interface Props {
  vehicle: Vehicle;
}

function getBrandIcon(brand: string): keyof typeof FontAwesome5.glyphMap {
  switch (brand.toLowerCase()) {
    case 'volkswagen':
    case 'chevrolet':
    case 'fiat':
    case 'hyundai':
    case 'renault':
    case 'toyota':
    default:
      return 'car';
  }
}

export default function VehicleCard({ vehicle }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  
  const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: styles.card.backgroundColor,
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
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
      color: styles.text.color,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    text: {
      color: styles.text.color,
      opacity: 0.7,
      fontSize: 14,
    },
  });

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <View style={cardStyles.headerLeft}>
          <FontAwesome5
            name={getBrandIcon(vehicle.marca)}
            size={20}
            color={styles.text.color}
          />
          <Text style={cardStyles.title}>
            {vehicle.marca} {vehicle.modelo}
          </Text>
        </View>
        {vehicle.id && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(modals)/[id]',
                params: { id: String(vehicle.id) },
              })
            }
          >
            <Feather name="edit" size={18} color={styles.text.color} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={cardStyles.text}>Placa: {vehicle.placa}</Text>
      <Text style={cardStyles.text}>Ano: {vehicle.ano}</Text>
      <Text style={cardStyles.text}>Cor: {vehicle.cor}</Text>
    </View>
  );
}
