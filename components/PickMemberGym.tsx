import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import { useAtom } from 'jotai';
import { drawerAtom, selectedGymAtom } from '../lib/jotai/atoms';

function PickMemberGym() {
  const [selectedGym, setSelectedGym] = React.useState();
  const [, setGym] = useAtom(selectedGymAtom);
  const [visible, setVisible] = React.useState(false);
  const [drawer] = useAtom(drawerAtom);
  const theme = useTheme();

  function showDialog() {
    setVisible(true);
    drawer.closeDrawer();
  }
  function hideDialog() {
    setGym(selectedGym);
    setVisible(false);
  }

  return (
    <>
      <Button style={{ minWidth: '100%' }} icon="card-plus-outline" mode="contained" onPress={showDialog}>
        Vyber gym
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Picker
            style={{ color: theme.colors.primaryContainer }}
            selectedValue={selectedGym}
            onValueChange={(itemValue, itemIndex) => setSelectedGym(itemValue)}
          >
            <Picker.Item style={{ color: 'white' }} label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="Java" value="java1" />
            <Picker.Item label="JavaScript" value="js1" />
            <Picker.Item label="Java" value="java2" />
            <Picker.Item label="JavaScript" value="js2" />
          </Picker>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Hotovo</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default PickMemberGym;
