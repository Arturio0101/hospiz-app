import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = 'https://hospiz-app.onrender.com';

export default function AdminDashboardScreen() {
  const [contact, setContact] = useState({
    institution: { title: '', address: [''], website: '', email: '' },
    coordinator: { title: '', name: '', phone: '', email: '' },
  });

  const [instEmailInput, setInstEmailInput] = useState('');
  const [coordPhoneInput, setCoordPhoneInput] = useState('');
  const [coordEmailInput, setCoordEmailInput] = useState('');

  const [expandedSection, setExpandedSection] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [adminLogin, setAdminLogin] = useState('');
  const [loginInput, setLoginInput] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingContact, setSavingContact] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  useEffect(() => {
    fetchContactFromServer();
    fetchAdminLogin();
  }, []);

  // Загружаем контактные данные с сервера
  const fetchContactFromServer = async () => {
    try {
      setLoadingContact(true);
      const res = await axios.get(`${SERVER_URL}/contact`);
      if (res.data) {
        const data = res.data;
        // Обеспечиваем наличие массива address (если пусто, ставим [''])
        if (!data.institution.address || !Array.isArray(data.institution.address) || data.institution.address.length === 0) {
          data.institution.address = [''];
        }
        setContact(data);
        setInstEmailInput(data.institution.email || '');
        setCoordPhoneInput(data.coordinator.phone || '');
        setCoordEmailInput(data.coordinator.email || '');
      } else {
        Alert.alert('Fehler', 'Kontaktdaten konnten nicht geladen werden.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Fehler beim Laden der Kontaktdaten vom Server.');
    } finally {
      setLoadingContact(false);
    }
  };

  const fetchAdminLogin = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/admin/login`);
      if (res.data?.login) {
        setAdminLogin(res.data.login);
        setLoginInput(res.data.login);
      }
    } catch {
      Alert.alert('Fehler', 'Login konnte nicht geladen werden.');
    }
  };

  const saveNewLogin = async () => {
    if (!loginInput.trim()) {
      Alert.alert('Fehler', 'Login darf nicht leer sein.');
      return;
    }

    try {
      const res = await axios.post(`${SERVER_URL}/admin/update-login`, {
        login: loginInput.trim(),
      });

      if (res.data.success) {
        setAdminLogin(loginInput.trim());
        Alert.alert('Gespeichert', 'Login wurde aktualisiert.');
      } else {
        Alert.alert('Fehler', res.data.message || 'Aktualisierung fehlgeschlagen');
      }
    } catch {
      Alert.alert('Fehler', 'Login konnte nicht gespeichert werden.');
    }
  };

  const saveContactToServer = async () => {
    if (savingContact) return; // Не позволяем повторное нажатие

    const updatedContact = {
      institution: {
        title: contact.institution.title.trim(),
        address: contact.institution.address.map((line) => line.trim()),
        website: contact.institution.website.trim(),
        email: instEmailInput.trim(),
      },
      coordinator: {
        title: contact.coordinator.title.trim(),
        name: contact.coordinator.name.trim(),
        phone: coordPhoneInput.trim(),
        email: coordEmailInput.trim(),
      },
    };

    const hasEmptyInstitutionField = Object.values(updatedContact.institution).some(
      (val) => Array.isArray(val) ? val.some((line) => !line) : !val
    );
    const hasEmptyCoordinatorField = Object.values(updatedContact.coordinator).some(
      (val) => !val
    );

    if (hasEmptyInstitutionField || hasEmptyCoordinatorField) {
      Alert.alert('Fehler', 'Bitte alle Kontaktfelder ausfüllen.');
      return;
    }

    try {
      setSavingContact(true); // 🔁 Start Loading

      const token = await AsyncStorage.getItem('adminToken');
      if (!token) {
        Alert.alert('Fehler', 'Kein Token gefunden. Bitte erneut einloggen.');
        return;
      }

      const response = await fetch(`${SERVER_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Fehler', errorData.message || 'Speichern fehlgeschlagen');
        return;
      }

      setContact(updatedContact);
      Alert.alert('Gespeichert', 'Kontaktdaten wurden aktualisiert.');
    } catch {
      Alert.alert('Fehler', 'Fehler beim Speichern auf dem Server.');
    } finally {
      setSavingContact(false); // ✅ End Loading
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Fehler', 'Bitte fülle alle Passwortfelder aus.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Fehler', 'Die neuen Passwörter stimmen nicht überein.');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword)) {
      Alert.alert(
        'Fehler',
        'Passwort muss mindestens 8 Zeichen lang sein und Großbuchstaben, Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten.'
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) {
        Alert.alert('Fehler', 'Kein Token gefunden. Bitte erneut einloggen.');
        return;
      }

      const response = await axios.post(
        `${SERVER_URL}/admin/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.message) {
        Alert.alert('Erfolg', response.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Fehler', 'Unbekannter Fehler beim Ändern des Passworts.');
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error || 'Fehler beim Ändern des Passworts.';
      Alert.alert('Fehler', msg);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Kontakt */}
          <TouchableOpacity onPress={() => toggleSection('contact')}>
            <Text style={styles.section}>📞 Kontakt</Text>
          </TouchableOpacity>
          {expandedSection === 'contact' && (
            <View style={styles.block}>
              {loadingContact ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <>
                  <TextInput
                    placeholder="Titel Institution"
                    style={styles.input}
                    value={contact.institution.title}
                    onChangeText={(text) =>
                      setContact((prev) => ({
                        ...prev,
                        institution: { ...prev.institution, title: text },
                      }))
                    }
                  />
                  <Text>Adresse:</Text>
                  {contact.institution.address.map((line, i) => (
                    <TextInput
                      key={i}
                      style={styles.input}
                      value={line}
                      placeholder={`Adresszeile ${i + 1}`}
                      onChangeText={(text) => {
                        const newAddress = [...contact.institution.address];
                        newAddress[i] = text;
                        setContact((prev) => ({
                          ...prev,
                          institution: { ...prev.institution, address: newAddress },
                        }));
                      }}
                    />
                  ))}
                  <Text>WebSite:</Text>
                  <TextInput
                    placeholder="Website"
                    style={styles.input}
                    value={contact.institution.website}
                    onChangeText={(text) =>
                      setContact((prev) => ({
                        ...prev,
                        institution: { ...prev.institution, website: text },
                      }))
                    }
                  />
                  <Text>Email:</Text>
                  <TextInput
                    placeholder="E-Mail"
                    style={styles.input}
                    value={instEmailInput}
                    onChangeText={setInstEmailInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Text>Koordinator Info:</Text>
                  <TextInput
                    placeholder="Titel Koordinator"
                    style={styles.input}
                    value={contact.coordinator.title}
                    onChangeText={(text) =>
                      setContact((prev) => ({
                        ...prev,
                        coordinator: { ...prev.coordinator, title: text },
                      }))
                    }
                  />
                  <TextInput
                    placeholder="Name Koordinator"
                    style={styles.input}
                    value={contact.coordinator.name}
                    onChangeText={(text) =>
                      setContact((prev) => ({
                        ...prev,
                        coordinator: { ...prev.coordinator, name: text },
                      }))
                    }
                  />
                  <TextInput
                    placeholder="Telefon Koordinator"
                    style={styles.input}
                    value={coordPhoneInput}
                    onChangeText={setCoordPhoneInput}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    placeholder="E-Mail Koordinator"
                    style={styles.input}
                    value={coordEmailInput}
                    onChangeText={setCoordEmailInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={saveContactToServer}
                    disabled={savingContact}
                  >
                    <Text style={styles.buttonText}>
                      {savingContact ? 'Speichern...' : 'Speichern'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Admin Login */}
          <TouchableOpacity onPress={() => toggleSection('login')}>
            <Text style={styles.section}>👤 Admin Login</Text>
          </TouchableOpacity>
          {expandedSection === 'login' && (
            <View style={styles.block}>
              <Text>Aktueller Login: {adminLogin}</Text>
              <TextInput
                placeholder="Neuer Login"
                style={styles.input}
                value={loginInput}
                onChangeText={setLoginInput}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.button} onPress={saveNewLogin}>
                <Text style={styles.buttonText}>Speichern</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Passwort ändern */}
          <TouchableOpacity onPress={() => toggleSection('password')}>
            <Text style={styles.section}>🔒 Passwort ändern</Text>
          </TouchableOpacity>
          {expandedSection === 'password' && (
            <View style={styles.block}>
              <TextInput
                placeholder="Aktuelles Passwort"
                style={styles.input}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword((v) => !v)}
              >
                <Text style={{ color: 'blue', marginBottom: 10 }}>
                  {showCurrentPassword ? 'Verstecken' : 'Anzeigen'}
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Neues Passwort"
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword((v) => !v)}>
                <Text style={{ color: 'blue', marginBottom: 10 }}>
                  {showNewPassword ? 'Verstecken' : 'Anzeigen'}
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Neues Passwort bestätigen"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((v) => !v)}
              >
                <Text style={{ color: 'blue', marginBottom: 10 }}>
                  {showConfirmPassword ? 'Verstecken' : 'Anzeigen'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={changePassword}>
                <Text style={styles.buttonText}>Passwort ändern</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: '#2a7ae2',
  },
  block: {
    paddingVertical: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  eventBox: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#e8e8e8',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 8,
    marginVertical: 6,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2a7ae2',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  passwordRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
eye: {
  fontSize: 22,
  paddingHorizontal: 10,
},
});
