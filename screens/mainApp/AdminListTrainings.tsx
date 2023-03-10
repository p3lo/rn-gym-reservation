import { useAtom } from 'jotai';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Button, DataTable, Dialog, Divider, IconButton, Portal, RadioButton, Text } from 'react-native-paper';
import { refreshAtom, selectedGymAtom } from '../../lib/jotai/atoms';
import { supabase } from '../../lib/supabase/supabase';

type Training = {
  id: string;
  name: string;
  date: string;
  time: string;
  gym_id: string;
  available_slots: number;
  allow_overbooking: boolean;
  training_length: number;
};

function AdminListTrainings({ navigation }: { navigation: any }) {
  const [selectedGym, setSelectedGym] = useAtom(selectedGymAtom);
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const [trainings, setTrainings] = React.useState<Training[]>([]);
  const [trainingsCount, setTrainingsCount] = React.useState(0);
  const [selectRange, setSelectRange] = React.useState({ startIndex: 0, endIndex: 9 });
  const [page, setPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [forDelete, setForDelete] = React.useState<{
    id: string;
    name: string;
    time: string;
    deleteAll: string;
  }>({ id: '', name: '', time: '', deleteAll: 'one' });
  const from = page * 10;
  const to = Math.min((page + 1) * 10, trainingsCount);
  React.useLayoutEffect(() => {
    async function getTrainings() {
      setIsLoading(true);
      const today = new Date();
      const future = new Date();
      future.setDate(future.getDate() + 30);
      const { data, count, error } = await supabase
        .from('trainings')
        .select('*', { count: 'exact' })
        .eq('gym_id', selectedGym.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .range(selectRange.startIndex, selectRange.endIndex);

      if (data) {
        setTrainings(data);
        setTrainingsCount(count || 0);
      }
      setIsLoading(false);
    }
    getTrainings();
  }, [, refresh, page]);
  function formatTime(time: string) {
    const timeArray = time.split(':');
    const formattedTime = timeArray.slice(0, 2).join(':');
    return formattedTime;
  }
  function formatDate(dateString: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  }
  function handlePagination(page: number) {
    const startIndex = page * 10;
    const endIndex = startIndex + 9;
    setSelectRange({ startIndex, endIndex });
    setPage(page);
  }
  async function handleTrainingDelete() {
    if (forDelete.deleteAll === 'all') {
      const today = new Date();
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('name', forDelete.name)
        .eq('time', forDelete.time)
        .gte('date', today.toISOString().split('T')[0]);
      if (error) {
        console.log(error);
      }
    } else {
      const { error } = await supabase.from('trainings').delete().eq('id', forDelete.id);
      if (error) {
        console.log(error);
      }
    }

    setRefresh(!refresh);
    setVisible(false);
  }

  function openDialog(id: string, name: string, time: string) {
    setForDelete({ id, name, time, deleteAll: 'one' });
    setVisible(true);
  }

  function setDeleteAll(value: string) {
    setForDelete({ ...forDelete, deleteAll: value });
  }

  const hideDialog = () => setVisible(false);

  if (isLoading) {
    return <ActivityIndicator animating={true} className="items-center justify-center flex-1" />;
  }
  return (
    <ScrollView className="flex-1 my-3">
      <DataTable>
        {trainings.map((training) => (
          <DataTable.Row key={training.id}>
            <DataTable.Cell className="p-3">
              <View>
                <Text variant="bodyLarge" style={{ fontWeight: '700' }}>
                  {training.name}
                </Text>
                <View className="flex flex-row gap-x-1">
                  <Text>{formatDate(training.date)}</Text>
                  <Text>{formatTime(training.time)}</Text>
                  <Text>|</Text>
                  <Text>{training.training_length} min</Text>
                </View>
                <Text>Slotov: {training.available_slots}</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell numeric className="">
              <View className="flex flex-row py-3 gap-x-1">
                <IconButton
                  mode="contained-tonal"
                  icon="square-edit-outline"
                  size={25}
                  onPress={() => navigation.navigate('AdminEditTraining', { training })}
                />
                <IconButton
                  mode="contained-tonal"
                  icon="delete-outline"
                  iconColor="red"
                  size={25}
                  onPress={openDialog.bind(null, training.id, training.name, training.time)}
                />
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(trainingsCount / 10)}
          onPageChange={handlePagination}
          showFastPaginationControls
          label={`${from + 1}-${to} z ${trainingsCount}`}
        />
      </DataTable>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <RadioButton.Group onValueChange={(value) => setDeleteAll(value)} value={forDelete.deleteAll}>
              <RadioButton.Item label="Vymazat vybrany" value="one" />
              <Divider style={{ width: '100%' }} />
              <RadioButton.Item label="Vymazat opakovania" value="all" />
              <Divider style={{ width: '100%' }} />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Zrusit</Button>
            <Button onPress={handleTrainingDelete}>Potvrdit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

export default AdminListTrainings;
