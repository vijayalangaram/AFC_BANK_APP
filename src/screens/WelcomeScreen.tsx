
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {

  const navigation = useNavigation();

return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>🎉AFC🎉</Text>
      <Text style={styles.description}>You have successfully logged in.</Text>
    </SafeAreaView>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00205B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
  },
});

export default WelcomeScreen; 