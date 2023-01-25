import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useAtom } from 'jotai';
import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text } from 'react-native-paper';
import { selectedGymAtom, showGymPickerAtom } from '../lib/jotai/atoms';
import { supabase } from '../lib/supabase/supabase';

function PickGym() {
  const [selectedGym, setSelectedGym] = useAtom(selectedGymAtom);
  const [visiblePicker, setVisiblePicker] = useAtom(showGymPickerAtom);
  const [value, setValue] = React.useState('');
  const [gyms, setGyms] = React.useState<any[] | null>([]);
  const { getItem, setItem } = useAsyncStorage('selectedGym');

  React.useLayoutEffect(() => {
    async function fetchGyms() {
      const { data } = await supabase.from('gyms').select('id,gym_name').order('gym_name', { ascending: true });
      setGyms(data);
      const item = await getItem();
      if (item) {
        setValue(JSON.parse(item).gym_name);
      }
    }
    fetchGyms();
  }, []);

  // React.useEffect(() => {
  //   setValue(selectedGym.gym_name || '');
  //   console.log(selectedGym.gym_name);
  // }, []);

  const hideDialogPicker = () => setVisiblePicker(false);

  function confirm() {
    setSelectedGym(gyms?.filter((gym) => gym.gym_name === value)[0]);
    setItem(JSON.stringify(gyms?.filter((gym) => gym.gym_name === value)[0]));
    hideDialogPicker();
  }
  return (
    <Portal>
      <Dialog visible={visiblePicker} onDismiss={hideDialogPicker}>
        <Dialog.Title>Vyber gym</Dialog.Title>
        <Dialog.ScrollArea className="max-h-[50vh]">
          <ScrollView>
            <RadioButton.Group onValueChange={(newValue) => setValue(newValue)} value={value}>
              {gyms && gyms?.length === 0 ? (
                <Text className="m-5">Nie su vytvorene ziadne gymy</Text>
              ) : (
                gyms?.map((gym) => <RadioButton.Item key={gym.id} label={gym.gym_name} value={gym.gym_name} />)
              )}
            </RadioButton.Group>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          {gyms?.length === 0 ? (
            <Button onPress={hideDialogPicker}>Zrusit</Button>
          ) : (
            <Button onPress={confirm}>Potvrd vyber</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default PickGym;
