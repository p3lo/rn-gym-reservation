import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { z, ZodIssue } from 'zod';
import { showSnackbarRegistration } from '../lib/jotai/atoms';
import { useAtom } from 'jotai';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  passwordRepeat: z.string().min(6),
});

type SignupForm = z.infer<typeof SignupSchema>;

function SignupScreen(this: any) {
  const navigator = useNavigation();
  const [, setVisible] = useAtom(showSnackbarRegistration);
  const [regForm, setRegForm] = React.useState<SignupForm>({
    email: '',
    password: '',
    passwordRepeat: '',
  });
  const [error, setError] = React.useState<ZodIssue[] | null>(null);

  function handleFormChange(key: keyof SignupForm, value: string) {
    setRegForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    setError(null);
    if (regForm.password !== regForm.passwordRepeat) {
      setError([
        {
          code: 'invalid_literal',
          path: ['passwordRepeat'],
          message: 'Hesla sa nezhoduju',
          expected: 'passwords_not_match',
        },
      ]);
      return;
    }
    try {
      SignupSchema.parse(regForm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.issues);
      }
    }
    setVisible(true);
    navigator.goBack();
  }

  function hasError(what: keyof SignupForm) {
    if (error) {
      return error.find((e) => e.path[0] === what) ? true : false;
    }
    return false;
  }

  return (
    <ScrollView className="flex-1 ">
      <View className="justify-center items-center min-w-full min-h-[92vh] p-4">
        <KeyboardAvoidingView behavior="position" className="flex flex-col w-full space-y-10">
          <View className="flex flex-col">
            <View>
              <TextInput
                style={{ width: '100%' }}
                label="Email"
                left={<TextInput.Icon icon="email-outline" />}
                onChangeText={handleFormChange.bind(this, 'email')}
                value={regForm.email}
              />
              <HelperText type="error" visible={hasError('email')}>
                Neplatna email adresa
              </HelperText>
            </View>
            <View>
              <TextInput
                style={{ width: '100%' }}
                label="Heslo"
                secureTextEntry
                left={<TextInput.Icon icon="key-outline" />}
                onChangeText={handleFormChange.bind(this, 'password')}
                value={regForm.password}
              />
              <HelperText type="error" visible={hasError('password')}>
                Kratke heslo! (aspon 6 znakov)
              </HelperText>
            </View>
            <View>
              <TextInput
                style={{ width: '100%' }}
                label="Zopakuj heslo"
                secureTextEntry
                left={<TextInput.Icon icon="key-outline" />}
                onChangeText={handleFormChange.bind(this, 'passwordRepeat')}
                value={regForm.passwordRepeat}
              />
              <HelperText type="error" visible={hasError('passwordRepeat')}>
                Kratke heslo alebo hesla sa nezhoduju
              </HelperText>
            </View>
          </View>
          <Button style={{ marginTop: 32, minWidth: '100%' }} icon="login" mode="contained" onPress={handleSubmit}>
            Registracia
          </Button>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}

export default SignupScreen;
