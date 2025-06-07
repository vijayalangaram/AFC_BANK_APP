import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, TextInput, Platform, Clipboard,
  ActivityIndicator, Alert
} from 'react-native';
import SMSRetriever, { SmsListenerEvent } from 'react-native-sms-retriever';
import { verifyOtp, login } from '../api/auth';
import { setAuthToken } from '../utils/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

interface ForgotPasswordScreenProps {
  navigation: any; // Replace with your proper navigation type
}

const OTPValidation: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [otpError, setOtpError] = useState<string>('');
  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const route = useRoute();
  const { loginId, email, password } = route.params as any;
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  const [user, domain] = email.split('@');
  const starmailidcovenver = user.slice(0, 2) + '*'.repeat(user.length - 3) + user.slice(-1) + '@' + domain;

  console.log(starmailidcovenver, email, " loginId, email ");

  // Initialize refs array
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, otp.length);
  }, [otp]);

  // Add this effect to automatically submit when last digit is entered
  useEffect(() => {
    const isComplete = otp.every(digit => digit !== '');
    setIsButtonDisabled(!isComplete);
    setOtpError('');
    // Auto-submit when last digit is entered
    if (isComplete && otp[5] !== '') {
      handleVerifyOtp();
    }
  }, [otp]);



  // Check if OTP is complete
  useEffect(() => {
    const isComplete = otp.every(digit => digit !== '');
    setIsButtonDisabled(!isComplete);
    setOtpError('');
  }, [otp]);

  // Auto-fetch OTP from SMS (Android only)
  useEffect(() => {
    if (Platform.OS === 'android') {
      const listenForOtp = async () => {
        try {
          const registered = await SMSRetriever.startSmsRetriever();
          if (registered) {
            SMSRetriever.addSmsListener((event: SmsListenerEvent) => {
              if (event.message) {
                const extractedOtp = extractOtpFromSms(event.message);
                if (extractedOtp && extractedOtp.length === 6) {
                  const otpArray = extractedOtp.split('');
                  setOtp(otpArray);
                  SMSRetriever.removeSmsListener();
                }
              }
            });
          }
        } catch (error) {
          console.log('Error setting up SMS listener:', error);
        }
      };

      listenForOtp();
      return () => {
        if (Platform.OS === 'android') {
          SMSRetriever.removeSmsListener();
        }
      };
    }
  }, []);

  const extractOtpFromSms = (message: string): string | null => {
    const otpRegex = /\b\d{6}\b/;
    const match = message.match(otpRegex);
    return match ? match[0] : null;
  };

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) { // Only allow numbers
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next only if a single digit is entered
      if (text.length === 1 && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      // Auto focus to next input if a digit was entered
      if (text && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      // Auto focus to previous input if backspace was pressed and current is empty
      if (text === '' && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    // debugger
    try {
      const otpcombine = otp && otp.join('');
      console.log(loginId, email, otpcombine, "loginId, email, otp")
      const res = await verifyOtp(loginId, email, otpcombine);
      console.log(res.data, "res.data")
      if (res.data.success) {
        const token = res.headers.authorization || res.headers.Authorization;
        if (token) {
          await setAuthToken(token);
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'WelcomeScreen' }],
        });
      } else {
        Alert.alert('Invalid OTP', res.data.message || '');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('OTP Error', 'Verification failed.');
    } finally {
      setIsLoading(false); // Stop loading regardless of success/error
    }
  };

  const handleResendOtp = async () => {
    // debugger
    setOtp(['', '', '', '', '', ''])
    try {
      const res = await login(email, password);
      console.log(res, "res123")
      // console.warn("Something looks off!");
      // if (res.data?.success && res.data?.result) {
      //      console.log(res.data, "res123")
      //   navigation.navigate('OTPValidation', {
      //     loginId: res.data.result,
      //     email,
      //     password
      //   });
      // } else { 
      //   Alert.alert('Login failed', res.data.message || 'Unknown error');
      // }
    } catch (err) {
      console.error(err);
      // Alert.alert('Login error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentimagetop}>
        <Image source={require('./images.png')} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.text}>
          We have sent a One-Time Password (OTP){'\n'}
          To your Registered Email Address{'\n'}
          {starmailidcovenver}
        </Text>

        <Text style={styles.text}>
          Please check your inbox and enter the{'\n'}
          OTP to proceed.
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputRefs.current[index] = ref)}
              style={[styles.otpBox, otpError ? styles.otpBoxError : null]}
              value={digit}
              onChangeText={(text: string) => handleOtpChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
              editable={!isLoading}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  otpInputRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        {/* Loading indicator */}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#0071CF"
            style={styles.loader}
          />
        )}

        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendText}>
            Didn't receive the OTP? <Text style={styles.resendLink}>Resend OTP</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        {!isLoading && (
          <TouchableOpacity
            style={[styles.loginButton, isButtonDisabled ? styles.disabledButton : null]}
            onPress={handleVerifyOtp}
            disabled={isButtonDisabled || isLoading}
          >
            <Text style={styles.loginButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10, // Add some spacing 
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentimagetop: {
    padding: 10,
    marginTop: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  resendText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  resendLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpBox: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  otpBoxError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
export default OTPValidation;