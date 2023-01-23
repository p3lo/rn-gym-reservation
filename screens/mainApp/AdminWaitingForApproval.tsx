import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

function AdminWaitingForApproval() {
  return (
    <ScrollView className="flex-1 ">
      <View className="items-center min-h-[80vh] m-4 ">
        <Text>Waiting for approval</Text>
      </View>
    </ScrollView>
  );
}

export default AdminWaitingForApproval;
