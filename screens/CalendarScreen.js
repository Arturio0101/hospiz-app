import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

const SERVER_URL = 'https://hospiz-app.onrender.com';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [eventsByDate, setEventsByDate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/events`);
        const events = await response.json();

        const marks = {};
        const grouped = {};

        events.forEach(event => {
          if (event.dates && event.dates.length > 0) {
            event.dates.forEach(date => {
              if (!marks[date]) {
                marks[date] = {
                  marked: true,
                  dotColor: '#007AFF',
                  selected: false,
                  selectedColor: '#FFEBCD',
                };
              }
              if (!grouped[date]) grouped[date] = [];
              grouped[date].push(event);
            });
          }
        });

        setMarkedDates(marks);
        setEventsByDate(grouped);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Events:', error);
        Alert.alert('Fehler', 'Die Veranstaltungen konnten nicht geladen werden.');
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Ungültige URL', 'Diese URL kann nicht geöffnet werden.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Die URL konnte nicht geöffnet werden.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Veranstaltungen werden geladen...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Veranstaltungsplan 2025</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...Object.keys(markedDates).reduce((acc, date) => {
            acc[date] = {
              ...markedDates[date],
              selected: date === selectedDate,
              selectedColor: date === selectedDate ? '#FFCC00' : markedDates[date].selectedColor,
            };
            return acc;
          }, {}),
          ...(selectedDate && !markedDates[selectedDate] ? {
            [selectedDate]: {
              selected: true,
              selectedColor: '#FFCC00',
              marked: true,
              dotColor: '#FFCC00',
            }
          } : {})
        }}
        theme={{
          selectedDayBackgroundColor: '#FFCC00',
          todayTextColor: '#007AFF',
        }}
        style={{ marginBottom: 20 }}
      />

      {selectedDate && (
        <Text style={styles.subheader}>
          Veranstaltungen am {dayjs(selectedDate).format('DD.MM.YYYY')}:
        </Text>
      )}

      {filteredEvents.map((event, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>

          {event.Datum && (
            <Text style={styles.text}><Text style={styles.bold}>Datum: </Text>{event.Datum}</Text>
          )}

          {event.speakers && event.speakers.length > 0 && (
            <Text style={styles.text}><Text style={styles.bold}>Referent(en): </Text>{event.speakers.join(', ')}</Text>
          )}

          {event.location && (
            <Text style={styles.text}><Text style={styles.bold}>Ort: </Text>{event.location}</Text>
          )}

          {event.time && (
            <Text style={styles.text}><Text style={styles.bold}>Uhrzeit: </Text>{event.time}</Text>
          )}

          {event.notes && (
            <Text style={styles.text}><Text style={styles.bold}>Hinweis: </Text>{event.notes}</Text>
          )}

          {event.contact && (
            <View style={styles.text}>
              {event.contact.name && (
                <Text><Text style={styles.bold}>Kontakt: </Text>{event.contact.name}</Text>
              )}
              {event.contact.organization && (
                <Text><Text style={styles.bold}>Organisation: </Text>{event.contact.organization}</Text>
              )}
              {event.contact.phone && (
                <Text><Text style={styles.bold}>Tel: </Text>{event.contact.phone}</Text>
              )}
              {event.contact.website && (
                <TouchableOpacity onPress={() => openUrl(event.contact.website)}>
                  <Text style={styles.link}>Website öffnen</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {event.Link && (
            <TouchableOpacity onPress={() => openUrl(event.Link)}>
              <Text style={styles.link}>Mehr Info (Flyer)</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {selectedDate && filteredEvents.length === 0 && (
        <Text style={styles.noEvents}>Keine Veranstaltungen an diesem Tag.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    marginTop: 6,
  },
  noEvents: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
});
