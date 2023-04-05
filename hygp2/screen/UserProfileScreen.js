import { View, Button , StyleSheet , Text , Pressable, Platform, Image} from 'react-native';
import { useUserContext } from "../context/UserContext";
import { signOut } from '../lib/auth';
import {useNavigation, useRoute} from '@react-navigation/native'
import IconRightButton from '../components/IconRightButton';
import {useEffect} from 'react';
import Profile from '../components/Profile';

function UserProfileScreen () {
    console.log(" userprofile")
    const route = useRoute();
    const {userInfo} = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: userInfo.displayName,
        });
    }, [navigation, userInfo])
    return (
        <View style={styles.block}>
            <Profile userId={userInfo.id}/>
       </View>
        
    );
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
    },
    item:{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eeeeee',
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    itemText: {
        fontSize: 16,
    },
});

export default UserProfileScreen;