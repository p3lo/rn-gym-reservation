import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAtom } from 'jotai';
import React from 'react';
import { View } from 'react-native';
import { Divider, Switch } from 'react-native-paper';
import { isThemeDarkAtom } from '../lib/jotai/atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

function DrawerContent(props) {
  const [isThemeDark, setIsThemeDark] = useAtom(isThemeDarkAtom);
  const { getItem, setItem } = useAsyncStorage('isThemeDark');
  async function onToggleSwitch() {
    setIsThemeDark(!isThemeDark);
    await setItem(JSON.stringify(!isThemeDark));
  }

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-1">
        <View className="flex flex-col p-3 space-y-4">
          <View className="flex flex-row items-center justify-center space-x-5">
            <Switch value={isThemeDark} onValueChange={onToggleSwitch} />
            {isThemeDark ? (
              <Ionicons name="moon-outline" size={24} color="white" />
            ) : (
              <Ionicons name="sunny-outline" size={24} color="black" />
            )}
          </View>
          <Divider />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default DrawerContent;
