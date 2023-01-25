import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { isThemeDarkAtom, refreshAtom, selectedGymAtom } from '../../lib/jotai/atoms';
import { supabase } from '../../lib/supabase/supabase';

type Member = {
  member: string;
  profiles: Profile;
};

type Profile = {
  first_name: string;
  surname: string;
  birth_date: string;
};

function AdminMembersList() {
  const selectedGym = useAtomValue(selectedGymAtom);
  const isThemeDark = useAtomValue(isThemeDarkAtom);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [membersCount, setMembersCount] = React.useState<number>(0);
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const navigator = useNavigation();
  React.useEffect(() => {
    async function getMembers() {
      const { data, count } = await supabase
        .from('gym_members')
        .select(
          `member,
        profiles (
          first_name,
          surname,
          birth_date)`,
          { count: 'exact' }
        )
        .eq('gym', selectedGym.id)
        .eq('is_active', true);

      if (data) {
        setMembers(data as Member[]);
      }
      if (count) {
        setMembersCount(count);
      } else {
        setMembersCount(0);
      }
    }
    getMembers();
  }, [, refresh]);

  const handleMemberPress = (id: string) => {
    navigator.navigate('AdminMember' as never, { userId: id } as never);
  };

  return (
    <ScrollView className="flex-1">
      <View className="min-h-[86vh] m-4 ">
        <Text variant="titleLarge" className="text-center p-3">
          Pocet clenov: {membersCount}
        </Text>
        {members.map((member, index) => (
          <View key={member.member} className="flex-row flex items-center space-y-2">
            <TouchableRipple
              className={`w-full p-4 border-[0.5px] ${isThemeDark ? 'border-gray-100' : 'border-gray-800'}`}
              onPress={handleMemberPress.bind(null, member.member)}
              rippleColor={isThemeDark ? '#5f5f5f' : '#5c5c5c'}
            >
              <Text>
                {index + 1}. {member.profiles.first_name} {member.profiles.surname}
              </Text>
            </TouchableRipple>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default AdminMembersList;
