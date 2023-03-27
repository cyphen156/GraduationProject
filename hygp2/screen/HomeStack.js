import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FileScreen from './FileScreen';
import {StyleSheet, View} from 'react-native';
import CameraButton from '../components/CameraButton';
import ProfileScreen from './MyProfileScreen';
import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <>
    <Stack.Navigator>
      <Stack.Screen name="File" component={FileScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{title: '게시물'}}
      />
    </Stack.Navigator>
    <CameraButton/>
    </>
  );
  
}

export default HomeStack;