import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon-main.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
