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
import { authTokenAtom, isThemeDarkAtom } from './lib/jotai/atoms';
import SetUserInfo from './screens/SetUserInfo';
import Home from './screens/mainApp/Home';
global.Buffer = require('buffer').Buffer;

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const Stack = createNativeStackNavigator();

export default function App() {
  // const [isThemeDark, setIsThemeDark] = React.useState(true);
  const [isThemeDark, setIsThemeDark] = useAtom(isThemeDarkAtom);

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
  const [token, setToken] = useAtom(authTokenAtom);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<number>(0);
  const [userId, setUserId] = React.useState<string>('');
  React.useEffect(() => {
    async function isLoggedIn() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setToken(data.session.access_token);
        const getProfile = await supabase.from('profiles').select('id').eq('id', data.session.user.id);
        setProfile(getProfile.data?.length || 0);
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
      {token && profile === 0 && <UserInfo userId={userId} />}
      {token && profile > 0 && <MainApp />}
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
  return (
    <Stack.Navigator>
      <Stack.Screen name="Uzivatel" component={SetUserInfo} initialParams={{ userId: userId }} />
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
