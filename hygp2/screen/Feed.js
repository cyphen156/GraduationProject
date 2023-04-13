import { useContext, useState, useEffect } from "react";
import { StyleSheet, View} from "react-native";
import LogContext from "../context/LogContext";
import FloatingWriteButton from "../components/FloatingWriteButton";
import FeedList from "../components/FeedList";


function FeedScreen (){
    
    const {feeds} = useContext(LogContext);
    
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