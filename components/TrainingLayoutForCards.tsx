import React from 'react';
import { Divider, Text } from 'react-native-paper';
import { View } from 'react-native';
import { Training } from '../screens/mainApp/Home';
import TrainingCard from './TrainingCard';

function TrainingLayoutForCards({
  training,
  isDark,
  userId,
}: {
  training: Training[];
  isDark: boolean;
  userId: string;
}) {
  function formatDate(dateString: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    return `${day} ${month} ${year}`;
  }
  function getDayName(dateString: string) {
    const days = ['Nedela', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    return dayName;
  }

  return (
    <View className="w-full">
      <View className="flex flex-col">
        <View className="flex flex-row items-center space-x-5">
          <Text style={{ fontWeight: 'bold', marginHorizontal: 16, marginVertical: 8 }} variant="titleLarge">
            {getDayName(training[0]!.date)}
          </Text>
          <Text style={{ opacity: 0.6 }} variant="bodyMedium">
            {formatDate(training[0]!.date)}
          </Text>
        </View>
        <Divider bold style={{ width: '100%', marginVertical: 6 }} />
      </View>
      {training.map((item) => (
        <TrainingCard key={item?.id} training={item} isDark={isDark} userId={userId} />
      ))}
    </View>
  );
}

export default TrainingLayoutForCards;
