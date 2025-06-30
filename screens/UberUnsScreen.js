import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

const teamMembers = [
  {
    name: 'Thomas Weyer',
    role: 'Vorsitzender',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Thomas_Weyer-c1527daf.jpeg'
  },
  {
    name: 'Iris Mader',
    role: 'Kasse',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Iris_Mader-7196b26c.jpeg'
  },
  {
    name: 'Martina Koch',
    role: 'Schriftverkehr',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Martina-Koch-6853e1c6.jpeg'
  },
  {
    name: 'Leni Göhler-Fischer',
    role: 'Beisitzerin',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Leni-Ghler-Fischer-3d6105ce.jpeg'
  },
  {
    name: 'Eva-Maria Hessemer',
    role: 'Beisitzerin',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/2021b_Eva-Maria_Hessemer-14670c16.jpeg'
  },
  {
    name: 'Claus Schlatter',
    role: 'Beisitzer / Öffentlichkeitsarbeit',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Bild_Claus_Schlatter-a9f8f9c9.jpeg'
  },
  {
    name: 'Monika Schulz',
    role: 'Beisitzerin',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Monika-Schulz-89c6e584.jpeg'
  },
  {
    name: 'Stefanie Basch',
    role: 'Koordinatorin',
    image: 'https://www.hospiz-seligenstadt.de/templates/yootheme/cache/Stef_Basch-40c958c8.jpeg'
  }
];

export default function UberUnsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wer wir sind</Text>
      <Text style={styles.text}>
        Die IGSL-Hospizgruppe Seligenstadt unterstützt schwerkranke und sterbende Menschen sowie ihre Angehörigen — durch Gespräche, Beratung oder einfach durch Dasein.
      </Text>
      <Text style={styles.text}>
        Über 40 ehrenamtliche Begleiter/innen sind aktiv, unabhängig von Religion oder Herkunft. Alle Begleiter/innen werden nach dem offiziellen Curriculum der IGSL geschult. Die Gruppe zählt insgesamt über 200 Mitglieder.
      </Text>

      <Text style={[styles.title, { marginTop: 32 }]}>Vorstand</Text>
      <View style={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.memberCard}>
            <Image
              source={{ uri: member.image }}
              style={styles.image}
              resizeMode="cover"
              accessible
              accessibilityLabel={`${member.name}, ${member.role}`}
            />
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.role}>{member.role}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    color: '#222',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginTop: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  memberCard: {
    width: cardWidth,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 100,
    height: 130,
    borderRadius: 8,
  },
  name: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
  },
  role: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});
