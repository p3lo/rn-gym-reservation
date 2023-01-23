import { useAtom } from 'jotai';
import React from 'react';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { drawerAtom, isLoadingAtom } from '../lib/jotai/atoms';
import { supabase } from '../lib/supabase/supabase';

function CreateGymButton({ userId }: { userId: string }) {
  const [visible, setVisible] = React.useState(false);
  const [drawer] = useAtom(drawerAtom);
  const [gymName, setGymName] = React.useState('');
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  function showDialog() {
    setVisible(true);
    drawer.closeDrawer();
  }
  function hideDialog() {
    setVisible(false);
    setGymName('');
  }

  async function handleCreateGym() {
    setVisible(false);
    setIsLoading(true);
    const { error } = await supabase.from('gyms').insert({ gym_name: gymName, created_by: userId });
    console.log('🚀 ~ file: CreateGymButton.tsx:24 ~ handleCreateGym ~ error', error);
    setIsLoading(false);
    setGymName('');
  }
  return (
    <>
      <Button style={{ minWidth: '100%' }} icon="card-plus-outline" mode="contained" onPress={showDialog}>
        Zalozit gym
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Novy gym</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{ width: '100%', marginVertical: 16 }}
              label="Nazov gymu"
              onChangeText={setGymName}
              value={gymName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCreateGym}>Zalozit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default CreateGymButton;
