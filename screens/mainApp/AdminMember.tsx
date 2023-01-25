import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import { supabase } from '../../lib/supabase/supabase';
import { useAtom } from 'jotai';
import { refreshAtom } from '../../lib/jotai/atoms';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Member = {
  member: string;
  is_active: boolean;
  joined_at: Date;
  paid_till: Date;
  profiles: Profile;
};

type Profile = {
  first_name: string;
  surname: string;
  birth_date: Date;
};

function AdminMember({ navigation, route }: { navigation: any; route: any }) {
  const { userId } = route.params;
  const [member, setMember] = React.useState<Member>();
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const [show, setShow] = React.useState(false);
  const [membershipDate, setMembershipDate] = React.useState(new Date());
  const [visibleDialog, setVisibleDialog] = React.useState(false);
  React.useEffect(() => {
    async function getMember() {
      const { data } = await supabase
        .from('gym_members')
        .select(
          `member,
        is_active,
        joined_at,
        paid_till,
        profiles (
          first_name,
          surname,
          birth_date)`
        )
        .eq('member', userId);
      if (data) {
        setMember(data[0] as Member);
      }
    }
    getMember();
  }, [userId, refresh]);

  React.useEffect(() => {
    navigation.setOptions({
      title: member?.profiles.first_name + ' ' + member?.profiles.surname,
    });
  }, [member]);

  function formatDate(givenDate: Date) {
    const date = new Date(givenDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  function yearsBetween(givenDate: Date) {
    const today = new Date();
    const getFromDate = new Date(givenDate);

    const diff = today.getTime() - getFromDate.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const diffInYears = Math.floor(diffInDays / 365);

    return diffInYears;
  }

  function isFutureDate(date: Date) {
    const today = new Date().toISOString().split('T')[0];
    const givenDate = new Date(date).toISOString().split('T')[0];

    return givenDate >= today;
  }

  function daysBetween(date: Date) {
    const today = new Date().toISOString().split('T')[0];
    const givenDate = new Date(date).toISOString().split('T')[0];
    const diff = new Date(givenDate).getTime() - new Date(today).getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    return diffInDays;
  }

  async function removeMember() {
    await supabase.from('gym_members').delete().eq('member', userId);
    setRefresh(!refresh);
    navigation.goBack();
  }

  async function setDate(date: any) {
    setShow(false);
    setMembershipDate(date);
    await supabase.from('gym_members').update({ paid_till: date }).eq('member', userId);
    setRefresh(!refresh);
  }

  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => setVisibleDialog(false);

  return (
    <ScrollView className="flex-1">
      <View className="min-h-[86vh] m-4 flex flex-col space-y-10">
        <View className="flex flex-col space-y-1">
          <View className="flex flex-row">
            <View className="w-[40%]">
              <Text>Meno:</Text>
            </View>
            <Text>{member?.profiles.first_name}</Text>
          </View>
          <View className="flex flex-row">
            <View className="w-[40%]">
              <Text>Priezvisko:</Text>
            </View>
            <Text>{member?.profiles.surname}</Text>
          </View>
          <View className="flex flex-row">
            <View className="w-[40%]">
              <Text>Datum narodenia:</Text>
            </View>
            {member?.profiles.birth_date && (
              <Text>
                {formatDate(member.profiles.birth_date)} ({yearsBetween(member.profiles.birth_date)} r.)
              </Text>
            )}
          </View>
          <View className="flex flex-row">
            <View className="w-[40%]">
              <Text>Datum pridania:</Text>
            </View>
            {member?.joined_at && <Text>{formatDate(member.joined_at)}</Text>}
          </View>
          <View className="flex flex-row">
            <View className="w-[40%]">
              <Text>Status:</Text>
            </View>
            <Text>{member?.is_active ? 'Aktivovany' : 'Neaktivovany'}</Text>
          </View>
          <View className="flex flex-row">
            <View className="w-[40%]">
              <Text>Permanentka:</Text>
            </View>
            {member?.paid_till && (
              <Text>
                {isFutureDate(member.paid_till)
                  ? formatDate(member.paid_till) + ' (' + Math.floor(daysBetween(member.paid_till)) + ' d.)'
                  : 'Neaktivna'}
              </Text>
            )}
          </View>
        </View>
        <View className="flex-col justify-between flex-1 space-y-4">
          <Button mode="contained" onPress={() => setShow(true)}>
            Nastavit platnost permanentky
          </Button>
          <Button mode="outlined" onPress={showDialog}>
            Vyhodit uzivatela z gymu
          </Button>
        </View>
        <DateTimePickerModal
          isVisible={show}
          cancelTextIOS="Zrusit"
          confirmTextIOS="Potvrdit"
          mode="date"
          onConfirm={setDate}
          onCancel={() => setShow(false)}
          minimumDate={new Date()}
          is24Hour={true}
          date={membershipDate}
        />
        <Portal>
          <Dialog visible={visibleDialog} onDismiss={hideDialog}>
            <Dialog.Content>
              <Text variant="bodyMedium">Skutocne vyhodit uzivatela?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={removeMember}>Potvrdit</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ScrollView>
  );
}

export default AdminMember;
