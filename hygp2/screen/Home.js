import { View, Button , StyleSheet , Text , Pressable, Platform} from 'react-native';
import { useUserContext } from "../context/UserContext";
import { signOut } from '../lib/auth';

function HomeScreen ({navigation}) {
    const {user} = useUserContext();
    const {setUser} = useUserContext();

    const onLogout = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <View style={styles.block}>
        
            <Text style={styles.text}>Hello, {user.displayName}</Text>
            <Pressable
                onPress={onLogout}
                style={({pressed}) => [
                    styles.item,
                    pressed && Platform.select({ios: { opacity : 0.5}}),
                ]}
                android_ripple={{
                    color: '#eee',
                }}>
                <Text>로그아웃</Text>
            </Pressable>

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

export default HomeScreen;