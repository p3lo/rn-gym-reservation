import { useAtom } from 'jotai';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { authToken } from '../lib/jotai/atoms';
import { supabase } from '../lib/supabase/supabase';

function SetUserInfo() {
  const [token, setToken] = useAtom(authToken);

  React.useEffect(() => {
    async function isLoggedIn() {
      const { data, error } = await supabase.auth.getUser(token);
      console.log(JSON.stringify(data, null, 2));
    }
    isLoggedIn();
  }, []);

  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (!error) {
      setToken('');
    }
  }
  return (
    <View className="items-center justify-center flex-1 p-4">
      <Button style={{ minWidth: '100%' }} icon="logout" mode="contained" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
}

export default SetUserInfo;
