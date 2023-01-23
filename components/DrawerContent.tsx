import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAtom } from 'jotai';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, Switch } from 'react-native-paper';
import { drawerAtom, isThemeDarkAtom, selectedGymAtom } from '../lib/jotai/atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import LogoutButton from './LogoutButton';
import CreateGymButton from './CreateGymButton';
import PickGym from './PickGym';
import { supabase } from '../lib/supabase/supabase';
import { useNavigation } from '@react-navigation/native';

function DrawerContent({ userId }: { userId: string }) {
  const [isThemeDark, setIsThemeDark] = useAtom(isThemeDarkAtom);
  const [selectedGym, setSelectedGym] = useAtom(selectedGymAtom);
  const [isTrainer, setIsTrainer] = React.useState(false);
  const [drawer] = useAtom(drawerAtom);
  const { getItem, setItem } = useAsyncStorage('isThemeDark');

  const navigator = useNavigation();

  React.useEffect(() => {
    async function getIsTrainer() {
      if (selectedGym.gym_name) {
        const { data } = await supabase
          .from('gym_trainers')
          .select('*')
          .eq('trainer', userId)
          .eq('gym', selectedGym.id);
        if (data && data?.length > 0) {
          setIsTrainer(true);
        }
      }
    }
    getIsTrainer();
  }, [selectedGym]);

  async function onToggleSwitch() {
    setIsThemeDark(!isThemeDark);
    await setItem(JSON.stringify(!isThemeDark));
  }
  function closeDrawer() {
    drawer.closeDrawer();
  }

  return (
    <DrawerContentScrollView>
      <View className="flex-1">
        <View className="min-h-[90vh] justify-between p-3">
          <View className="flex flex-col space-y-4">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center ml-5 space-x-5">
                <Switch value={isThemeDark} onValueChange={onToggleSwitch} />
                {isThemeDark ? (
                  <Ionicons name="moon-outline" size={24} color="white" />
                ) : (
                  <Ionicons name="sunny-outline" size={24} color="black" />
                )}
              </View>
              <IconButton icon="close" size={24} onPress={closeDrawer} />
            </View>
            <Divider style={{ margin: 16 }} />
            <CreateGymButton userId={userId} />
            {isTrainer && (
              <Button icon="account" mode="contained" onPress={() => navigator.navigate('AdminIndex' as never)}>
                Admin sekcia
              </Button>
            )}
            <PickGym />
          </View>
          <LogoutButton style={style.addMargin} />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default DrawerContent;

const style = StyleSheet.create({
  addMargin: {
    marginLeft: 8,
  },
});
