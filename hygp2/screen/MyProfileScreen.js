import { View, Button , StyleSheet , Text , Pressable, Platform, Image} from 'react-native';
import { useUserContext } from "../context/UserContext";
import { signOut } from '../lib/auth';
import {useNavigation} from '@react-navigation/native'
import IconRightButton from '../components/IconRightButton';
import {useEffect} from 'react';
import Profile from '../components/Profile';

function MyProfileScreen () {
    const {user} = useUserContext();
    const {setUser} = useUserContext();
    const navigation = useNavigation();

    const onLogout = async () => {
        await signOut();
        setUser(null);
    };

    useEffect(() => {
        navigation.setOptions({
            title: user.displayName,
            headerRight: () => (
                <IconRightButton
                    name="settings"
                    onPress={() => navigation.push('Setting')}
                    />
            ),
        });
    }, [navigation, user])
    return (
        <View style={styles.block}>
            <Profile userId={user.id}/>
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

export default MyProfileScreen;