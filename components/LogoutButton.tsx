import { useAtom } from 'jotai';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { authTokenAtom } from '../lib/jotai/atoms';
import { supabase } from '../lib/supabase/supabase';

function LogoutButton({ style }) {
  const [token, setToken] = useAtom(authTokenAtom);
  async function handleLogout() {
    let { error } = await supabase.auth.signOut();
    if (!error) {
      setToken('');
    }
  }
  return (
    <Button
      style={[{ minWidth: '100%', position: 'absolute', bottom: '0%' }, style]}
      icon="logout"
      mode="outlined"
      onPress={handleLogout}
    >
      Odlogovat
    </Button>
  );
}

export default LogoutButton;
