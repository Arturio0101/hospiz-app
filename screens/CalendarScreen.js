import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [eventsByDate, setEventsByDate] = useState({});

  // Встроенные данные events
  const events = [
    {
      title: 'Karikaturen-Ausstellung "Wenn der Tod dich anlacht"',
      dates: ['2025-01-19', '2025-01-20', '2025-01-21', '2025-01-22', '2025-01-23', '2025-01-24', '2025-01-25'],
      Datum: 'SO 19.01.2025, 20.–25.01.2025',
      speakers: ['Vernissage', 'Wanderausstellung'],
      location: 'St. Gabriel, Hainburg, Hauptstr. 6',
      time: '15:00 (Vernissage), täglich geöffnet von 17:00 bis 19:00',
      links: ['/images/bilder_aktuelles/2025-Jubil-Karikaturen.pdf'],
      Link: 'https://www.hospiz-seligenstadt.de/images/bilder_aktuelles/2025-Jubil-Karikaturen.pdf',
      notes: 'Siehe Flyer',
    },
    {
      title: 'Letzte Hilfe Kurse',
      dates: ['2025-02-01', '2025-07-05'],
      Datum: 'SA 01.02.2025, SA 05.07.2025',
      speakers: ['Petra und Hartmut Ehrich, Sterbe- und Trauerbegleiter*in der Hospizgruppe'],
      location: 'Ev. Gemeindehaus Hainburg, Uhlandstr. 1',
      time: '15:00 - 19:00',
      contact: {
        name: 'Hartmut Ehrich',
        phone: '0170-460 53 55',
      },
    },
    {
      title: 'Start EintopfStammtisch trauernder Männer',
      dates: [
        '2025-02-08', '2025-03-22', '2025-04-12',
        '2025-05-24', '2025-08-30', '2025-10-04',
        '2025-11-08', '2025-12-13'
      ],
      Datum: 'Beginn SA 08.02.2025 – monatlich Folgetermine: 22.03., 12.04., 24.05.2025 und SA 30.08.2025 (Folgetermine: 04.10., 08.11., 13.12.2025)',
      speakers: ['Hartmut Ehrich, Trauerbegleiter der Hospizgruppe'],
      location: 'Kreuzburgschule, Küche, Hainburg, Kanalstr. 45 (Eingang Wilhelm-Leuschner-Str.)',
      time: '12:30 - 15:00',
      contact: {
        organization: 'VHS Hainburg',
        phone: '06182-7809-5111',
        website: 'https://www.volkshochschule-hainburg.de/programm/gesundheit/',
      },
    },
  {
    "title": "Vortrag \"Humor in der Sterbebegleitung\"",
    "dates": ["2025-02-16"],
    "Datum": "SO 16.02.2025",
    "speakers": ["Christoph Gilsbach als \"Professor Spaghetti\""],
    "location": "Ev. Gemeindehaus Hainburg, Uhlandstr. 1",
    "time": "19:00",
    "links": ["/images/bilder_aktuelles/2025-02-Term-Clown.pdf"],
    "Link": "https://www.hospiz-seligenstadt.de/images/bilder_aktuelles/2025-02-Term-Clown.pdf",
    "notes": "Siehe Flyer"
  },
  {
    "title": "Vortrag \"Vorsorge am Lebensende\"",
    "dates": ["2025-03-20", "2025-10-23"],
    "Datum": "DO 20.03.2025, DO 23.10.2025",
    "speakers": ["Monika Schulz, Koordinatorin der Hospizgruppe"],
    "location": "Rathaus Klein-Krotzenburg, Retzer Str. 1",
    "time": "19:00",
    "contact": {
      "organization": "VHS Hainburg",
      "phone": "06182-7809-5111",
      "website": "https://www.volkshochschule-hainburg.de/programm/vortraege/"
    }
  },
  {
    "title": "Mitsingkonzert \"Lieder für's Leben\"",
    "dates": ["2025-03-23"],
    "Datum": "SO 23.03.2025",
    "speakers": ["IRIA (http://www.iria.de)"],
    "location": "St. Marien, Seligenstadt, Steinweg 25",
    "time": "17:00",
    "links": ["/images/bilder_aktuelles/2025-03-Mitsingflyer.pdf"],
    "Link": "https://www.hospiz-seligenstadt.de/images/bilder_aktuelles/2025-03-Mitsingflyer.pdf",
    "notes": "Siehe Flyer"
  },
  {
    "title": "Kinofilm: Die leisen und die großen Töne, französische Tragikomödie",
    "dates": ["2025-04-25"],
    "Datum": "FR 25.04.2025",
    "speakers": ["Reihe Seniorenkino"],
    "location": "Kino Turmpalast, Seligenstadt, Bahnhofstr. 14",
    "time": "14:00",
    "notes": "Eintritt 6 Euro"
  },
  {
    "title": "Vortrag \"Übertherapie am Lebensende\"",
    "dates": ["2025-05-10"],
    "Datum": "SA 10.05.2025",
    "speakers": ["Dr. Matthias Thöns, Palliativmediziner"],
    "location": "Ev. Gemeindehaus Hainburg, Uhlandstr. 1",
    "time": "19:00",
    "links": ["/images/bilder_aktuelles/2025-Jubil-Uebertherapie.jpg"],
    "Link": "https://www.hospiz-seligenstadt.de/images/bilder_aktuelles/2025-Jubil-Uebertherapie.jpg",
    "notes": "Siehe Flyer"
  },
  {
    "title": "Poetry-Slam",
    "dates": ["2025-05-17"],
    "Datum": "SA 17.05.2025",
    "speakers": ["Über Tod, Sterben und Leben"],
    "location": "St. Josefshaus, Jakobssaal, Seligenstadt, Jakobstr. 5",
    "time": "18:00",
    "links": ["/images/bilder_aktuelles/2025-Jubil-Poetryslam.jpg"],
    "Link": "https://www.hospiz-seligenstadt.de/images/bilder_aktuelles/2025-Jubil-Poetryslam.jpg",
    "notes": "Siehe Flyer"
  },
  {
    "title": "Für Igelkinder: \"Leicht wie eine Feder, schwer wie ein Stein\"",
    "dates": ["2025-06-14"],
    "Datum": "SA 14.06.2025",
    "speakers": ["Andrea Thiesen, Erzieherin", "Petra Ehrich und Melanie Malesevic (Trauerbegleiterinnen d. Hospizgruppe)"],
    "location": "Naturpferdeplatz",
    "notes": "Entfällt aus Krankheitsgründen"
  },
  {
    "title": "Poesie im Konventgarten",
    "dates": ["2025-08-29"],
    "Datum": "FR 29.08.2025",
    "speakers": ["Uschi Lüft", "Oskar Mürell"],
    "location": "Treffen im Klosterhof unter der Kastanie",
    "time": "19:00"
  },
  {
    "title": "Tag des Friedhofs - Lesung mit Klangmeditation",
    "dates": ["2025-09-20"],
    "Datum": "SA 20.09.2025",
    "speakers": ["Bettina Findling u. Angehörige"],
    "location": "Trauerhalle Friedhof Seligenstadt, am Grabmal für Sternenkinder"
  }];

  useEffect(() => {
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
  }, []);

  const filteredEvents = selectedDate ? eventsByDate[selectedDate] || [] : events;

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

  return (
    <ScrollView style={styles.container} accessible={true} accessibilityLabel="Veranstaltungsplan 2025">
      <Text style={styles.header} accessibilityRole="header">Veranstaltungsplan 2025</Text>

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
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Kalender mit markierten Veranstaltungstagen"
      />

      {selectedDate && (
        <Text style={styles.subheader} accessibilityRole="header" accessibilityLiveRegion="polite">
          Veranstaltungen am {dayjs(selectedDate).format('DD.MM.YYYY')}:
        </Text>
      )}

      {filteredEvents.map((event, index) => (
        <View key={index} style={styles.card} accessible={true} accessibilityLabel={`Veranstaltung: ${event.title}`}>
          <Text style={styles.title} accessibilityRole="header">{event.title}</Text>

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
                <TouchableOpacity
                  onPress={() => openUrl(event.contact.website)}
                  accessible={true}
                  accessibilityRole="link"
                  accessibilityLabel={`Website öffnen: ${event.contact.website}`}
                >
                  <Text style={styles.link}>Website öffnen</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {event.Link && (
            <TouchableOpacity
              onPress={() => openUrl(event.Link)}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel={`Mehr Info (Flyer) öffnen: ${event.Link}`}
            >
              <Text style={styles.link}>Mehr Info (Flyer)</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {selectedDate && filteredEvents.length === 0 && (
        <Text style={styles.noEvents} accessibilityLiveRegion="polite">
          Keine Veranstaltungen an diesem Tag.
        </Text>
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
});
