import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


/** 로그인 화면 */
function SignIn () {
    return (
  
        <SafeAreaView style={styles.fullscreen}>
            <Text>안녕 리액트</Text>
            <Text style={styles.text}>PublicGallery</Text>
        </SafeAreaView>
    ); 
}

const styles = StyleSheet.create ({
    block: {},
    fullscreen: {
        flex:   1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold'
    },
});

export default SignIn;