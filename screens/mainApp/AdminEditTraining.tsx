import { useAtom } from 'jotai';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Dialog, Divider, HelperText, Portal, RadioButton, Text, TextInput } from 'react-native-paper';
import TrainingFormOne from '../../components/TrainingFormOne';
import { refreshAtom } from '../../lib/jotai/atoms';
import { Training } from './AdminAddTraining';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { supabase } from '../../lib/supabase/supabase';
import { getTimeFromDate } from '../../lib/dates';

function AdminEditTraining({ route, navigation }: { route: any; navigation: any }) {
  const { training } = route.params;
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [trainingDetails, setTrainingDetails] = React.useState<Training>({
    name: training?.name,
    one_time: 'true',
    date: new Date(training?.date),
    training_time: new Date(),
    training_length: training?.training_length,
    available_slots: training?.available_slots,
    allow_overbooking: training?.allow_overbooking,
  });
  const [updateStyle, setUpdateStyle] = React.useState('one');
  console.log(training);
  React.useEffect(() => {
    setTimeout(() => {
      setTrainingDetails({
        ...trainingDetails,
        training_time: getCurrentDateWithTime(training?.time),
      });
    }, 0);
  }, [training]);
  function handleFormChange(key: keyof Training, value: string | number | boolean) {
    setTrainingDetails((prev) => ({ ...prev, [key]: value }));
  }
  function getCurrentDateWithTime(time: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    return new Date(`${currentDate}T${time}`);
  }
  async function setDate(date: any) {
    setShowDate(false);
    handleFormChange('date', date);
  }

  async function setTime(date: any) {
    setShowTime(false);
    handleFormChange('training_time', date);
  }
  const hideDialog = () => setVisible(false);

  async function handleTrainingUpdate() {
    const time = getTimeFromDate(trainingDetails.training_time);
    const dataUpdate = {
      name: trainingDetails.name,
      date: trainingDetails.date,
      time: time,
      training_length: trainingDetails.training_length,
      available_slots: trainingDetails.available_slots,
      allow_overbooking: trainingDetails.allow_overbooking,
    };
    if (updateStyle === 'all') {
      const { error } = await supabase
        .from('trainings')
        .update(dataUpdate)
        .eq('name', training.name)
        .eq('time', training.time);
      console.log(error);
    } else {
      const { error } = await supabase.from('trainings').update(dataUpdate).eq('id', training.id);
      console.log(error);
    }
    setVisible(false);
    navigation.goBack();
    setRefresh((prev) => !prev);
  }

  return (
    <ScrollView className="flex-1">
      <View className=" m-4 min-h-[86vh] flex-1 flex-col">
        <View className="flex flex-col flex-1 ">
          <TextInput
            style={{ width: '100%', marginVertical: 16 }}
            label="Nazov treningu"
            value={trainingDetails.name}
            mode="outlined"
            onChangeText={handleFormChange.bind(null, 'name')}
          />
          <TrainingFormOne
            training={trainingDetails}
            handleFormChange={handleFormChange}
            setShowDate={setShowDate}
            setShowTime={setShowTime}
            isEdit={true}
          />
        </View>
        <Button style={{ minWidth: '100%' }} mode="outlined" onPress={() => setVisible(true)}>
          Upravit
        </Button>
      </View>
      <DateTimePickerModal
        isVisible={showTime}
        cancelTextIOS="Zrusit"
        confirmTextIOS="Potvrdit"
        mode="time"
        onConfirm={setTime}
        onCancel={() => setShowTime(false)}
        is24Hour={true}
        locale="sk_SK"
        date={trainingDetails?.training_time}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <RadioButton.Group onValueChange={(value) => setUpdateStyle(value)} value={updateStyle}>
              <RadioButton.Item label="Upravit vybrany" value="one" />
              <Divider style={{ width: '100%' }} />
              <RadioButton.Item label="Upravit opakovania" value="all" />
              <HelperText style={{ textAlign: 'center' }} type="info" visible={true}>
                Upravi vsetky treningy s rovnakym nazvom a casom
              </HelperText>
              <Divider style={{ width: '100%' }} />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Zrusit</Button>
            <Button onPress={handleTrainingUpdate}>Potvrdit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

export default AdminEditTraining;
