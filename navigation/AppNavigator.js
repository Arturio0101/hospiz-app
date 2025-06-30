import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ContactScreen from '../screens/ContactScreen';
import WasWirLeistenScreen from '../screens/WasWirLeistenScreen';
import UberUnsScreen from '../screens/UberUnsScreen';
import SpendenFoerdernScreen from '../screens/SpendenFoerdernScreen';
import ServiceScreen from '../screens/ServiceScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import SprechzeitenScreen from '../screens/SprechzeitenScreen';
import PrivacyPolicy from '../screens/PrivacyPolicy';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ title: 'Kalender 2025' }}/>
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Kontakt' }}  />
      <Stack.Screen name="WasWirLeisten" component={WasWirLeistenScreen} options={{ title: 'Was wir leisten' }} />
      <Stack.Screen name="UberUns" component={UberUnsScreen} options={{ title: 'Über uns' }} />
      <Stack.Screen name="SpendenFoerdern" component={SpendenFoerdernScreen} options={{ title: 'Spenden & Fördern' }} />
      <Stack.Screen name="Service" component={ServiceScreen} options={{ title: 'Nutzungsbedingungen' }} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Sprechzeiten" component={SprechzeitenScreen} options={{ title: 'Sprechzeiten' }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: 'Datenschutz' }} />
    </Stack.Navigator>
  );
}
