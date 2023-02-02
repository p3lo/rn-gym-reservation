import React from 'react';
import { Pressable, View } from 'react-native';
import { Checkbox, RadioButton, Text, TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { MultipleTrainings, Training } from '../screens/mainApp/AdminAddTraining';
import { formatDate, getTimeFromDate } from '../lib/dates';

function TrainingFormMultiple({
  training,
  multipleTrainings,
  handleFormChange,
  handleMultipleFormChange,
  setShowDate,
  setShowTime,
}: {
  training: Training;
  multipleTrainings: MultipleTrainings;
  handleFormChange: (key: keyof Training, value: string | number | boolean) => void;
  handleMultipleFormChange: (key: any, value: boolean) => void;
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
              label="Generovat do"
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
      <View className="flex flex-col mt-5">
        <Text style={{ width: '100%', textAlign: 'center' }}>Pre ktore dni generovat</Text>

        <View className="flex flex-row justify-evenly">
          <RadioButton.Item
            style={{ width: 150 }}
            label="Pondelok"
            value="pondelok"
            status={multipleTrainings.monday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'monday', !multipleTrainings.monday)}
          />
          <RadioButton.Item
            style={{ width: 150 }}
            label="Utorok"
            value="utorok"
            status={multipleTrainings.tuesday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'tuesday', !multipleTrainings.tuesday)}
          />
        </View>
        <View className="flex flex-row justify-evenly">
          <RadioButton.Item
            style={{ width: 150 }}
            label="Streda"
            value="streda"
            status={multipleTrainings.wednesday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'wednesday', !multipleTrainings.wednesday)}
          />

          <RadioButton.Item
            style={{ width: 150 }}
            label="Stvrtok"
            value="stvrtok"
            status={multipleTrainings.thursday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'thursday', !multipleTrainings.thursday)}
          />
        </View>
        <View className="flex flex-row justify-evenly">
          <RadioButton.Item
            style={{ width: 150 }}
            label="Piatok"
            value="piatok"
            status={multipleTrainings.friday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'friday', !multipleTrainings.friday)}
          />
          <RadioButton.Item
            style={{ width: 150 }}
            label="Sobota"
            value="sobota"
            status={multipleTrainings.saturday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'saturday', !multipleTrainings.saturday)}
          />
        </View>
        <View className="flex flex-row justify-center">
          <RadioButton.Item
            style={{ width: 150 }}
            label="Nedela"
            value="nedela"
            status={multipleTrainings.sunday ? 'checked' : 'unchecked'}
            onPress={handleMultipleFormChange.bind(null, 'sunday', !multipleTrainings.sunday)}
          />
        </View>
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

export default TrainingFormMultiple;
