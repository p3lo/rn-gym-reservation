import { useTheme } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Badge, Button, Text } from 'react-native-paper';
import { selectedGymAtom } from '../../lib/jotai/atoms';
import { supabase } from '../../lib/supabase/supabase';

function AdminIndex({ route, navigation }: { route: any; navigation: any }) {
  const theme = useTheme();
  const selectedGym = useAtomValue(selectedGymAtom);
  const [notifications, setNotifications] = React.useState(0);

  React.useEffect(() => {
    async function getNewUsers() {
      const { count, error } = await supabase
        .from('gym_members')
        .select('*', { count: 'exact', head: true })
        .eq('gym', selectedGym.id)
        .eq('notification', true);
      if (count) {
        setNotifications(count);
      }
    }

    getNewUsers();
  }, []);

  function handleApproval() {
    navigation.navigate('AdminWFA');
    setNotifications(0);
  }

  return (
    <>
      <ScrollView className="flex-1 ">
        <View className="items-center min-h-[80vh] m-4 flex flex-col space-y-4 ">
          <View className="relative">
            <Button style={{ minWidth: '100%' }} mode="contained-tonal" onPress={handleApproval}>
              Cakajuci na schvalenie
            </Button>
            {notifications > 0 && <Badge className="absolute">{notifications}</Badge>}
          </View>
          <Button
            style={{ minWidth: '100%' }}
            mode="contained-tonal"
            onPress={() => navigation.navigate('AdminMembersList')}
          >
            Zoznam clenov
          </Button>
          <Button
            style={{ minWidth: '100%' }}
            mode="contained-tonal"
            onPress={() => navigation.navigate('AdminAddTraining')}
          >
            Pridat trening
          </Button>
          <Button
            style={{ minWidth: '100%' }}
            mode="contained-tonal"
            onPress={() => navigation.navigate('AdminListTrainings')}
          >
            Upravit trening
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

export default AdminIndex;
