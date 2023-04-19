import { useContext, useState, useEffect } from "react";
import { StyleSheet, View} from "react-native";
import LogContext from "../context/LogContext";
import FloatingWriteButton from "../components/FloatingWriteButton";
import FeedList from "../components/FeedList";
import IconLeftButton from "../components/IconLeftButton";
import IconRightButton from "../components/IconRightButton";
import { useNavigation } from "@react-navigation/native";

function FeedScreen (){
    
    const navigation = useNavigation();
    const {feeds} = useContext(LogContext);
    
    useEffect(() => { 
        console.log(feeds)
    }, [feeds]);

    console.log("Feed 화면", feeds);

    const [hidden, setHidden] = useState(false);
    const onScrolledToBottom = (isBottom) => {
        if (hidden != isBottom) {setHidden(isBottom)};
    }


    useEffect(() => {
        navigation.setOptions({
            title: 'Feed', headerTitleAlign: 'center',
            headerLeft: () => (
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
                 </>   
            ),
        });
        },[navigation])

    return (
        <>
        <View style={styles.block}>
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
});

export default FeedScreen;