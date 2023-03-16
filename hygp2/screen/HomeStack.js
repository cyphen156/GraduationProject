import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FileScreen from './FileScreen';


const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="File" component={FileScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;