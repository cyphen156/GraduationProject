import { StyleSheet, View, Text, Pressable, Platform, useWindowDimensions ,TextInput } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserContext } from "../context/UserContext";
import {useNavigation} from '@react-navigation/native'
import { useState } from "react";

function FriendsAddScreen(){
    const {setUser} = useUserContext();
    const navigation = useNavigation();
    const [friends, setFriends] = useState([]);
    const {width} = useWindowDimensions();

    return (
        <View style={[styles.block, {width: width - 5}]}>
            <TextInput style={styles.input} placeholder="친구 닉네임" autoFocus />
            <Pressable
                style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}>
                <Icon name="cancel" size={20} color="#9e9e9e" />
            </Pressable>
    </View>
    )
}

const styles = StyleSheet.create({
    block: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
      },
      input: {
        flex: 1,
      },
      button: {
        marginLeft: 8,
      },
});

export default FriendsAddScreen;