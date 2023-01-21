import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  adaptNavigationTheme,
  Button,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  Text,
  withTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import merge from 'deepmerge';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { supabase } from './lib/supabase/supabase';
import { useAtom } from 'jotai';
import { authTokenAtom, drawerAtom, isLoginAtom, isThemeDarkAtom, profileAtom } from './lib/jotai/atoms';
import SetUserInfo from './screens/SetUserInfo';
import Home from './screens/mainApp/Home';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import DrawerContent from './components/DrawerContent';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
global.Buffer = require('buffer').Buffer;

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isThemeDark, setIsThemeDark] = useAtom(isThemeDarkAtom);
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  const { getItem, setItem } = useAsyncStorage('isThemeDark');
  React.useEffect(() => {
    async function getTheme() {
      const getIsDark = await getItem();
      if (getIsDark) {
        setIsThemeDark(JSON.parse(getIsDark));
      }
    }
    getTheme();
  }, []);
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
  const [isLoading, setIsLoading] = useAtom(isLoginAtom);
  const [profile, setProfile] = useAtom(profileAtom);
  const [userId, setUserId] = React.useState<string>('');
  React.useEffect(() => {
    async function isLoggedIn() {
      setIsLoading(true);
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
    return <ActivityIndicator animating={true} theme={theme} className="items-center justify-center flex-1" />;
  }
  return (
    <NavigationContainer theme={theme}>
      {token && profile === 0 && <UserInfo userId={userId} />}
      {token && profile > 0 && <MainAppDrawer userId={userId} />}
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

function MainApp({ navigation, route }: { navigation: any; route: any }) {
  const { userId } = route.params;
  const [, setDrawer] = useAtom(drawerAtom);
  React.useEffect(() => {
    setDrawer(navigation);
  }, []);
  function openDrawer() {
    navigation.openDrawer();
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Home}
        options={{ headerRight: () => <IconButton icon="menu" size={20} onPress={openDrawer} /> }}
        initialParams={{ userId: userId }}
      />
    </Stack.Navigator>
  );
}

function MainAppDrawer({ userId }: { userId: string }) {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerContent userId={userId} />}
      screenOptions={{ drawerPosition: 'right' }}
    >
      <Drawer.Screen
        name="Home"
        component={MainApp}
        options={{ headerShown: false }}
        initialParams={{ userId: userId }}
      />
    </Drawer.Navigator>
  );
}

// function DrawerContent() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Drawer content</Text>
//     </View>
//   );
// }
