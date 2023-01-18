import { useNavigation } from '@react-navigation/native';
import { atom, useAtom } from 'jotai';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button, Divider, Snackbar, Text, TextInput } from 'react-native-paper';
import { showSnackbarRegistration } from '../lib/jotai/atoms';

function LoginScreen() {
  const { navigate } = useNavigation();
  // const [visible, setVisible] = React.useState(true);
  const [visible, setVisible] = useAtom(showSnackbarRegistration);
  return (
    <ScrollView className="flex-1 ">
      <View className="justify-center items-center min-w-full min-h-[92vh] p-4">
        <KeyboardAvoidingView behavior="position" className="flex flex-col w-full space-y-3">
          <TextInput style={{ width: '100%' }} label="Email" left={<TextInput.Icon icon="email-outline" />} />
          <TextInput
            style={{ width: '100%' }}
            label="Heslo"
            secureTextEntry
            left={<TextInput.Icon icon="key-outline" />}
          />
          <Button
            style={{ alignItems: 'flex-end' }}
            compact={true}
            mode="text"
            onPress={() => navigate('Registracia' as never)}
          >
            Zabudol som heslo
          </Button>

          <Button
            style={{ marginTop: 16, minWidth: '100%' }}
            icon="login"
            mode="contained"
            onPress={() => console.log('Pressed')}
          >
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
          <Button style={{ minWidth: '100%' }} icon="google" mode="outlined" onPress={() => console.log('Pressed')}>
            Google
          </Button>
          <Button style={{ minWidth: '100%' }} icon="apple" mode="outlined" onPress={() => console.log('Pressed')}>
            AppleID
          </Button>
        </View>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        duration={3000}
        action={{
          label: 'Zavri',
          onPress: () => {
            // Do something
          },
        }}
      >
        Registracia hotova! Teraz sa môžeš prihlásiť.
      </Snackbar>
    </ScrollView>
  );
}

export default LoginScreen;
