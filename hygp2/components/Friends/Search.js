import React, { useState } from 'react';
import { TextInput, Text, View, FlatList, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';
import { background, text, theme } from '../../Styles/theme';
import { addfriends } from '../../Styles/addfriends';
function Search(props) {
    const [users, setUsers] = useState([]);
    const { currentUser, friends } = props;
    const checkFriended = (item) => {
        if (props.friends.indexOf(item.id) > -1) {
            return React.createElement(TouchableOpacity, { style: [addfriends.button, background.theme[400]], onPress: () => onRemove(item) },
                React.createElement(MaterialIcons, { name: "delete", size: 20, style: text.theme[200] }));
        }
        else {
            return React.createElement(TouchableOpacity, { style: [addfriends.button, background.accent[200]], onPress: () => onAdd(item) },
                React.createElement(MaterialIcons, { name: "add", size: 20, style: text.accent[300] }));
        }
    };
    const onAdd = (item) => {
        var _a, _b, _c;
        firebase.firestore()
            .collection("friendships")
            .doc((_a = firebase.auth().currentUser) === null || _a === void 0 ? void 0 : _a.uid)
            .collection("friends")
            .doc(item.id)
            .set({
            username: item.username,
            status: "R"
        });
        firebase.firestore()
            .collection("friendships")
            .doc(item.id)
            .collection("friends")
            .doc((_b = firebase.auth().currentUser) === null || _b === void 0 ? void 0 : _b.uid)
            .set({
            username: currentUser.username,
            status: "P"
        });
        firebase.firestore()
            .collection("notifications")
            .doc(item.id)
            .collection("friendrequests")
            .doc((_c = firebase.auth().currentUser) === null || _c === void 0 ? void 0 : _c.uid)
            .set({
            username: currentUser.username
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
                    var _a, _b, _c;
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
                    firebase.firestore()
                        .collection("notifications")
                        .doc(item.id)
                        .collection("friendrequests")
                        .doc((_c = firebase.auth().currentUser) === null || _c === void 0 ? void 0 : _c.uid)
                        .delete();
                },
                style: 'destructive'
            }
        ]);
    };
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('username', '>=', search)
            .where('username', '<=', search + '\uf8ff')
            .get()
            .then((snapshot) => {
            let excludeSelfFromUsers = snapshot.docs.filter(doc => {
                var _a;
                if (doc.id != ((_a = firebase.auth().currentUser) === null || _a === void 0 ? void 0 : _a.uid)) {
                    return doc;
                }
            });
            let users = excludeSelfFromUsers.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return Object.assign({ id }, data);
            });
            setUsers(users);
        });
    };
    return (React.createElement(View, { style: { flex: 1, flexDirection: 'column' } },
        React.createElement(View, { style: [background.theme[700], addfriends.search] },
            React.createElement(MaterialIcons, { name: "search", size: 20, style: [text.theme[100], addfriends.searchicon] }),
            React.createElement(TextInput, { style: [addfriends.text, text.theme[100]], placeholder: "Search someone", placeholderTextColor: theme[200], onChangeText: (search) => fetchUsers(search) })),
        React.createElement(FlatList, { style: { marginTop: 20 }, numColumns: 1, horizontal: false, data: users, renderItem: ({ item }) => (React.createElement(View, { style: [background.theme[700], addfriends.card] },
                React.createElement(Text, { style: [addfriends.text, text.theme[100]] }, item.username),
                checkFriended(item))) })));
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    friends: store.userState.friends
});
export default connect(mapStateToProps, null)(Search);
