import { useAtomValue } from 'jotai';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Divider, RadioButton, Text, TextInput } from 'react-native-paper';
import { selectedGymAtom } from '../../lib/jotai/atoms';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Training = {
  name: string;
  one_time: string;
  date?: Date;
  time: Date;
};

function AdminAddTraining(this: any) {
  const selectedGym = useAtomValue(selectedGymAtom);
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  const [training, setTraining] = React.useState<Training>({
    name: '',
    one_time: 'true',
    date: new Date(),
    time: new Date(),
  });

  function handleFormChange(key: keyof Training, value: string) {
    setTraining((prev) => ({ ...prev, [key]: value }));
  }

  async function setDate(date: any) {
    setShowDate(false);
    handleFormChange('date', date);
  }

  async function setTime(date: any) {
    setShowTime(false);
    handleFormChange('time', date);
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
          <View className="flex flex-col space-y-2">
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
                    value={getTimeFromDate(training.time || new Date())}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <Button style={{ minWidth: '100%' }} mode="outlined" onPress={() => {}}>
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
          date={training.time}
        />
      </View>
    </ScrollView>
  );
}

export default AdminAddTraining;
