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
import {
  View,
  Text,
  FlatList,
  StyleSheet, Image
} from 'react-native';

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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Login" component={MainDrawer} /> */}
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="WelcomeScreen" component={MainDrawer} />
          {/* <Stack.Screen name="WelcomeScreen" component={PortfolioScreen} options={{ headerShown: false }} /> */}
          <Stack.Screen name="OTPValidation" component={OTPValidation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

    // <NavigationContainer>
    //   <SafeAreaView style={{ flex: 1 }}>
    //     <Stack.Navigator initialRouteName="Login">
    //       <Stack.Screen
    //         name="Login"
    //         component={LoginScreen}
    //         options={{ headerShown: false }}
    //       />
    //       <Stack.Screen
    //         name="ForgotPassword"
    //         component={ForgotPasswordScreen}
    //         options={{
    //           title: 'Forgot Password',
    //           headerStyle: {
    //             backgroundColor: '#00205B',
    //           },
    //           headerTintColor: '#fff',
    //         }}
    //       />
    //       <Stack.Screen name="WelcomeScreen" component={PortfolioScreen}  options={{ headerShown: false }} />
    //       <Stack.Screen name="OTPValidation" component={OTPValidation} options={{ headerShown: false }} />
    //     </Stack.Navigator>
    //   </SafeAreaView>
    // </NavigationContainer>
  );
};
export default App;