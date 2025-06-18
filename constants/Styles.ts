import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const createThemedStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  text: {
    color: Colors[theme].textPrimary,
  },
  card: {
    backgroundColor: Colors[theme].card,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabBar: {
    backgroundColor: Colors[theme].background,
    borderTopColor: Colors[theme].card,
    borderTopWidth: 1,
  },
  header: {
    backgroundColor: Colors[theme].background,
    borderBottomColor: Colors[theme].card,
    borderBottomWidth: 1,
  },
}); 