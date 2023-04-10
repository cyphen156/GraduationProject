import { StyleSheet } from "react-native";

export const addfriends = StyleSheet.create({
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
    search: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: "center",
        flexDirection: "row",
        margin: 10,
        borderRadius: 50,
    },
    searchicon: {
        paddingRight: 20,
    },
    button: {
        borderRadius: 50,
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 16,
    }
})