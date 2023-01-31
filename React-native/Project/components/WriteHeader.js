import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import TransparentCircleButton from "./TransparentCircleButton";

function WriteHeader({onSave}) {
    const navigation = useNavigation();
    const onGoBack = () => {
        navigation.pop();
    };
    return (
        <View style={styles.block}>
            <View style={styles.iconButtonWrapper}>
                <TransparentCircleButton
                    onPress={onGoBack}
                    name="arrow-back" 
                    color="#424242" />
            </View>
            <View style={styles.buttons}>
                <TransparentCircleButton
                    name="delete-forever" 
                    color="#ef5350" 
                    hasMarginRight/>
                <TransparentCircleButton
                    name="check" 
                    color="#009688" 
                    onPress={onSave}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        height: 40,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttons:{
        flexDirection: "row",
        alignItems:"center",
    },
    center: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        flexDirection: 'row',
      },
      separator: {
        width: 8,
      },
});

export default WriteHeader;