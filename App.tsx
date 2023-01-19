import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
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
import { supabase } from './lib/supabase/supabase';
import { useAtom } from 'jotai';
import { authToken } from './lib/jotai/atoms';
import SetUserInfo from './screens/SetUserInfo';
global.Buffer = require('buffer').Buffer;

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
  const [token, setToken] = useAtom(authToken);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<number | null>(null);
  const [userId, setUserId] = React.useState<string>('');
  React.useEffect(() => {
    async function isLoggedIn() {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setToken(data.session.access_token);
        const getProfile = await supabase.from('profiles').select('id').eq('id', data.session.user.id);
        setProfile(getProfile.count);
        setUserId(data.session.user.id);
      }
      setIsLoading(false);
    }

    isLoggedIn();
  }, [token]);
  if (isLoading) {
    return <ActivityIndicator animating={true} className="items-center justify-center flex-1" />;
  }
  return (
    <NavigationContainer theme={theme}>
      {token && !profile && <UserInfo userId={userId} />}
      {!token && <AuthStack />}
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

function UserInfo({ userId }: { userId: string }) {
  console.log('🚀 ~ file: App.tsx:97 ~ UserInfo ~ userId', userId);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Uzivatel" component={SetUserInfo} />
    </Stack.Navigator>
  );
}
