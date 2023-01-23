import { useAtom } from 'jotai';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, useTheme } from 'react-native-paper';
import { drawerAtom, selectedGymAtom } from '../../lib/jotai/atoms';

function Home({ route, navigation }: { route: any; navigation: any }) {
  const { userId } = route.params;
  const [, setDrawer] = useAtom(drawerAtom);
  const [selectedGym, setSelectedGym] = useAtom(selectedGymAtom);

  React.useEffect(() => {
    setDrawer(navigation);
  }, []);
  function openDrawer() {
    navigation.openDrawer();
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={selectedGym ? selectedGym : 'Vyber gym'} />
        <Appbar.Action icon="menu" onPress={openDrawer} />
      </Appbar.Header>
      <Text>Home</Text>
    </>
  );
}

export default Home;
