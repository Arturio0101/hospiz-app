import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Alert,
} from 'react-native';

// Компонент для секции
const SectionContent = ({ section }) => (
  <View style={styles.sectionContent}>
    <Text style={styles.sectionTitle}>
      {section.icon ? `${section.icon} ` : ''}{section.title}
    </Text>

    {Array.isArray(section.paragraphs) &&
      section.paragraphs.map((para, i) => (
        <Text key={i} style={styles.paragraph}>{para}</Text>
      ))}

    {section.phone && <PhoneLink number={section.phone} />}

    {section.listItems?.map((item, i) => (
      <Text key={i} style={styles.listItem}>• {item}</Text>
    ))}

    {section.subsections?.map((sub, j) => (
      <SubSection key={j} title={sub.title} icon={sub.icon}>
        {sub.paragraphs?.map((para, k) => (
          <Text key={k} style={styles.paragraph}>{para}</Text>
        ))}

        {sub.people?.map((person, m) => (
          <PersonCard key={m} name={person.name} uri={person.uri} />
        ))}

        {sub.email && <EmailLink email={sub.email} />}
      </SubSection>
    ))}

    {section.people?.map((person, m) => (
      <PersonCard key={m} name={person.name} uri={person.uri} />
    ))}

    {section.email && <EmailLink email={section.email} />}
  </View>
);

// Подсекция
const SubSection = ({ title, icon, children }) => (
  <View style={styles.subSection}>
    <Text style={styles.subSectionTitle}>
      {icon ? `${icon} ` : ''}{title}
    </Text>
    {children}
  </View>
);

// Карточка человека
const PersonCard = ({ name, uri }) => {
  if (!uri) return null;

  return (
    <View style={styles.imageBox}>
      <Image
        source={{ uri }}
        style={styles.personImage}
        resizeMode="cover"
      />
      <Text style={styles.imageLabel}>{name}</Text>
    </View>
  );
};

