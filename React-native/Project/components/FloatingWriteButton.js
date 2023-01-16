import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-vector-icons/MaterialIcons";

function FloatingWriteButton () {
    return (
        <View style={styles.wrapper}>
            <Pressable style={({pressed}) => [
                styles.button,
                Platform.OS === "ios" && {
                    opacity: pressed ? 0.6 : 1,
                },
            ]}
            android_ripple={{color: 'white'}}>
                <Icon name="add" size={24} style={styles.icon} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        buttom: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        // ios shadow set
        shadowColor: "#4d4d4d",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        //android shadow set
        elevation: 5,
        overflow: Platform.select({android: 'hidden'}),
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#009688",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        color: "white",
    },
});

export default FloatingWriteButton;