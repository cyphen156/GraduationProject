import { StyleSheet, Text, TextInput } from "react-native";

function BorderedInput({hasMarginBottom}){
    return <TextInput style={[styles.input, hasMarginBottom && styles.margin]}/>;
}

const styles = StyleSheet.create({
    input: {
        borderColor : '#bdbdbd',
        borderWidth: 1,
        paddingHorizontal : 16,
        borderRadius : 4,
        height: 48,
        backgroundColor: 'white',
    },
    margin: {
        marginBottom: 16,
    },
});

export default BorderedInput;