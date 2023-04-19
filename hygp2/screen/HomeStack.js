import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FileScreen from './FileScreen';
import {StyleSheet, View} from 'react-native';
import CameraButton from '../components/CameraButton';
import ProfileScreen from './MyProfileScreen';
import PostScreen from './PostScreen';
import IconRightButton from '../components/IconRightButton';
import IconLeftButton from '../components/IconLeftButton';
import {useNavigation} from '@react-navigation/native'
import SearchScreen from './Search';
import Icon from "react-native-vector-icons/MaterialIcons";


const Stack = createNativeStackNavigator();

function HomeStack() {
  const navigation = useNavigation();

  return (
    <>
    <Stack.Navigator>
      <Stack.Screen name="File" component={FileScreen} options={
        {title: '게시물',headerTitleAlign: 'center', headerLeft: () => (
          <>
          <IconLeftButton
              name="Profile"
              onPress={() => navigation.push('Profile')
            }
              />
              </>),

        headerRight: () => (
          <>
          <IconRightButton
                    name="search"
                    onPress={() => navigation.push('FriendsList')}
                    />
                <IconRightButton
                    name="person-add"
                    onPress={() => navigation.push('FriendsAdd')}
                    />
                <IconRightButton
                    name="settings"
                    onPress={() => navigation.push('Setting')}
                    />      
                 </> )}} 
             />
             
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name='Post'
        component={PostScreen}
        options={{title: '게시물'}}
      />
    </Stack.Navigator>
    <CameraButton/>
    </>
  );
  
}

export default HomeStack;