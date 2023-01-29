import React from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button, Text } from 'react-native-paper';
import { Training } from '../screens/mainApp/Home';
import { supabase } from '../lib/supabase/supabase';
import { useAtom } from 'jotai';
import { refreshAtom } from '../lib/jotai/atoms';
import { useNavigation } from '@react-navigation/native';

function TrainingCard({ training, isDark, userId }: { training: Training; isDark: boolean; userId: string }) {
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const [trainingDef, setTrainingDef] = React.useState<Training>(training);
  const navigation = useNavigation();
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
  function getSlots(): string {
    if (trainingDef!.training_slots.length === 0) return `0 / ${trainingDef!.available_slots}`;
    const getTrueFalse = trainingDef!.training_slots.reduce(
      (acc, item) => {
        acc[item.approved ? 'approvedTrue' : 'approvedFalse']++;
        return acc;
      },
      { approvedTrue: 0, approvedFalse: 0 }
    );
    if (getTrueFalse.approvedFalse === 0) return `${getTrueFalse.approvedTrue} / ${trainingDef!.available_slots}`;
    return `${getTrueFalse.approvedTrue} / ${trainingDef!.available_slots} (${getTrueFalse.approvedFalse})`;
  }
  async function makeReservation() {
    if (trainingDef!.training_slots.length >= trainingDef!.available_slots) {
      const { error } = await supabase.from('training_slots').insert([
        {
          member_id: userId,
          training_id: training!.id,
          approved: false,
        },
      ]);

      if (!error) {
        setTrainingDef((prevState: any) => {
          return {
            ...prevState,
            training_slots: [...prevState!.training_slots, { member_id: userId, approved: true }],
          };
        });
      }
    } else {
      const { error } = await supabase.from('training_slots').insert([
        {
          member_id: userId,
          training_id: training!.id,
          approved: true,
        },
      ]);

      if (!error) {
        setTrainingDef((prevState: any) => {
          return {
            ...prevState,
            training_slots: [...prevState!.training_slots, { member_id: userId, approved: true }],
          };
        });
      }
    }
  }
  function getFirstUnapproved(arr: [{ approved: boolean; member_id: string }] | []) {
    for (let obj of arr) {
      if (!obj.approved) {
        return obj;
      }
    }
    return null;
  }
  async function cancelReservation() {
    const { error } = await supabase
      .from('training_slots')
      .delete()
      .match({ member_id: userId, training_id: training!.id });

    const firstUnapproved = getFirstUnapproved(trainingDef!.training_slots);
    if (firstUnapproved) {
      const { error } = await supabase
        .from('training_slots')
        .update({ approved: true })
        .match({ member_id: firstUnapproved.member_id, training_id: training!.id });
      if (!error) {
        setTrainingDef((prevState: any) => {
          return {
            ...prevState,
            training_slots: [...prevState!.training_slots, { member_id: firstUnapproved.member_id, approved: true }],
          };
        });
      }
    }
    if (!error) {
      setTrainingDef((prevState: any) => {
        return {
          ...prevState,
          training_slots: prevState!.training_slots.filter((slot) => slot.member_id !== userId),
        };
      });
    }
  }

  return (
    <Pressable
      className={`w-full my-2  rounded-md  ${
        isDark ? 'border-gray-400/50 bg-zinc-800' : 'border-gray-600/50 bg-zinc-100'
      }`}
      onPress={() => {
        navigation.navigate('TrainingDetails' as never, { training: trainingDef } as never);
      }}
    >
      <View className="flex flex-col m-4">
        <Text style={{ fontWeight: 'bold' }} variant="titleMedium">
          {training!.name}
        </Text>
        <View className="flex flex-row my-1 space-x-5">
          <View className="flex flex-row items-center space-x-1">
            <Ionicons name="calendar" size={15} color={`${isDark ? 'gray' : 'darkgray'}`} />
            <Text style={{ opacity: 0.6 }} variant="bodySmall">
              {formatDate(training!.date)}
            </Text>
            <Text style={{ opacity: 0.6 }} variant="bodySmall">
              |
            </Text>
            <Text style={{ opacity: 0.8 }} variant="bodySmall">
              {formatTime(training!.time)}
            </Text>
            <Text style={{ opacity: 0.6 }} variant="bodySmall">
              |
            </Text>
            <Text style={{ opacity: 0.6 }} variant="bodySmall">
              {training!.training_length.toString()} min
            </Text>
          </View>
          <View className="flex flex-row items-center space-x-1">
            <Ionicons name="person" size={15} color={`${isDark ? 'gray' : 'darkgray'}`} />
            <Text style={{ opacity: 0.8 }} variant="bodySmall">
              {getSlots()}
            </Text>
          </View>
        </View>
        {trainingDef!.training_slots.some((slot) => slot.member_id === userId) ? (
          <Button
            compact={true}
            contentStyle={{ height: 30 }}
            labelStyle={{ fontSize: 12, lineHeight: 12 }}
            mode="contained"
            style={{ borderRadius: 0, width: 150, alignSelf: 'flex-end' }}
            onPress={cancelReservation}
          >
            Zrusit rezervaciu
          </Button>
        ) : (
          <Button
            compact={true}
            contentStyle={{ height: 30 }}
            labelStyle={{ fontSize: 12, lineHeight: 12 }}
            mode="outlined"
            style={{ borderRadius: 0, width: 150, alignSelf: 'flex-end' }}
            onPress={makeReservation}
          >
            Rezervovat
          </Button>
        )}
      </View>
    </Pressable>
  );
}

export default TrainingCard;
