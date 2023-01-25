import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { refreshAtom, selectedGymAtom } from '../../lib/jotai/atoms';
import { supabase } from '../../lib/supabase/supabase';

type WaitingMember = {
  member: string;
  profiles: Profile;
};

type Profile = {
  first_name: string;
  surname: string;
  birth_date: Date;
};

function AdminWaitingForApproval() {
  const selectedGym = useAtomValue(selectedGymAtom);
  const [waitingMembers, setWaitingMembers] = React.useState<WaitingMember[]>([]);
  const [refresh, setRefresh] = useAtom(refreshAtom);
  React.useEffect(() => {
    async function clearNotifications() {
      await supabase
        .from('gym_members')
        .update({ notification: false })
        .eq('gym', selectedGym.id)
        .eq('notification', true);
    }
    async function getNewUsers() {
      const { data } = await supabase
        .from('gym_members')
        .select(
          `member,
        profiles (
          first_name, 
          surname,
          birth_date)`
        )
        .eq('gym', selectedGym.id)
        .eq('is_active', false);
      if (data) {
        setWaitingMembers(data as WaitingMember[]);
      }
    }
    clearNotifications();
    getNewUsers();
  }, []);

  async function handleAcceptDeny(id: string, accept: boolean) {
    if (accept) {
      await supabase.from('gym_members').update({ is_active: true }).eq('member', id);
    } else {
      const { error } = await supabase.from('gym_members').delete().eq('member', id);
      console.log(error);
    }

    setWaitingMembers((prev) => prev.filter((member) => member.member !== id));
    setRefresh((prev) => !prev);
  }

  function formatDate(givenDate: Date) {
    const date = new Date(givenDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  return (
    <ScrollView className="flex-1 ">
      <View className="min-h-[80vh] m-4 ">
        <View className="items-center m-4">
          <Text>Zoznam ziadosti</Text>
        </View>
        <View className="flex flex-col space-y-2">
          {waitingMembers.map((member) => (
            <View key={member.member} className="flex flex-row items-center justify-between">
              <View className="flex flex-col">
                <Text variant="bodyLarge">
                  {member.profiles.first_name} {member.profiles.surname}
                </Text>
                {member.profiles.birth_date && (
                  <Text variant="labelSmall">d.n.: {formatDate(member.profiles.birth_date)}</Text>
                )}
              </View>
              <View className="flex flex-row items-center space-x-2">
                <IconButton
                  icon="check-bold"
                  mode="contained"
                  iconColor="green"
                  onPress={handleAcceptDeny.bind('', member.member, true)}
                />
                <IconButton
                  icon="close-thick"
                  mode="contained"
                  iconColor="red"
                  onPress={handleAcceptDeny.bind('', member.member, false)}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default AdminWaitingForApproval;
