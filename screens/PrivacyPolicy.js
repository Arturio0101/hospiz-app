import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = 'privacyAccepted';

const Link = ({ url, children }) => (
  <TouchableOpacity onPress={() => Linking.openURL(url)}>
    <Text style={styles.link}>{children}</Text>
  </TouchableOpacity>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.subheader}>{title}</Text>
    {children}
  </View>
);

const CheckBox = ({ value, onValueChange }) => (
  <TouchableOpacity
    onPress={() => onValueChange(!value)}
    style={[styles.checkboxBase, value && styles.checkboxChecked]}
    activeOpacity={0.7}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: value }}
  >
    {value && <Text style={styles.checkmark}>✓</Text>}
  </TouchableOpacity>
);

const PrivacyPolicy = () => {
  const [accepted, setAccepted] = useState(false);
  const confirmedRef = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigation = useNavigation();
  const [isFirstVisit, setIsFirstVisit] = useState(false); // Показывать ли блоки

  // DEBUG: показать текущее значение из AsyncStorage
  const debugLogStorage = async (label) => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(`[DEBUG][${label}] AsyncStorage ${STORAGE_KEY} =`, stored);
  };

  useEffect(() => {
  const checkStorage = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setAccepted(true);
      confirmedRef.current = true;
      setIsFirstVisit(false); // Уже подтверждено — не показываем блок
    } else {
      setIsFirstVisit(true); // Не подтверждено — показываем блок
    }
  };

  checkStorage();

  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    if (accepted && confirmedRef.current) {
      return;
    }
    e.preventDefault();
    setModalMessage('Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben.');
    setModalVisible(true);
  });

  return unsubscribe;
}, [navigation, accepted]);


  const onConfirmPress = async () => {
    await debugLogStorage('onConfirmPress start');

    if (!accepted) {

      setModalMessage('Bitte setzen Sie das Häkchen, um die Datenschutzerklärung zu akzeptieren.');
      setModalVisible(true);
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      confirmedRef.current = true;

      await debugLogStorage('after save');

      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('HomeScreen');
      }
    } catch (err) {
      console.error('Error saving to AsyncStorage:', err);
      setModalMessage('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.header}>Datenschutzerklärung für die HospizApp</Text>
      <Section title="1. Verantwortliche Stelle">
        <Text style={styles.paragraph}>
          <Text>Hospizgruppe Seligenstadt und Umgebung</Text>{'\n'}
          Frankfurter Str. 18{'\n'}
          63500 Seligenstadt{'\n'}
          E-Mail: kontakt@hospiz-seligenstadt.de{'\n'}
          Webseite: www.hospiz-seligenstadt.de 
        </Text>
      </Section>

      <Section title="2. Allgemeine Hinweise zur Datenverarbeitung">
        <Text style={styles.paragraph}>
         Der Schutz personenbezogener Daten hat für uns einen hohen Stellenwert. Die App „HospizApp“ verarbeitet personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Vorgaben (insbesondere DSGVO) und nur für klar definierte Zwecke.
        </Text>
      </Section>

      <Section title="3. Welche Daten verarbeitet werden">
        <Text style={styles.paragraph}>Die App richtet sich in erster Linie an Besucherinnen und Besucher des Hospizes.
          <Text style={{fontWeight: '600'}}>Von normalen Nutzerinnen und Nutzern werden keine personenbezogenen Daten verarbeitet.</Text> 
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{fontWeight: '600'}}>Personenbezogene Daten werden ausschließlich im Rahmen des Adminbereichs für Mitarbeitende verarbeitet.</Text> 
           Dabei kann es sich um folgende Daten handeln:
        </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Name, E-Mail-Adresse, Telefonnummer (nur für interne Zwecke)</Text></Text>
            <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Zugangsdaten zum geschützten Adminbereich</Text></Text>
            <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Technische Verbindungsdaten (z. B. IP-Adresse) zur sicheren Nutzung des Systems</Text></Text>
          </View>
      </Section>

      <Section title="4. Rechtsgrundlage der Datenverarbeitung">
        <Text style={styles.paragraph}>
          Die Verarbeitung erfolgt ausschließlich auf Basis von:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung für interne Nutzung)</Text></Text>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherer Administration)</Text></Text>
        </View>
      </Section>

      <Section title="5. Datenübertragung und -speicherung">
         <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Alle Verbindungen erfolgen ausschließlich über eine gesicherte HTTPS-Verbindung.</Text></Text>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Die Daten von Mitarbeitenden werden auf einem geschützten Server gespeichert.</Text></Text>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text><Text style={styles.listItemText}>Eine Weitergabe an Dritte erfolgt nicht, außer im Rahmen technischer Wartung durch beauftragte Dienstleister (mit DSGVO-konformem Vertrag).</Text></Text>
       </View>
      </Section>

