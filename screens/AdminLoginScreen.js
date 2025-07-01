import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLoginScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert('Fehler', 'Bitte Login und Passwort eingeben.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://hospiz-app.onrender.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('adminToken', data.token);
        navigation.navigate('AdminDashboard');
      } else {
        Alert.alert('Fehler', data.message || 'Ungültiger Login oder Passwort');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Verbindung zum Server fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Admin Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Login"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Passwort"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={styles.eyeIcon}>
                {passwordVisible ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#6c5ce7" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Einloggen</Text>
            </TouchableOpacity>
          )}
          
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2d3436',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 48,
  },
  eyeIcon: {
    fontSize: 22,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#6c5ce7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  innerContainer: {
  flex: 1,
  justifyContent: 'space-between',
},
privacyLink: {
  alignItems: 'center',
  marginTop: 30,
},
privacyText: {
  color: '#007BFF',
  fontSize: 14,
  textDecorationLine: 'underline',
},
});
