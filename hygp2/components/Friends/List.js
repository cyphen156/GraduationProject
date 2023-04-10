import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { firebase } from 'firebase';
import { useFocusEffect } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { background, text } from '../../Styles/theme';
import { friends } from '../../Styles/friends';
require('firebase/firestore');
const List = ({ navigation }) => {
    const [userFriends, setUserFriends] = useState([]);
    const fetchUserFriends = () => {
        var _a;
        firebase.firestore()
            .collection('friendships')
            .doc((_a = firebase.auth().currentUser) === null || _a === void 0 ? void 0 : _a.uid)
            .collection('friends')
            .where('status', '==', 'A')
            .get()
            .then((snapshot) => {
            let userFriends = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return Object.assign({ id }, data);
            });
            setUserFriends(userFriends);
        });
    };
    const onRemove = (item) => {
        Alert.alert(`Warning`, `Are you sure you want to remove ${item.username} as your friend? `, [
            {
                text: 'Cancel',
                onPress: () => { console.log('User tapped out...'); },
                style: 'cancel'
            },
            {
                text: 'Remove',
                onPress: () => {
                    var _a, _b;
                    firebase.firestore()
                        .collection("friendships")
                        .doc((_a = firebase.auth().currentUser) === null || _a === void 0 ? void 0 : _a.uid)
                        .collection("friends")
                        .doc(item.id)
                        .delete();
                    firebase.firestore()
                        .collection("friendships")
                        .doc(item.id)
                        .collection("friends")
                        .doc((_b = firebase.auth().currentUser) === null || _b === void 0 ? void 0 : _b.uid)
                        .delete();
                    fetchUserFriends();
                },
                style: 'destructive'
            }
        ]);
    };
    useFocusEffect(useCallback(() => {
        fetchUserFriends();
    }, []));
    if (Object.keys(userFriends).length === 0) {
        return (React.createElement(SafeAreaView, { style: [friends.nofriends] },
            React.createElement(Text, { style: [text.theme[100]] }, "It's quiet here!"),
            React.createElement(Text, { style: [text.theme[200]] }, " You have no friends, try adding some."),
            React.createElement(TouchableOpacity, { style: [background.accent[200], friends.addbutton], onPress: () => navigation.navigate('Search') },
                React.createElement(MaterialIcons, { name: "add", size: 32, style: text.accent[300] }))));
    }
    return (React.createElement(SafeAreaView, { style: { flex: 1, marginTop: 20 } },
        React.createElement(FlatList, { numColumns: 1, horizontal: false, data: userFriends, renderItem: ({ item }) => (React.createElement(View, { style: [background.theme[700], friends.card] },
                React.createElement(Text, { style: [friends.text, text.theme[100]] }, item.username),
                React.createElement(TouchableOpacity, { style: [friends.delete, background.theme[400]], onPress: () => onRemove(item) },
                    React.createElement(MaterialIcons, { name: "delete", size: 20, style: text.theme[200] })))) }),
        React.createElement(TouchableOpacity, { style: [background.accent[200], friends.addbutton], onPress: () => navigation.navigate('Search') },
            React.createElement(MaterialIcons, { name: "add", size: 32, style: text.accent[300] }))));
};
export default List;