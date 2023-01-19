import { useAtom } from 'jotai';
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { z, ZodIssue } from 'zod';
import { authTokenAtom } from '../lib/jotai/atoms';
import { supabase } from '../lib/supabase/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserInfoSchema = z.object({
  firstName: z.string().min(2),
  surname: z.string().min(2),
  birthDate: z.date(),
});

type UserInfoForm = z.infer<typeof UserInfoSchema>;

function SetUserInfo(this: any, { route }) {
  const { userId } = route.params;

  const [token, setToken] = useAtom(authTokenAtom);
  const [errorZod, setErrorZod] = React.useState<ZodIssue[] | null>(null);
  const [userInfo, setUserInfo] = React.useState<UserInfoForm>({
    firstName: '',
    surname: '',
    birthDate: new Date(),
  });
  const [show, setShow] = React.useState(false);

  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (!error) {
      setToken('');
    }
  }

  function handleFormChange(key: keyof UserInfoForm, value: string) {
    setUserInfo((prev) => ({ ...prev, [key]: value }));
  }

  function setDate(event: any, date: any) {
    setShow(false);
    setUserInfo((prev) => ({ ...prev, birthDate: date }));
  }

  async function handleSubmit() {
    setErrorZod(null);
    try {
      UserInfoSchema.parse(userInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorZod(error.issues);
        return;
      }
    }
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      first_name: userInfo.firstName,
      surname: userInfo.surname,
      birth_date: userInfo.birthDate,
    });
    console.log(error);
  }

  function hasError(what: keyof UserInfoForm) {
    if (errorZod) {
      return errorZod.find((e) => e.path[0] === what) ? true : false;
    }
    return false;
  }

  return (
    <ScrollView className="flex-1 ">
      <View className="items-center justify-center flex-1 p-4 min-h-[88vh]">
        <KeyboardAvoidingView behavior="position" className="flex flex-col w-full">
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={userInfo.birthDate}
              mode="date"
              is24Hour={true}
              onChange={setDate}
              maximumDate={new Date()}
            />
          )}
          <View>
            <TextInput
              style={{ width: '100%' }}
              label="Meno"
              left={<TextInput.Icon icon="alpha-m-circle-outline" />}
              onChangeText={handleFormChange.bind(this, 'firstName')}
              value={userInfo.firstName}
            />
            <HelperText type="error" visible={hasError('firstName')}>
              Prilis kratke meno
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ width: '100%' }}
              label="Priezvisko"
              left={<TextInput.Icon icon="alpha-p-circle-outline" />}
              onChangeText={handleFormChange.bind(this, 'surname')}
              value={userInfo.surname}
            />
            <HelperText type="error" visible={hasError('surname')}>
              Prilis kratke priezvisko
            </HelperText>
          </View>
          <View>
            <Pressable onPress={() => setShow(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={{ width: '100%' }}
                  autoCorrect={false}
                  label="Datum narodenia"
                  left={<TextInput.Icon icon="calendar-account-outline" />}
                  value={userInfo.birthDate.toISOString().split('T')[0]}
                  showSoftInputOnFocus={false}
                />
              </View>
            </Pressable>
            <HelperText type="error" visible={hasError('birthDate')}>
              Zly datum narodenia
            </HelperText>
          </View>
          <Button
            style={{ minWidth: '100%', marginTop: 16 }}
            icon="comment-edit-outline"
            mode="contained"
            onPress={handleSubmit}
          >
            Ulozit
          </Button>
        </KeyboardAvoidingView>
        <Button
          style={{ minWidth: '100%', position: 'absolute', bottom: '0%' }}
          icon="logout"
          mode="outlined"
          onPress={handleLogout}
        >
          Odlogovat
        </Button>
      </View>
    </ScrollView>
  );
}

export default SetUserInfo;
