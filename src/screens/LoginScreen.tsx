
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('nnamdi.l@abc.com');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricAttempted, setBiometricAttempted] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    if (isBiometricSupported && !biometricAttempted) {
      handleFaceIdLogin();
    }
  }, [isBiometricSupported, biometricAttempted]);

  const checkBiometricSupport = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (available && (biometryType === 'FaceID' || biometryType === 'Biometrics')) {
        setIsBiometricSupported(true);
      }
    } catch (error) {
      console.log('Biometric check error:', error);
    }
  };

  const handleLogin = () => {
    // Your login logic here
    navigation.navigate('WelcomeScreen');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFaceIdLogin = async () => {
    setBiometricAttempted(true);
    const rnBiometrics = new ReactNativeBiometrics();

    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to login',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        Alert.alert('Success', 'Authentication successful!');
        // Proceed with your login logic
      }
    } catch (error) {
      console.log('Biometric error:', error);
      // Don't show alert for automatic attempts to avoid annoying users
      if (biometricAttempted) {
        Alert.alert('Error', 'Authentication failed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentimagetop}>
        <Image source={require('./images.png')} style={styles.image} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerContainerWelcome}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitle}>Please enter your details to login.</Text>
        </View>

        <Text style={styles.label}>Email Address*</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password*</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="***********"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={toggleShowPassword}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? '👁\u0336' : '👁'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Below your passwordContainer */}
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setRememberDevice(!rememberDevice)}
          >
            {rememberDevice ? (
              <Text style={styles.checkboxChecked}>✓</Text>
            ) : (
              <Text style={styles.checkboxUnchecked}>□</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.checkboxLabel}>Remember this device</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {isBiometricSupported && (
          <>
            <Text style={styles.orText}>or login using</Text>
            <TouchableOpacity
              onPress={handleFaceIdLogin}
              style={styles.biometricButton}
            >
              <Image source={require('./faceid.png')} style={styles.biometricImage} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainerWelcome: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
  },
  image: {
    width: 200,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  content: {
    backgroundColor: '#00205B',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingTop: 40,
    marginBottom: 10,
    flex: 0,
    height: '75%',
  },
  contentimagetop: {
    padding: 10,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
  },
  eyeIcon: {
    fontSize: 20,
    lineHeight: 24, // Helps with vertical alignment
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    fontSize: 14,
    color: '#fff',
  },
  checkboxUnchecked: {
    fontSize: 14,
    color: 'transparent',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  orText: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  biometricButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  biometricImage: {
    // width: 50,
    //  height: 50,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default LoginScreen; 