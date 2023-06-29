import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FileScreen from './FileScreen';
import {Pressable, StyleSheet, View, Text} from 'react-native';
import CameraButton from '../components/CameraButton';
import ProfileScreen from './MyProfileScreen';
import PostScreen from './PostScreen';
import IconRightButton from '../components/IconRightButton';
import IconLeftButton from '../components/IconLeftButton';
import {useNavigation} from '@react-navigation/native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { useUserContext } from '../context/UserContext';
import Avatar from '../components/Avatar';

const Stack = createNativeStackNavigator();

function HomeStack() {
  const navigation = useNavigation();
  const {user} = useUserContext();
  return (
    <>
    <Stack.Navigator>
      <Stack.Screen name="File" component={FileScreen} options={
        {title: '게시물',headerTitleAlign: 'center', headerLeft: () => (
          <>
          <Pressable style={styles.profile}  onPress={() => navigation.push('Profile')}>
            <Avatar source={user.photoURL && {uri: user.photoURL}} size={38} />
          </Pressable>
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

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },

});
export default HomeStack;