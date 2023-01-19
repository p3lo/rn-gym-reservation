import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, HelperText, TextInput } from 'react-native-paper';
import { z, ZodIssue } from 'zod';
import { showSnackbarRegistrationAtom } from '../lib/jotai/atoms';
import { useAtom } from 'jotai';
import { supabase } from '../lib/supabase/supabase';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  passwordRepeat: z.string().min(6),
});

type SignupForm = z.infer<typeof SignupSchema>;

function SignupScreen(this: any) {
  const navigator = useNavigation();
  const [, setVisible] = useAtom(showSnackbarRegistrationAtom);
  const [regForm, setRegForm] = React.useState<SignupForm>({
    email: '',
    password: '',
    passwordRepeat: '',
  });
  const [errorZod, setErrorZod] = React.useState<ZodIssue[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  function handleFormChange(key: keyof SignupForm, value: string) {
    setRegForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setErrorZod(null);
    if (regForm.password !== regForm.passwordRepeat) {
      setErrorZod([
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
        setErrorZod(error.issues);
        return;
      }
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regForm.email,
      password: regForm.password,
    });

    if (error) {
      Alert.alert(error.message);
      return;
    }
    setIsLoading(false);
    setVisible(true);
    navigator.goBack();
  }

  function hasError(what: keyof SignupForm) {
    if (errorZod) {
      return errorZod.find((e) => e.path[0] === what) ? true : false;
    }
    return false;
  }

  if (isLoading) {
    return <ActivityIndicator animating={true} className="items-center justify-center flex-1" />;
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
                autoCapitalize="none"
                autoCorrect={false}
              />
              <HelperText type="error" visible={hasError('email')}>
                Neplatna email adresa
              </HelperText>
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
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
                autoCapitalize="none"
                autoCorrect={false}
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
