import React from 'react';
import { ScrollView, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

function Section({ title, children }) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </>
  );
}

export default function SpendenFoerdernScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <Section title="🤝 Mitgliedschaft">
        <Text style={styles.paragraph}>
          Unterstützen Sie unsere Hospizarbeit durch Ihre Mitgliedschaft – aktiv oder fördernd.
        </Text>
        <Text style={styles.paragraph}>
          Jahresbeiträge ab 2025:
        </Text>
        <Text style={styles.listItem}>• € 40 für Einzelpersonen</Text>
        <Text style={styles.listItem}>• € 60 für Ehepaare</Text>
        <Text style={styles.listItem}>• € 20 für Schüler, Studierende, Azubis & Rentner</Text>
        <Text style={styles.listItem}>• € 30 für Studierenden- & Rentnerpaare</Text>
        <Text style={styles.paragraph}>
          Selbstzahler zahlen +5 € wegen Mehraufwand. 30 % der Beiträge verbleiben bei der Regionalgruppe Seligenstadt.
        </Text>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="PDF Mitgliedsantrag öffnen"
          accessibilityHint="Öffnet das PDF-Dokument mit dem Mitgliedsantrag in Ihrem Browser"
          onPress={() =>
            Linking.openURL('https://hospiz-seligenstadt.de/images/downloads/2025-01-Mitgl-Antrag.pdf').catch((err) =>
              console.error("PDF konnte nicht geöffnet werden", err)
            )
          }
        >
          <Text style={styles.link}>👉 Mitgliedsantrag öffnen (PDF)</Text>
        </TouchableOpacity>

        <Text style={styles.paragraph}>
          Bitte ausdrucken, unterschreiben und senden an:
        </Text>
        <Text style={styles.paragraph}>
          Hospizgruppe Seligenstadt und Umgebung{"\n"}
          Zum Königssee 8{"\n"}
          63512 Hainburg
        </Text>
        <Text style={styles.paragraph}>
  Interesse an ehrenamtlicher Mitarbeit? Rufen Sie Monika Schulz unter{' '}
  <Text
  style={styles.link}
  accessibilityRole="link"
  accessibilityLabel="Telefonnummer anrufen: 0178 56 46 979"
  onPress={() => Linking.openURL('tel:01785646979')}
>
  0178 56 46 979
</Text> an.
</Text>
<Text style={[styles.paragraph, { fontStyle: 'italic' }]}>
  (Veröffentlichung mit Einverständnis)
</Text>


      </Section>

      <Section title="💸 So können Sie spenden">
  <Text style={styles.paragraph}>
    Mit Ihrer Spende unterstützen Sie unsere Arbeit. Bitte geben Sie Ihre Adresse für eine Spendenbescheinigung an.
  </Text>
  <Text style={styles.paragraph}>
    Ihre Spende ist selbstverständlich freiwillig.
  </Text>
  <Text style={styles.paragraph}>
    <Text style={styles.bold}>Bankverbindung:</Text>{"\n"}
    Hospizgruppe Seligenstadt und Umgebung{"\n"}
    Sparkasse Langen-Seligenstadt{"\n"}
    IBAN: DE96 5065 2124 0001 1152 52{"\n"}
    BIC: HELADEF1SLS
  </Text>
</Section>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 6,
  },
  link: {
    color: '#005EB8',
    fontSize: 16,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
});
