import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAtom } from 'jotai';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, Switch, Text } from 'react-native-paper';
import { drawerAtom, isThemeDarkAtom, refreshAtom, selectedGymAtom } from '../lib/jotai/atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import LogoutButton from './LogoutButton';
import CreateGymButton from './CreateGymButton';
import PickGym from './PickGym';
import { supabase } from '../lib/supabase/supabase';
import { useNavigation } from '@react-navigation/native';

type User = {
  first_name: string;
  surname: string;
  birth_date: string;
  is_admin: boolean;
  is_trainer: boolean;
  gym_members: [
    {
      paid_till: Date;
    }
  ];
};

function DrawerContent({ userId }: { userId: string }) {
  const [isThemeDark, setIsThemeDark] = useAtom(isThemeDarkAtom);
  const [selectedGym, setSelectedGym] = useAtom(selectedGymAtom);
  const [isTrainer, setIsTrainer] = React.useState(false);
  const [drawer] = useAtom(drawerAtom);
  const { getItem, setItem } = useAsyncStorage('isThemeDark');
  const [user, setUser] = React.useState<User>();
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const navigator = useNavigation();

  React.useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          `first_name, surname, birth_date, is_admin, is_trainer,
        gym_members (
          paid_till
          )`
        )
        .eq('id', userId);
      if (data) {
        setUser(data[0] as User);
      }
    }
    getUser();
  }, [, refresh]);

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

  const adminRender = () => {
    if (user?.is_admin || user?.is_trainer) {
      return (
        <>
          <Divider style={{ margin: 16 }} />
          <Text style={{ textAlign: 'center', marginVertical: 15 }} variant="titleMedium">
            Admin menu
          </Text>
          <CreateGymButton userId={userId} />
        </>
      );
    }
  };

  function isFutureDate(date: Date) {
    const today = new Date().toISOString().split('T')[0];
    const givenDate = new Date(date).toISOString().split('T')[0];

    return givenDate >= today;
  }

  function formatDate(givenDate: Date) {
    const date = new Date(givenDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  function daysBetween(date: Date) {
    const today = new Date().toISOString().split('T')[0];
    const givenDate = new Date(date).toISOString().split('T')[0];
    const diff = new Date(givenDate).getTime() - new Date(today).getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    return diffInDays;
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
            <View className="flex flex-col items-center">
              <Text variant="titleLarge">
                {user?.first_name} {user?.surname}
              </Text>
              <Text variant="labelMedium">( {user?.birth_date} )</Text>
              {user?.gym_members[0]?.paid_till && (
                <View className="my-5 flex-col items-center">
                  <Text variant="labelMedium">
                    Permanentka: {isFutureDate(user?.gym_members[0]?.paid_till) ? 'Aktivna' : 'Neaktivna'}
                  </Text>
                  {isFutureDate(user?.gym_members[0]?.paid_till) && (
                    <Text>
                      do {formatDate(user?.gym_members[0]?.paid_till)} (
                      {Math.floor(daysBetween(user?.gym_members[0]?.paid_till))} d.)
                    </Text>
                  )}
                </View>
              )}
            </View>

            {adminRender()}
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
