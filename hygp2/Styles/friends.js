import { StyleSheet } from "react-native";

export const friends = StyleSheet.create({
    addbutton: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 20
    },
    card: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 20,
        marginBottom: 5,
        marginRight: 20,
        borderRadius: 5
    },
    delete: {
        borderRadius: 50,
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 16,
    },
    nofriends: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})