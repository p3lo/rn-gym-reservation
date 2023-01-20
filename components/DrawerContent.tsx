import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAtom } from 'jotai';
import React from 'react';
import { View } from 'react-native';
import { Divider, IconButton, Switch } from 'react-native-paper';
import { drawerAtom, isThemeDarkAtom } from '../lib/jotai/atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

function DrawerContent() {
  const [isThemeDark, setIsThemeDark] = useAtom(isThemeDarkAtom);
  const [drawer] = useAtom(drawerAtom);
  const { getItem, setItem } = useAsyncStorage('isThemeDark');
  async function onToggleSwitch() {
    setIsThemeDark(!isThemeDark);
    await setItem(JSON.stringify(!isThemeDark));
  }
  function test() {
    drawer.closeDrawer();
  }

  return (
    <DrawerContentScrollView>
      <View className="flex-1">
        <View className="flex flex-col p-3 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center ml-5 space-x-5">
              <Switch value={isThemeDark} onValueChange={onToggleSwitch} />
              {isThemeDark ? (
                <Ionicons name="moon-outline" size={24} color="white" />
              ) : (
                <Ionicons name="sunny-outline" size={24} color="black" />
              )}
            </View>
            <IconButton icon="close" size={24} onPress={test} />
          </View>
          <Divider />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default DrawerContent;
