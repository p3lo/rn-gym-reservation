import React from 'react';
import { Text } from 'react-native-paper';
import { Training } from './Home';

function TrainingDetails({ route, navigation }: { route: any; navigation: any }) {
  const { training }: { training: Training } = route.params;
  console.log('🚀 ~ file: TrainingDetails.tsx:7 ~ TrainingDetails ~ training', training);
  return <Text>TrainingDetails</Text>;
}

export default TrainingDetails;
