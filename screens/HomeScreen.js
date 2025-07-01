import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const [tapCount, setTapCount] = useState(0);
  const timeoutRef = useRef(null);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (tapCount >= 5) {
      setTapCount(0);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (navigation && navigation.navigate) {
        navigation.navigate('AdminLogin');
      } else {
        Alert.alert('Navigation not available');
      }
    } else if (tapCount > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setTapCount(0), 3000);
    }
  }, [tapCount, navigation]);

  const handleSecretTap = () => {
    setTapCount(prev => prev + 1);
  };

  const buttons = [
    { label: 'Aktuelles', icon: 'calendar-outline', screen: 'CalendarScreen' },
    { label: 'Was wir leisten', icon: 'heart-outline', screen: 'WasWirLeisten' },
    { label: 'Kontakt', icon: 'phone-outline', screen: 'Contact' },
    { label: 'Sprechzeiten', icon: 'clock-outline', screen: 'Sprechzeiten' },
    { label: 'Spenden + Fördern', icon: 'gift-outline', screen: 'SpendenFoerdern' },
    { label: 'Nutzungsbedingungen', icon: 'file-document-outline', screen: 'Service' },
    { label: 'Über uns', icon: 'account-group-outline', screen: 'UberUns' },
    { label: 'Datenschutz', icon: 'shield-lock-outline', screen: 'PrivacyPolicy' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={handleSecretTap}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Hospizgruppe Seligenstadt und Umgebung, geheime Admin-Anmeldung"
      >
        <Text style={styles.title}>Hospizgruppe Seligenstadt und Umgebung</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              if (navigation && navigation.navigate) {
                navigation.navigate(btn.screen);
              } else {
                Alert.alert('Navigation not available');
              }
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Gehe zu ${btn.label}`}
          >
            <MaterialCommunityIcons name={btn.icon} size={32} color="#6c5ce7" />
            <Text style={styles.cardText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4ff',
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2d3436',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#2d3436',
  },
});
