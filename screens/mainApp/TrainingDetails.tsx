import React from 'react';
import { Divider, Text } from 'react-native-paper';
import { View } from 'react-native';
import { Training } from './Home';
import { ScrollView } from 'react-native-gesture-handler';
import TrainingCard from '../../components/TrainingCard';
import { useAtom } from 'jotai';
import { refreshAtom, refreshInsideCardAtom } from '../../lib/jotai/atoms';
import { supabase } from '../../lib/supabase/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';

type PulledUser = {
  member_id: string;
  approved: boolean;
  profiles: {
    first_name: string;
    surname: string;
  };
};

function TrainingDetails({ route, navigation }: { route: any; navigation: any }) {
  const { training, isDark, userId }: { training: Training; isDark: boolean; userId: string } = route.params;
  const [refresh, setRefresh] = useAtom(refreshInsideCardAtom);
  const [refreshMain, setRefreshMain] = useAtom(refreshAtom);
  const [memberInfo, setMemberInfo] = React.useState<PulledUser[]>([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: training?.name,
    });
    getUsersFromDb();
  }, [refresh]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      setRefreshMain(!refresh);
    });

    return unsubscribe;
  }, [navigation]);
  async function getUsersFromDb() {
    const { data, error } = await supabase
      .from('training_slots')
      .select(
        `
        approved,
        member_id,
        profiles (
      first_name, surname
    )`
      )
      .eq('training_id', training?.id);
    if (error) {
      console.log(error);
    }
    if (data) {
      setMemberInfo(data as PulledUser[]);
      console.log(data);
    }
  }
  return (
    <ScrollView className="m-3 flex-1">
      <View className="flex flex-col gap-y-4">
        <TrainingCard training={training} isDark={isDark} userId={userId} />
        <View className="flex flex-col gap-y-2">
          <Text style={{ fontWeight: 'bold', marginHorizontal: 16, marginVertical: 8 }} variant="titleMedium">
            Prihlaseni
          </Text>
          <View
            className={`w-full rounded-md  ${
              isDark ? 'border-gray-400/50 bg-zinc-800' : 'border-gray-600/50 bg-zinc-100'
            }`}
          >
            {memberInfo.length > 0 ? (
              memberInfo.map((member, index) => {
                return (
                  <View key={member.member_id} className="flex flex-col p-3 gap-y-2">
                    {index !== 0 && <Divider />}
                    <View className="flex flex-row gap-x-3 items-center">
                      <Ionicons name="person" size={15} color={`${isDark ? 'gray' : 'darkgray'}`} />
                      {member.approved ? (
                        <Text>{member.profiles?.first_name + ' ' + member.profiles?.surname}</Text>
                      ) : (
                        <Text>{member.profiles?.first_name + ' ' + member.profiles?.surname + ' (nahradnik)'}</Text>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text className="m-4">Zatial nikto</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default TrainingDetails;
