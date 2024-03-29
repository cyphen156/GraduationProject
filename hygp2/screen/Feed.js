import { useContext, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View} from "react-native";
import LogContext from "../context/LogContext";
import FloatingWriteButton from "../components/FloatingWriteButton";
import FeedList from "../components/FeedList";
import IconLeftButton from "../components/IconLeftButton";
import IconRightButton from "../components/IconRightButton";
import { useNavigation } from "@react-navigation/native";
import DateHead from '../components/DateHead';
import Empty from '../components/Empty';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from "../components/Avatar";
import { useUserContext } from "../context/UserContext";

function FeedScreen (){
    
    const navigation = useNavigation();
    const {feeds} = useContext(LogContext);
    const today = new Date();
    const {user} = useUserContext();

    useEffect(() => {
        navigation.setOptions({
            title: '내가 할 일', headerTitleAlign: 'center',
            headerLeft: () => (
                <>               
                <Pressable style={styles.profile}  onPress={() => navigation.push('Profile')}>
                    <Avatar source={user.photoURL && {uri: user.photoURL}} size={38} />
                </Pressable>
                    </>),
            headerRight: () => (
              <View style={styles.settings}>
                <IconRightButton
                    name="search"
                    onPress={() => navigation.navigate('FriendsList')}
                    />
                <IconRightButton
                    name="person-add"
                    onPress={() => navigation.navigate('FriendsAdd')}
                    />
                <IconRightButton
                    name="settings"
                    onPress={() => navigation.navigate('Setting')}
                    />      
                 </View>   
            ),
        });
        },[navigation, feeds])
    
    useEffect(() => { 
        console.log(feeds)
    }, [feeds]);

    console.log("Feed 화면", feeds);

    const [hidden, setHidden] = useState(false);

    const onScrolledToBottom = (isBottom) => {
        if (hidden != isBottom) {setHidden(isBottom)};
    }

    return (
        <>
    <View style={styles.block}>     
        <DateHead date={today} />    
        <FeedList feeds={feeds} onScrolledToBottom={onScrolledToBottom} />
        <FloatingWriteButton hidden={hidden} />
    </View>
    </>
    );
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        zIndex: 0,
    },
    profile: {
        marginLeft: 16,
    },
    settings : {
        marginRight: 16,
        flexDirection: 'row',
    }
});

export default FeedScreen;