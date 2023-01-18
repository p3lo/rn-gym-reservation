import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';

function LoginScreen() {
  const { navigate } = useNavigation();
  return (
    <ScrollView className="flex-1 ">
      <KeyboardAvoidingView behavior="position" className="min-w-full min-h-full ">
        <View className="flex items-center justify-center min-w-full min-h-full p-4">
          <View className="flex-col w-full space-y-3">
            <TextInput style={{ width: '100%' }} label="Email" left={<TextInput.Icon icon="email-outline" />} />
            <TextInput
              style={{ width: '100%' }}
              label="Heslo"
              secureTextEntry
              left={<TextInput.Icon icon="key-outline" />}
            />
            <Button style={{ alignItems: 'flex-end' }} mode="text" onPress={() => navigate('Signup' as never)}>
              Registracia
            </Button>
          </View>
          <Button
            style={{ marginTop: 16, minWidth: '100%' }}
            icon="login"
            mode="contained"
            onPress={() => console.log('Pressed')}
          >
            Login
          </Button>
          <Divider style={{ marginVertical: 32, width: '100%' }} />
          <View className="flex-col items-center w-full space-y-3">
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
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default LoginScreen;
