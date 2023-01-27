import { useAtom, useSetAtom } from 'jotai';
import React from 'react';
import { View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { Training } from '../screens/mainApp/Home';

function TrainingCard({ training, isDark }: { training: Training; isDark: boolean }) {
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
  return (
    <View className={`w-full my-2 border-[0.5px] rounded-md  ${isDark ? 'border-gray-400/50' : 'border-gray-600/50'}`}>
      <View className="flex flex-col m-4">
        <Text style={{ fontWeight: 'bold' }} variant="titleMedium">
          {training!.name}
        </Text>
        <View className="flex flex-row space-x-5 my-1">
          <View className="flex flex-row space-x-1">
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
          <Text style={{ opacity: 0.8 }} variant="bodySmall">
            {formatTime(training!.available_slots.toString())}
          </Text>
        </View>
        <Button
          compact={true}
          contentStyle={{ height: 30 }}
          labelStyle={{ fontSize: 12, lineHeight: 12 }}
          mode="outlined"
          style={{ borderRadius: 0, width: 150, alignSelf: 'flex-end' }}
        >
          Rezervovat
        </Button>
      </View>
    </View>
  );
}

export default TrainingCard;
