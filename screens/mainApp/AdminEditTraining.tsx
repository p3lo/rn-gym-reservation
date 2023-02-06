import { useAtom } from 'jotai';
import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { refreshAtom } from '../../lib/jotai/atoms';

function AdminEditTraining({ route }: { route: any }) {
  const { training } = route.params;
  const [refresh, setRefresh] = useAtom(refreshAtom);
  return (
    <ScrollView className="flex-1 p-3">
      <Text>AdminEditTraining</Text>
    </ScrollView>
  );
}

export default AdminEditTraining;
