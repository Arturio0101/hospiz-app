import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import GoogleMapView from '../components/GoogleMapView';

export default function SprechzeitenScreen() {
  const openPhone = () => {
    Linking.openURL('tel:01785646979').catch((err) =>
      console.error("Couldn't open phone link", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Adresse + Map */}
      <View style={styles.card}>
        <Text style={styles.title}>Adresse der Geschäftsstelle:</Text>
        <GoogleMapView />
        <Text style={styles.text}>
          Frankfurter Str.18{'\n'}
          63500 Seligenstadt
        </Text>
      </View>

      {/* Sprechzeiten */}
      <View style={styles.card}>
        <Text style={styles.title}>Unsere Sprechzeiten:</Text>
        <Text style={styles.text}>Mo, Di und Fr: 9:00 – 12:00 Uhr</Text>
        <Text style={styles.text}>Mi und Do: 14:30 – 17:30 Uhr</Text>
        <Text style={styles.text}>und nach Vereinbarung</Text>
      </View>

      {/* Kontakt */}
      <View style={styles.card}>
        <Text style={styles.title}>Kontakt</Text>
        <TouchableOpacity accessibilityRole="link" onPress={openPhone}>
          <Text style={styles.link}>Telefon: 0178 564 69 79</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1f2937',
  },
  text: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
  },
  link: {
    fontSize: 16,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
});
