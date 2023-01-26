import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { useAtom } from 'jotai';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Appbar, Button, IconButton, Text } from 'react-native-paper';
import { drawerAtom, refreshAtom, selectedGymAtom, showGymPickerAtom } from '../../lib/jotai/atoms';
import { supabase } from '../../lib/supabase/supabase';

type MemberInfo = {
  id: number;
  member: string;
  gym: number;
  is_active: boolean;
  paid_till: Date;
} | null;

function Home({ route, navigation }: { route: any; navigation: any }) {
  const { userId } = route.params;
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [selectedGym, setSelectedGym] = useAtom(selectedGymAtom);
  const [visiblePicker, setVisiblePicker] = useAtom(showGymPickerAtom);
  const [isLoading, setIsLoading] = React.useState(true);
  const { getItem } = useAsyncStorage('selectedGym');
  const [getMemberInfo, setMemberInfo] = React.useState<MemberInfo>(null);
  const [refresh, setRefresh] = useAtom(refreshAtom);

  React.useEffect(() => {
    navigation.setOptions({
      title: 'Vyber gym',
      headerRight: () => <IconButton icon="menu" size={20} onPress={openDrawer} />,
      headerLeft: () => <IconButton icon="select" size={20} onPress={() => setVisiblePicker(true)} />,
    });
    setDrawer(navigation);
    async function fetchGymGlobal() {
      const item = await getItem();
      if (item) {
        setSelectedGym(JSON.parse(item));
        navigation.setOptions({ title: JSON.parse(item).gym_name });
      }
    }
    fetchGymGlobal();
  }, []);

  React.useEffect(() => {
    async function getGymMember() {
      setIsLoading(true);
      if (selectedGym.gym_name) {
        const { data, error } = await supabase
          .from('gym_members')
          .select('*')
          .eq('gym', selectedGym.id)
          .eq('member', userId);
        if (data) {
          setMemberInfo(data[0]);
        }
      }
      setIsLoading(false);
    }
    getGymMember();
  }, [, selectedGym, refresh]);

  React.useEffect(() => {
    async function getTrainings() {
      const today = new Date();
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const { data, error } = await supabase

        .from('trainings')
        .select('*')
        .eq('gym_id', selectedGym.id)
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', future.toISOString().slice(0, 10))
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      console.log('🚀 ~ file: Home.tsx:76 ~ getTrainings ~ data', data);
      console.log('🚀 ~ file: Home.tsx:69 ~ getTrainings ~ error', error);
    }
    if (getMemberInfo?.is_active) {
      getTrainings();
    }
  }, [, getMemberInfo?.is_active, refresh]);

  function openDrawer() {
    navigation.openDrawer();
  }

  async function requestAccess() {
    setIsLoading(true);
    const { error } = await supabase.from('gym_members').upsert({
      member: userId,
      gym: selectedGym.id,
    });

    setRefresh(!refresh);
    setIsLoading(false);
  }

  if (isLoading) {
    return <ActivityIndicator animating={true} className="items-center justify-center flex-1" />;
  }

  return (
    <>
      {!selectedGym.gym_name && (
        <View className="items-center justify-center flex-1">
          <Text variant="headlineMedium">Vyber svoj gym</Text>
        </View>
      )}
      {selectedGym.gym_name && !getMemberInfo ? (
        <View className="flex-col items-center justify-center flex-1 space-y-10">
          <Text variant="titleLarge">Nie si clenom tohto gymu</Text>
          <Button mode="contained" onPress={requestAccess}>
            Poziadaj o pristup
          </Button>
        </View>
      ) : (
        getMemberInfo?.is_active === false && (
          <View className="flex-col items-center justify-center flex-1 space-y-10">
            <Text variant="titleLarge">Caka sa na schvalenie</Text>
            <Button disabled mode="contained" onPress={() => console.log('kkt')}>
              Ziadost bola poslana
            </Button>
          </View>
        )
      )}
    </>
  );
}

export default Home;
