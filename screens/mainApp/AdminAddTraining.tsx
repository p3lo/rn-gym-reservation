import { useAtomValue } from 'jotai';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Checkbox, Divider, RadioButton, Snackbar, Text, TextInput } from 'react-native-paper';
import { selectedGymAtom } from '../../lib/jotai/atoms';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Slider from '@react-native-community/slider';
import { supabase } from '../../lib/supabase/supabase';

type Training = {
  name: string;
  one_time: string;
  date?: Date;
  training_time: Date;
  training_length: number;
  available_slots: number;
  allow_overbooking: boolean;
};

function AdminAddTraining(this: any) {
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
  const selectedGym = useAtomValue(selectedGymAtom);
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  const [training, setTraining] = React.useState<Training>({
    name: '',
    one_time: 'true',
    date: new Date(),
    training_time: new Date(),
    training_length: 60,
    available_slots: 10,
    allow_overbooking: true,
  });

  function handleFormChange(key: keyof Training, value: string | number | boolean) {
    setTraining((prev) => ({ ...prev, [key]: value }));
  }

  async function setDate(date: any) {
    setShowDate(false);
    handleFormChange('date', date);
  }

  async function setTime(date: any) {
    setShowTime(false);
    handleFormChange('training_time', date);
  }

  function getTimeFromDate(date: Date) {
    let getDate = new Date(date);
    let hours = getDate.getHours();
    let minutes = getDate.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  function formatDate(givenDate: Date) {
    const date = new Date(givenDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  async function addTraining() {
    if (training.name.length < 1) {
      return;
    }
    let { name, date, training_time, training_length, available_slots, allow_overbooking } = training;
    const time = getTimeFromDate(training_time);

    const { data, error } = await supabase
      .from('trainings')
      .insert({ name, date, time, training_length, available_slots, allow_overbooking, gym_id: selectedGym.id });
    if (!error) {
      setVisibleSnackbar(true);
    }
  }

  return (
    <ScrollView className="flex-1">
      <View className="min-h-[86vh] m-4 flex flex-col">
        <View className="flex flex-col flex-1 space-y-5">
          <TextInput
            style={{ width: '100%' }}
            label="Nazov treningu"
            value={training.name}
            mode="outlined"
            onChangeText={handleFormChange.bind(this, 'name')}
          />
          <RadioButton.Group onValueChange={handleFormChange.bind(this, 'one_time')} value={training.one_time}>
            <View className="flex flex-row mt-5 space-x-3 justify-evenly">
              <RadioButton.Item label="Jednorazovy" value="true" />
              <RadioButton.Item label="Opakovany" value="false" />
            </View>
          </RadioButton.Group>
          <Divider />
          <View className="flex flex-col">
            <View className="flex flex-row justify-between">
              <Pressable className="w-[45%]" onPress={() => setShowDate(true)}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    style={{ width: '100%' }}
                    autoCorrect={false}
                    label="Datum"
                    left={<TextInput.Icon icon="calendar-account-outline" />}
                    value={formatDate(training.date || new Date())}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </Pressable>
              <Pressable className="w-[45%]" onPress={() => setShowTime(true)}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    style={{ width: '100%' }}
                    autoCorrect={false}
                    label="Cas"
                    left={<TextInput.Icon icon="clock-time-four-outline" />}
                    value={getTimeFromDate(training.training_time || new Date())}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </Pressable>
            </View>
            <View className="flex flex-col mt-5 ">
              <Text style={{ width: '100%', textAlign: 'center' }}>Dlzka treningu (minuty)</Text>
              <Text style={{ width: '100%', textAlign: 'center' }}>{training.training_length}</Text>
              <Slider
                step={5}
                style={{ width: '100%', height: 40 }}
                minimumValue={5}
                maximumValue={240}
                maximumTrackTintColor="#808080"
                value={training.training_length}
                onValueChange={handleFormChange.bind(this, 'training_length')}
              />
            </View>
            <View className="flex flex-col mt-5 ">
              <Text style={{ width: '100%', textAlign: 'center' }}>Pocet slotov</Text>
              <Text style={{ width: '100%', textAlign: 'center' }}>{training.available_slots}</Text>
              <Slider
                step={1}
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={50}
                maximumTrackTintColor="#808080"
                value={training.available_slots}
                onValueChange={handleFormChange.bind(this, 'available_slots')}
              />
              <Checkbox.Item
                onPress={handleFormChange.bind(this, 'allow_overbooking', !training.allow_overbooking)}
                labelVariant="bodySmall"
                label="Povolit prekrocenie limitu volnych slotov"
                status={training.allow_overbooking ? 'checked' : 'unchecked'}
              />
            </View>
          </View>
        </View>
        <Button style={{ minWidth: '100%' }} mode="outlined" onPress={addTraining}>
          Pridat
        </Button>
        <DateTimePickerModal
          isVisible={showDate}
          cancelTextIOS="Zrusit"
          confirmTextIOS="Potvrdit"
          mode="date"
          onConfirm={setDate}
          onCancel={() => setShowDate(false)}
          minimumDate={new Date()}
          is24Hour={true}
          locale="sk_SK"
          date={training.date}
        />
        <DateTimePickerModal
          isVisible={showTime}
          cancelTextIOS="Zrusit"
          confirmTextIOS="Potvrdit"
          mode="time"
          onConfirm={setTime}
          onCancel={() => setShowTime(false)}
          is24Hour={true}
          locale="sk_SK"
          date={new Date(training.training_time)}
        />
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => {
            setVisibleSnackbar(false);
          }}
          duration={5000}
          action={{
            label: 'Zavri',
            onPress: () => {
              // Do something
            },
          }}
        >
          Trening bol pridany.
        </Snackbar>
      </View>
    </ScrollView>
  );
}

export default AdminAddTraining;