// Ссылка на телефон
const PhoneLink = ({ number }) => {
  if (!number || typeof number !== 'string') return null;

  const handlePress = async () => {
    const url = `tel:${number}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Fehler', 'Telefonverbindung nicht verfügbar.');
      }
    } catch (err) {
      console.warn('Phone link error:', err);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={`Telefonnummer ${number}`}
    >
      <Text style={[styles.paragraph, styles.link]}>{number}</Text>
    </Pressable>
  );
};

// Ссылка на email
const EmailLink = ({ email }) => {
  if (!email || typeof email !== 'string') return null;

  const displayEmail = email.replace('[at]', '@');
  const mailto = `mailto:${displayEmail}`;

  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(mailto);
      if (supported) {
        Linking.openURL(mailto);
      } else {
        Alert.alert('Fehler', 'E-Mail kann nicht geöffnet werden.');
      }
    } catch (err) {
      console.warn('Email link error:', err);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={`E-Mail an ${displayEmail}`}
    >
      <Text style={[styles.paragraph, styles.link]}>{displayEmail}</Text>
    </Pressable>
  );
};

// Главный экран
const WasWirLeistenScreen = () => {
  const [expanded, setExpanded] = useState(false);

  const visibleSections = expanded ? contentData : contentData.slice(0, 2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {visibleSections.map((section, index) => (
        <SectionContent key={index} section={section} />
      ))}

      {!expanded && (
        <Pressable
          style={styles.button}
          onPress={() => setExpanded(true)}
          accessibilityRole="button"
          accessibilityLabel="Alle Informationen anzeigen"
        >
          <Text style={styles.buttonText}>Alle anzeigen</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContent: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
  listItem: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
    color: '#555',
  },
  subSection: {
    marginTop: 12,
    marginLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
    paddingLeft: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingRight: 8,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  imageBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  personImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 6,
  },
  imageLabel: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Данные
const contentData = [
  {
    title: 'Lebensbeistand',
    icon: '🕊️',
    paragraphs: [
      'Wir begleiten schwerstkranke oder sterbende Menschen und ihre Angehörigen zu Hause, im Krankenhaus oder Pflegeheim.',
      'Wir verstehen uns als Teil eines Netzwerks und stellen bei Bedarf den Kontakt zu Ärzten, Seelsorgern und Pflegediensten her.',
    ],
  },
  {
    title: 'Ambulante Sterbebegleitung',
    icon: '🤝',
    paragraphs: [
      'Unsere ehrenamtlichen Hospizbegleiter/innen entlasten Angehörige bei der Pflege zuhause durch zeitlich begrenzte Betreuung.',
      'Frau Monika Schulz koordiniert die Einsätze und besucht die Familien persönlich.',
      'Rufen Sie uns an, bevor Sie an Ihre Belastungsgrenze kommen.',
    ],
  },
  {
    title: 'Trauerbegleitung',
    icon: '🌧️',
    paragraphs: [
      'Wir bieten Trauerbegleitung durch Einzelgespräche, Seminare, ein monatliches Trauercafé, GehSpräche und eine Kindertrauergruppe „Igelkinder“.',
      'Der Trauerprozess wird einfühlsam begleitet, um neuen Halt im Leben zu finden.',
    ],
    subsections: [
      {
        title: 'Trauercafé',
        icon: '☕',
        paragraphs: [
          'Offener Treff für Trauernde an jedem ersten Samstag im Monat von 15 bis 17 Uhr im Haus Wallstraße, Seligenstadt. Keine Anmeldung erforderlich.',
        ],
      },
      {
        title: 'Trauergruppe / Trauerseminar',
        icon: '📘',
        paragraphs: [
          'Jährliches Seminar „Mein Trauerweg“ mit monatlichen Treffen ab September (jeweils zweiter Samstag im Monat).',
          'Begleitung in geschlossener Gruppe über ein Jahr.',
        ],
        people: [
          {
            name: 'Gisela Kraus',
            uri: 'https://www.hospiz-seligenstadt.de/images/bilder_hospizgruppe/2017_Gisela_Krauss.jpg',
          },
        ],
        email: 'trauerseminar-seligenstadt@gmx.de',
      },
      {
        title: 'GehSpräche',
        icon: '🚶‍♂️',
        paragraphs: [
          'Spaziergänge für Trauernde an jedem dritten Samstag im Monat um 14 Uhr (Treffpunkt: Parkplatz am Tannenhof in Hainburg).',
          'Anschließend Möglichkeit zur Einkehr und Gespräch.',
        ],
      },
    ],
  },
  {
    title: 'Offene Sprechstunde',
    icon: '📅',
    paragraphs: [
      'Jeden Mittwoch von 18–19 Uhr in der Asklepios Klinik Seligenstadt, Raum 1 (1. Stock, Übergang Geriatrie).',
      'Beratung durch Gisela Kraus oder Monika Schulz, bei Bedarf durch Hospizbegleiterin.',
      'Hausbesuche nach Terminvereinbarung unter 0178 56 46 979.',
    ],
    people: [
      {
        name: 'Gisela Kraus',
        uri: 'https://www.hospiz-seligenstadt.de/images/bilder_hospizgruppe/2017_Gisela_Krauss.jpg',
      },
      {
        name: 'Monika Schulz',
        uri: 'https://www.hospiz-seligenstadt.de/images/bilder_hospizgruppe/Monika_Schulz.jpg',
      },
    ],
    subsections: [
      {
        title: 'Männer-Trauer-Sprechstunde',
        icon: '👨‍🦰',
        paragraphs: [
          'Jeden 2. Mittwoch im Monat von 17–19 Uhr telefonisch unter 0170 460 53 55.',
        ],
        people: [
          {
            name: 'Hartmut Ehrich',
            uri: 'https://www.hospiz-seligenstadt.de/images/gal_trauerseminare/Hartmut.jpg',
          },
        ],
        email: 'MannTrauerSeligenstadt@gmx.de',
      },
    ],
  },
  {
    title: 'Ehrenamtliches Engagement',
    icon: '🙌',
    paragraphs: [
      'Wir freuen uns über Menschen, die sich ehrenamtlich engagieren möchten – ob als Hospizbegleiter/in, in der Trauerarbeit oder Organisation.',
    ],
  },
  {
    title: 'Öffentlichkeitsarbeit und Veranstaltungen',
    icon: '📢',
    paragraphs: [
      'Wir organisieren Vorträge, Infostände und Veranstaltungen, um über Hospizarbeit zu informieren und zu sensibilisieren.',
    ],
  },
  {
    title: 'Kooperationen',
    icon: '🤝',
    paragraphs: [
      'Wir arbeiten eng mit Pflegeeinrichtungen, Hausärzten, Kliniken, Palliativdiensten und Seelsorgern zusammen.',
    ],
  },
  {
    title: 'Ambulante Palliativversorgung',
    icon: '💊',
    paragraphs: [
      'Wir unterstützen durch medizinisch-pflegerische Begleitung schwerkranker Menschen zu Hause im Rahmen eines Palliativkonzepts.',
    ],
  },
  {
    title: 'Kindertrauergruppe Igelkinder',
    icon: '🦔',
    paragraphs: [
      'Kinder trauern anders als Erwachsene – ihre Reaktionen sind oft wechselhaft und kommen in Wellen. Wut, Ängste oder Rückzug sind mögliche Ausdrucksformen.',
      'Die Gruppe „Igelkinder“ bietet Kindern von 6 bis 13 Jahren einen geschützten Raum, um über Verlust zu sprechen und Gefühle auszudrücken.',
      'In zehn altersgerechten Treffen werden Erfahrungen geteilt und verarbeitet. Zwei Termine beziehen Angehörige mit ein.',
      'Begleitende Angehörige können sich parallel austauschen oder mit Trauerbegleitenden sprechen.',
    ],
  },
];

export default WasWirLeistenScreen;
