import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Section = ({ section, isExpanded, onToggle }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.sectionContainer}>
      <Pressable style={styles.sectionHeader} onPress={onToggle}>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color="#0066cc"
          style={{ marginRight: 8 }}
        />
        <MaterialIcons
          name="description"
          size={20}
          color="#0066cc"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.sectionContent}>
          {section.paragraphs?.map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))}
          {section.listItems?.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))}

          {/* Внешняя ссылка (например, на политику конфиденциальности) */}
          {section.externalLink && (
            <Pressable
              onPress={() => Linking.openURL(section.externalLink.url)}
              style={({ pressed }) => [
                styles.linkContainer,
                pressed && { opacity: 0.6 },
              ]}
              accessibilityRole="link"
            >
              <MaterialIcons
                name="link"
                size={18}
                color="#0066cc"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.link}>{section.externalLink.text}</Text>
            </Pressable>
          )}

          {/* Внутренний линк на экран PrivacyPolicy (оставлен для совместимости, если понадобится) */}
          {section.internalLink && !section.externalLink && (
            <Pressable
              onPress={() => navigation.navigate(section.internalLink.screen)}
              style={({ pressed }) => [
                styles.linkContainer,
                pressed && { opacity: 0.6 },
              ]}
              accessibilityRole="link"
            >
              <MaterialIcons
                name="link"
                size={18}
                color="#0066cc"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.link}>{section.internalLink.text}</Text>
            </Pressable>
          )}

          {/* Остальные внешние ссылки, если есть */}
          {section.links?.map((link, i) => (
            <Pressable
              key={i}
              onPress={() => Linking.openURL(link.url)}
              style={({ pressed }) => [
                styles.linkContainer,
                pressed && { opacity: 0.6 },
              ]}
              accessibilityRole="link"
            >
              <MaterialIcons
                name="link"
                size={18}
                color="#0066cc"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.link}>{link.text}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const TermsScreen = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.pageTitle}>Nutzungsbedingungen (AGB)</Text>

      {termsData.map((section, index) => (
        <Section
          key={index}
          section={section}
          isExpanded={!!expandedSections[index]}
          onToggle={() => toggleSection(index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066cc',
  },
  sectionContent: {
    marginTop: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    marginLeft: 16,
    marginBottom: 6,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

const termsData = [
  {
    title: '1. Geltungsbereich',
    paragraphs: [
      'Diese Nutzungsbedingungen gelten für die Nutzung der mobilen Anwendung "HospizApp".',
      'Mit der Nutzung der App erklären Sie sich mit diesen Bedingungen ausdrücklich einverstanden.',
    ],
  },
  {
    title: '2. Leistungsbeschreibung',
    paragraphs: [
      'Die App dient der Unterstützung der Hospizgruppe Seligenstadt und Umgebung bei der Bereitstellung von Informationen und Angeboten im Rahmen einer ehrenamtlichen Tätigkeit ohne kommerzielle Absichten.',
    ],
  },
  {
    title: '3. Nutzung der App',
    paragraphs: [
      'Die Nutzung der App erfolgt auf eigene Verantwortung.',
      'Die Hospizgruppe Seligenstadt übernimmt keine Haftung für Schäden, die aus der Nutzung der App entstehen können.',
    ],
    listItems: [
      'Es besteht kein Anspruch auf Vollständigkeit, Aktualität oder Richtigkeit der Inhalte.',
      'Die Verfügbarkeit der App kann zeitweise eingeschränkt sein.',
      'Ihre personenbezogenen Daten werden gemäß unserer Datenschutzerklärung verarbeitet und geschützt.',
    ],
  },
  {
    title: '4. Haftungsausschluss',
    paragraphs: [
      'Trotz sorgfältiger Prüfung übernehmen wir keine Haftung für externe Links.',
      'Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.',
    ],
  },
  {
    title: '5. Datenschutz',
    paragraphs: [
      'Personenbezogene Daten werden gemäß unserer Datenschutzerklärung verarbeitet.',
      'Bitte lesen Sie diese regelmäßig, um über den Umgang mit Ihren Daten informiert zu sein.',
    ],
    externalLink: {
      text: 'Datenschutzerklärung lesen',
      url: 'https://arturio0101.github.io/hospiz-privacy-policy/privacy-policy.html',
    },
  },
  {
    title: '6. Änderungen der Nutzungsbedingungen',
    paragraphs: [
      'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern.',
      'Bitte überprüfen Sie die Bedingungen regelmäßig auf Aktualisierungen.',
    ],
  },
  {
    title: '7. Kontakt',
    paragraphs: [
      'Bei Fragen zu den Nutzungsbedingungen wenden Sie sich bitte an: ',
      'Hospizgruppe Seligenstadt und Umgebung',
      'E-Mail: info@hospiz-seligenstadt.de',
    ],
  },
];

export default TermsScreen;
