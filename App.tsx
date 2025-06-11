import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import PortfolioScreen from './src/screens/WelcomeScreen';
import OTPValidation from './src/screens/OTPValidation';
import CustomDrawer from './src/components/CustomDrawer';
import SummaryScreen from './src/screens/SummaryScreen';
import Instructions from './src/screens/InstructionsScreen';
import StatementScreen from './src/screens/StatementScreen';
import PasswordRetypePassword from "./src/screens/PasswordRetypePassword"
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { navigationRef } from './src/api/axios'; // Import the ref from axios config

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainDrawer() {
  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Portfolio" component={PortfolioScreen} />
        <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        <Stack.Screen name="Instructions" component={Instructions} />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  image: {
    width: 20,
    height: 13,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
          <Stack.Screen name="WelcomeScreen" component={MainDrawer} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          {/* <Stack.Screen name="WelcomeScreen" component={PortfolioScreen} options={{ headerShown: false }} /> */}
          <Stack.Screen name="OTPValidation" component={OTPValidation} />
          <Stack.Screen name="Instructions" component={MainDrawer} />
          <Stack.Screen name="Statement" component={StatementScreen} />
          <Stack.Screen name="PasswordRetypePassword" component={PasswordRetypePassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default App;