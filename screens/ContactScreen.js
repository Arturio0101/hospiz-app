import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const SERVER_URL = 'https://hospiz-app.onrender.com';

export default function ContactScreen() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/contact`);
      if (res.data) {
        // Гарантируем, что адрес - массив строк
        if (
          !res.data.institution.address ||
          !Array.isArray(res.data.institution.address)
        ) {
          res.data.institution.address = [''];
        }
        setContactData(res.data);
      } else {
        Alert.alert('Fehler', 'Kontaktdaten konnten nicht geladen werden.');
      }
    } catch (err) {
      Alert.alert('Fehler', 'Fehler beim Laden der Kontaktdaten vom Server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openLink = async (url) => {
  try {
    let targetUrl = url;

    // WhatsApp Channel workaround
    if (url.includes('whatsapp.com/channel/')) {
      const channelId = url.split('/channel/')[1];
      // Универсальный deeplink, работающий на Android и iOS
      targetUrl = `https://wa.me/channel/${channelId}`;
    }

    const supported = await Linking.canOpenURL(targetUrl);
    if (supported) {
      await Linking.openURL(targetUrl);
    } else {
      Alert.alert(
        'Link kann nicht geöffnet werden',
        `Der Link "${url}" wird von deinem Gerät nicht unterstützt.`
      );
    }
  } catch (err) {
    console.error("Couldn't open link", err);
    Alert.alert(
      'Fehler',
      'Der Link konnte nicht geöffnet werden. Bitte versuche es später erneut.'
    );
  }
};


  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!contactData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', flex: 1 }]}>
        <Text style={styles.text}>Keine Kontaktdaten verfügbar.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Institution Info */}
      {contactData.institution && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{contactData.institution.title}</Text>
          {contactData.institution.address?.map((line, index) => (
            <Text key={index} style={styles.text}>
              {line}
            </Text>
          ))}
          {contactData.institution.website && (
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel={`Website öffnen: ${contactData.institution.website}`}
              onPress={() => openLink(contactData.institution.website)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>
                {contactData.institution.website.replace('https://', '')}
              </Text>
            </TouchableOpacity>
          )}
          {contactData.institution.email && (
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel={`E-Mail senden an: ${contactData.institution.email}`}
              onPress={() => openLink(`mailto:${contactData.institution.email}`)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>
                E-Mail: {contactData.institution.email}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Coordinator Info */}
      {contactData.coordinator && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{contactData.coordinator.title}</Text>
          <Text style={styles.text}>{contactData.coordinator.name}</Text>
          {contactData.coordinator.phone && (
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel={`Anrufen: ${contactData.coordinator.phone}`}
              onPress={() => openLink(`tel:${contactData.coordinator.phone}`)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>
                Telefon: {contactData.coordinator.phone}
              </Text>
            </TouchableOpacity>
          )}
          {contactData.coordinator.email && (
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel={`E-Mail senden an: ${contactData.coordinator.email}`}
              onPress={() => openLink(`mailto:${contactData.coordinator.email}`)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>
                E-Mail: {contactData.coordinator.email}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Social Links */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="Facebook-Gruppe öffnen"
          style={[styles.socialButton, styles.fbButton]}
          onPress={() =>
            openLink('https://www.facebook.com/hospizseligenstadt')
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.socialText}>Gruppe auf Facebook öffnen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="WhatsApp-Kanal öffnen"
          style={[styles.socialButton, styles.whButton]}
          onPress={() =>
            openLink('https://whatsapp.com/channel/0029VazoOh48vd1MbkyjyP3E')
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.socialText}>WhatsApp-Kanal öffnen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
  },
  text: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  link: {
    fontSize: 16,
    color: '#2563eb',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  socialContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  socialButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  fbButton: {
    backgroundColor: '#1877F2',
  },
  whButton: {
    backgroundColor: '#25D366',
  },
  socialText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
