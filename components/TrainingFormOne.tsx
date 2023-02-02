import React from 'react';
import { Pressable, View } from 'react-native';
import { Checkbox, Divider, RadioButton, Text, TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { Training } from '../screens/mainApp/AdminAddTraining';
import { formatDate, getTimeFromDate } from '../lib/dates';

function TrainingFormOne({
  training,
  handleFormChange,
  setShowDate,
  setShowTime,
}: {
  training: Training;
  handleFormChange: (key: keyof Training, value: string | number | boolean) => void;
  setShowDate: (showDate: boolean) => void;
  setShowTime: (showTime: boolean) => void;
}) {
  return (
    <View className="flex flex-col">
      <View className="flex flex-row justify-between">
        <Pressable className="w-[45%]" onPress={() => setShowDate(true)}>
          <View pointerEvents="none">
            <TextInput
              mode="outlined"
              style={{ width: '100%' }}
              autoCorrect={false}
              label="Datum treningu"
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
              label="Cas treningu"
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
          onValueChange={handleFormChange.bind(null, 'training_length')}
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
          onValueChange={handleFormChange.bind(null, 'available_slots')}
        />
        <Checkbox.Item
          onPress={handleFormChange.bind(null, 'allow_overbooking', !training.allow_overbooking)}
          labelVariant="bodySmall"
          label="Povolit prekrocenie limitu volnych slotov"
          status={training.allow_overbooking ? 'checked' : 'unchecked'}
        />
      </View>
    </View>
  );
}

export default TrainingFormOne;
