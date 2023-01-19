import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button, Divider, HelperText, Snackbar, Text, TextInput } from 'react-native-paper';
import { authToken, showSnackbarRegistration } from '../lib/jotai/atoms';
import { googleSignIn, linkedInSignIn, supabase } from '../lib/supabase/supabase';

function LoginScreen(this: any) {
  const { navigate } = useNavigation();
  const [visible, setVisible] = useAtom(showSnackbarRegistration);
  const [, setToken] = useAtom(authToken);
  const [login, setLogin] = React.useState({
    email: '',
    password: '',
  });
  const [wrongCredentials, setWrongCredentials] = React.useState(false);

  function handleLoginInputs(key: keyof typeof login, value: string) {
    setLogin((prev) => ({ ...prev, [key]: value }));
  }

  async function handleEmailLogin() {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: login.email,
      password: login.password,
    });
    if (error) {
      setWrongCredentials(true);
      return;
    }
    if (data.session) {
      setToken(data.session.access_token);
    }
  }

  async function handleGoogleLogin() {
    const token = await googleSignIn();
    if (token) {
      setToken(token);
    }
  }

  async function handleLinkedinLogin() {
    const token = await linkedInSignIn();
    if (token) {
      setToken(token);
    }
  }

  return (
    <ScrollView className="flex-1 ">
      <View className="justify-center items-center min-w-full min-h-[92vh] p-4">
        <KeyboardAvoidingView behavior="position" className="flex flex-col w-full space-y-3">
          <TextInput
            style={{ width: '100%' }}
            autoCapitalize="none"
            autoCorrect={false}
            label="Email"
            left={<TextInput.Icon icon="email-outline" />}
            onChangeText={handleLoginInputs.bind(this, 'email')}
            value={login.email}
          />
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={{ width: '100%' }}
              label="Heslo"
              secureTextEntry
              left={<TextInput.Icon icon="key-outline" />}
              onChangeText={handleLoginInputs.bind(this, 'password')}
              value={login.password}
            />
            <View className="flex flex-row items-center justify-between">
              <HelperText type="error" visible={wrongCredentials}>
                Zly email alebo heslo
              </HelperText>
              <Button
                style={{ alignItems: 'flex-end' }}
                compact={true}
                mode="text"
                onPress={() => navigate('Registracia' as never)}
              >
                Zabudol som heslo
              </Button>
            </View>
          </View>

          <Button style={{ marginTop: 16, minWidth: '100%' }} icon="login" mode="contained" onPress={handleEmailLogin}>
            Login
          </Button>
          <View className="flex flex-row items-center justify-center">
            <Text style={{ opacity: 0.5 }} variant="titleSmall">
              Nemas konto?
            </Text>
            <Button
              compact={true}
              style={{ alignItems: 'center' }}
              mode="text"
              onPress={() => navigate('Registracia' as never)}
            >
              Registruj sa
            </Button>
          </View>
        </KeyboardAvoidingView>
        <Divider style={{ marginVertical: 32, width: '100%' }} />
        <View className="flex flex-col items-center w-full space-y-3">
          <Text style={{ opacity: 0.5 }} variant="titleSmall">
            Alebo sa logni
          </Text>
          <Button style={{ minWidth: '100%' }} icon="google" mode="outlined" onPress={handleGoogleLogin}>
            Google
          </Button>
          <Button style={{ minWidth: '100%' }} icon="linkedin" mode="outlined" onPress={handleLinkedinLogin}>
            LinkedIN
          </Button>
        </View>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        duration={5000}
        action={{
          label: 'Zavri',
          onPress: () => {
            // Do something
          },
        }}
      >
        Overovaci email bol poslany.
      </Snackbar>
    </ScrollView>
  );
}

export default LoginScreen;