<Section title="6. Standortdaten und Google Maps">
  <View style={styles.list}>
    <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
      <Text style={styles.listItemText}>Die App greift nicht auf den Standort der Nutzerinnen und Nutzer zu.</Text>
    </Text>
    <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
      <Text style={styles.listItemText}>Google Maps wird ausschließlich zur Anzeige des Standorts der Einrichtung verwendet – sowohl in der App als auch auf der Webseite. Dabei können durch die Nutzung Daten an Google übermittelt werden.</Text>
    </Text>
    <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
      <Text style={styles.listItemText}>Weitere Informationen zur Datenverarbeitung durch Google finden Sie hier:</Text>
      <Link url="https://www.google.com/intl/de_de/help/terms_maps.html">
        Datenschutzerklärung von Google Maps.
      </Link>
    </Text>
  </View>
</Section>



      <Section title="7. Speicherdauer">
        <Text style={styles.paragraph}>
         Daten werden nur so lange gespeichert, wie dies für administrative Zwecke erforderlich ist oder gesetzlich vorgeschrieben ist.
        </Text>
      </Section>

            <Section title="8. Rechte betroffener Personen (für Mitarbeitende)">
        <Text style={styles.paragraph}>
          Mitarbeitende haben nach der DSGVO folgende Rechte:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
           <Text style={styles.listItemText}>Recht auf Auskunft (Art. 15 DSGVO)</Text> 
          </Text>

          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
            <Text style={styles.listItemText}>Recht auf Berichtigung (Art. 16 DSGVO)</Text>
          </Text>

        <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
            <Text style={styles.listItemText}>Recht auf Löschung (Art. 17 DSGVO)</Text>
          </Text>

          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
           <Text style={styles.listItemText}>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</Text>
          </Text>

         <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
            <Text style={styles.listItemText}>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</Text>
          </Text>

          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
            <Text style={styles.listItemText}>Widerspruchsrecht (Art. 21 DSGVO)</Text>
          </Text>
          <Text style={styles.listItem}><Text style={styles.bullet}>• </Text>
            <Text style={styles.listItemText}>Zur Wahrnehmung Ihrer Rechte wenden Sie sich bitte an: info@hospiz-seligenstadt.de</Text>
          </Text>
        </View>
      </Section>

      <Section title="9. Datensicherheit">
        <Text style={styles.paragraph}>
          Die App und die dahinterliegende Serverinfrastruktur verwenden moderne technische und organisatorische Maßnahmen, um Ihre Daten zu schützen.
        </Text>
      </Section>

      <Section title="10. Änderungen der Datenschutzerklärung">
        <Text style={styles.paragraph}>
          Diese Datenschutzerklärung kann aktualisiert werden. Die jeweils aktuelle Version ist in der App und auf der Webseite einsehbar.
        </Text>
      </Section>

       <Section title="11. Datenschutzbeauftragte/r">
        <Text style={styles.paragraph}>
          Diese Datenschutzerklärung kann aktualisiert werden. Die jeweils aktuelle Version ist in der App und auf der Webseite einsehbar.
        </Text>
        <Text style={styles.paragraph}>
          <Text>Rainer Marsula</Text>{'\n'}
          Frankfurter Str. 18{'\n'}
          63500 Seligenstadt{'\n'}
          E-Mail: datenschutz@hospiz-seligenstadt.de
        </Text>
      </Section>
    </ScrollView>

      {isFirstVisit && (
  <>
    <View style={styles.confirmSection}>
      <CheckBox
        value={accepted}
        onValueChange={(value) => {
          setAccepted(value);
          if (!value) confirmedRef.current = false;
          debugLogStorage('onValueChange');
        }}
      />
      <Text style={styles.confirmText}>
        Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.
      </Text>
    </View>

    <TouchableOpacity
      style={[styles.button, !accepted && styles.buttonDisabled]}
      disabled={!accepted}
      onPress={onConfirmPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !accepted }}
    >
      <Text style={styles.buttonText}>Bestätigen</Text>
    </TouchableOpacity>
  </>
)}


      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 20,
    color: '#222',
  },
  subheader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
    color: '#333',
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
  section: {
    marginBottom: 25,
  },
  confirmSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  confirmText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: '#222',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#444',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#444',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0066cc',
    marginHorizontal: 15,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    marginVertical: 8,
    paddingLeft: 10, // для отступа от края
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  listItemTitle: {
    fontWeight: '600',
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 2, // чтобы опустить bullet чуть ниже
    marginRight: 10, // Увеличить расстояние между bullet и текстом
  },
  bulletWrapper: {
    width: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PrivacyPolicy;
