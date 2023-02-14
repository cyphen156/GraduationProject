import { StyleSheet, Text } from "react-native/types";
import { SafeAreaView } from "react-native-safe-area-context";

function SignIn () {
    return (
        <SafeAreaView style={styles.fullscreen}>
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