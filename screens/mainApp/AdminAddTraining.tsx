import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Divider, RadioButton, Snackbar, TextInput } from 'react-native-paper';
import { refreshAtom, selectedGymAtom } from '../../lib/jotai/atoms';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { supabase } from '../../lib/supabase/supabase';
import TrainingFormOne from '../../components/TrainingFormOne';
import TrainingFormMultiple from '../../components/TrainingFormMultiple';
import { getTimeFromDate } from '../../lib/dates';

export type Training = {
  name: string;
  one_time?: string;
  date?: Date;
  training_time: Date;
  training_length: number;
  available_slots: number;
  allow_overbooking: boolean;
};

export type MultipleTrainings = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

function AdminAddTraining(this: any) {
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
  const selectedGym = useAtomValue(selectedGymAtom);
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const [snackbarText, setSnackbarText] = React.useState('');
  const [training, setTraining] = React.useState<Training>({
    name: '',
    one_time: 'true',
    date: new Date(),
    training_time: new Date(),
    training_length: 60,
    available_slots: 10,
    allow_overbooking: true,
  });
  const [multipleTrainings, setmultipleTrainings] = React.useState<MultipleTrainings>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  function handleFormChange(key: keyof Training, value: string | number | boolean) {
    setTraining((prev) => ({ ...prev, [key]: value }));
  }

  function handleMultipleFormChange(key: any, value: boolean) {
    setmultipleTrainings((prev) => ({ ...prev, [key]: value }));
  }

  async function setDate(date: any) {
    setShowDate(false);
    handleFormChange('date', date);
  }

  async function setTime(date: any) {
    setShowTime(false);
    handleFormChange('training_time', date);
  }

  function generateArrayForDB(targetDate: Date, dayName: string, training: Training) {
    const now = new Date();
    const target = new Date(targetDate);
    const generatedArray: [{}] = [{}];
    for (let d = now; d <= target; d.setDate(d.getDate() + 1)) {
      if (d.toLocaleString('default', { weekday: 'long' }) === dayName) {
        generatedArray.push({
          name: training.name,
          date: d.toISOString().slice(0, 10),
          time: getTimeFromDate(training.training_time),
          training_length: training.training_length,
          available_slots: training.available_slots,
          allow_overbooking: training.allow_overbooking,
          gym_id: selectedGym.id,
        });
      }
    }
    return generatedArray;
  }

  async function addTraining() {
    if (training.name.length < 1) {
      setSnackbarText('Zadajte nazov treningu');
      setVisibleSnackbar(true);
      return;
    }
    setIsLoading(true);
    let { name, date, training_time, training_length, available_slots, allow_overbooking } = training;
    const time = getTimeFromDate(training_time);
    if (training.one_time === 'true') {
      const { data, error } = await supabase
        .from('trainings')
        .insert({ name, date, time, training_length, available_slots, allow_overbooking, gym_id: selectedGym.id });
      setIsLoading(false);
      if (!error) {
        setSnackbarText('Trening bol pridany');
        setVisibleSnackbar(true);
      }
    } else {
      if (
        !multipleTrainings.monday &&
        !multipleTrainings.tuesday &&
        !multipleTrainings.wednesday &&
        !multipleTrainings.thursday &&
        !multipleTrainings.friday &&
        !multipleTrainings.saturday &&
        !multipleTrainings.sunday
      ) {
        setSnackbarText('Vyberte aspon jeden den');
        setVisibleSnackbar(true);
        return;
      }
      let monday: [{}] | null = null;
      let tuesday: [{}] | null = null;
      let wednesday: [{}] | null = null;
      let thursday: [{}] | null = null;
      let friday: [{}] | null = null;
      let saturday: [{}] | null = null;
      let sunday: [{}] | null = null;
      if (multipleTrainings.monday) {
        monday = generateArrayForDB(date!, 'Monday', training);
      }
      if (multipleTrainings.tuesday) {
        tuesday = generateArrayForDB(date!, 'Tuesday', training);
      }
      if (multipleTrainings.wednesday) {
        wednesday = generateArrayForDB(date!, 'Wednesday', training);
      }
      if (multipleTrainings.thursday) {
        thursday = generateArrayForDB(date!, 'Thursday', training);
      }
      if (multipleTrainings.friday) {
        friday = generateArrayForDB(date!, 'Friday', training);
      }
      if (multipleTrainings.saturday) {
        saturday = generateArrayForDB(date!, 'Saturday', training);
      }
      if (multipleTrainings.sunday) {
        sunday = generateArrayForDB(date!, 'Sunday', training);
      }
      const allDays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
        .filter((arr) => arr !== null)
        .flat();
      let filteredDays = allDays.filter((obj) => Object.keys(obj!).length !== 0);

      const { error } = await supabase.from('trainings').insert(filteredDays);
      setIsLoading(false);
      if (!error) {
        setSnackbarText('Treningy boli pridane');
        setVisibleSnackbar(true);
      }
    }
    setRefresh(!refresh);
  }

  if (isLoading) {
    return <ActivityIndicator animating={true} className="items-center justify-center flex-1" />;
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
          <RadioButton.Group onValueChange={handleFormChange.bind(this, 'one_time')} value={training.one_time!}>
            <View className="flex flex-row mt-5 space-x-3 justify-evenly">
              <RadioButton.Item label="Jednorazovy" value="true" />
              <RadioButton.Item label="Opakovany" value="false" />
            </View>
          </RadioButton.Group>
          <Divider />
          {training.one_time === 'true' ? (
            <TrainingFormOne
              training={training}
              handleFormChange={handleFormChange}
              setShowDate={setShowDate}
              setShowTime={setShowTime}
            />
          ) : (
            <TrainingFormMultiple
              training={training}
              multipleTrainings={multipleTrainings}
              handleFormChange={handleFormChange}
              handleMultipleFormChange={handleMultipleFormChange}
              setShowDate={setShowDate}
              setShowTime={setShowTime}
            />
          )}
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
          {snackbarText}
        </Snackbar>
      </View>
    </ScrollView>
  );
}

export default AdminAddTraining;
