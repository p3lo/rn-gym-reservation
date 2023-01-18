import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  adaptNavigationTheme,
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  withTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { SUPABASE_URL } from '@env';
import merge from 'deepmerge';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isThemeDark, setIsThemeDark] = React.useState(true);

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    <>
      <StatusBar style={theme === CombinedDarkTheme ? 'light' : 'dark'} />
      <PaperProvider theme={theme}>
        <Root theme={theme} />
      </PaperProvider>
    </>
  );
}

function Root({ theme }: { theme: any }) {
  return <Navigation theme={theme} />;
}

function Navigation({ theme }: { theme: any }) {
  return (
    <NavigationContainer theme={theme}>
      <AuthStack />
    </NavigationContainer>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registracia" component={SignupScreen} />
    </Stack.Navigator>
  );
}
