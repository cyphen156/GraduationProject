import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { useUserContext } from "../context/UserContext";
import { signOut } from "../lib/auth";
import {useNavigation} from '@react-navigation/native'

function SettingScreen(){
    const {setUser} = useUserContext();
    const navigation = useNavigation();

    const onLogout = async () => {
        await signOut();
        setUser(null);
    };
    

    return (
        <View style={styles.block}>
            <Pressable
                onPress={onLogout}
                style={({pressed}) => [
                    styles.item,
                    pressed && Platform.select({ios: {opacity: 0.5}}),
                ]}
                android_ripple={{
                    color: '#eee',
                }}>
                    <Text>로그아웃</Text>
            </Pressable>
            <Pressable
                onPress={() => navigation.push('프로필 변경')}
                style={({pressed}) => [
                    styles.item,
                    pressed && Platform.select({ios: {opacity: 0.5}}),
                ]}
                android_ripple={{
                    color: '#eee',
                }}>
                    <Text>프로필 변경</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    block: {
         flex: 1,
         paddingTop: 32,
    },
    item: {
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

export default SettingScreen;