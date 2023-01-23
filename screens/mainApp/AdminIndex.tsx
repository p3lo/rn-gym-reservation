import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';

function AdminIndex({ route, navigation }: { route: any; navigation: any }) {
  const theme = useTheme();

  return (
    <>
      <ScrollView className="flex-1 ">
        <View className="items-center min-h-[80vh] m-4 ">
          <Button style={{ minWidth: '100%' }} mode="contained-tonal" onPress={() => navigation.navigate('AdminWFA')}>
            Cakajuci na schvalenie
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

export default AdminIndex;
