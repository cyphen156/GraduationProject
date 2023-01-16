import { useContext } from "react";
import { StyleSheet, View} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import LogContext from "../context/LogContext";
import FloatingWriteButton from "../components/FloatingWriteButton";

function FeedScreen (){
    // useContext Hook사용하기
    //const {text, setText} = useContext(LogContext);

    return (
        <View style={styles.block}>
            <FloatingWriteButton />
            {/*<TextInput value={text} onChangeText={setText} placeholder="텍스트를 입력하세요." 
            style={styles.input} />*/}
        </View>
    );
    /**
    return (
        
        리액트 네이티브 Render Props사용하기
        패턴1
        <View style={styles.block} >
            <Box>{(value) => <Text>{value}</Text>}
            </Box>

            패턴2
            <Box>
                <Text>2</Text>
            </Box>
            <Box>
                <Text>3</Text>
            </Box>
            <LogContext.Consumer>
                {(value) => <Text>{value}</Text>}
            </LogContext.Consumer>
        </View>
        );
    */
}

function Box ({children}) {
    return <View style={styles.box}>{children('helloworld')}</View>;
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
    },
    box: {
        borderWidth: 2,
        padding: 16,
        borderBottomColor: 'black',
        marginBottom: 16,
    },
    input: {
        padding: 16,
        backgroundColor: "white",
    },
});

export default FeedScreen;