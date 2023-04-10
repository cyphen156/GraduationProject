import React, { useCallback, useEffect, useState } from 'react';
import { accent, background, theme } from '../styles/colors/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { friends } from '../Friends/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserFriends, fetchUserFriendRequests, fetchUserOtherNotifications, clearData } from '../redux/index';
import { useFocusEffect } from '@react-navigation/core';
const Tab = createBottomTabNavigator();
function Home(props) {
    const [user, setCurrentUser] = useState();
    const [userFriends, setCurrentUserFriends] = useState();
    const [userFriendRequests, setUserFriendRequests] = useState();
    const [userOtherNotifications, setUserOtherNotifications] = useState();
    const { currentUser, friendrequests, othernotifications } = props;
    const [hasNotifications, setUserNotifications] = useState(null);
    useEffect(() => {
        props.clearData();
        setCurrentUser(props.fetchUser());
        setCurrentUserFriends(props.fetchUserFriends());
        setUserFriendRequests(props.fetchUserFriendRequests());
        setUserOtherNotifications(props.fetchUserOtherNotifications());
    }, []);
    useFocusEffect(useCallback(() => {
        props.fetchUser();
        props.fetchUserFriendRequests();
        props.fetchUserOtherNotifications();
    }, []));
    useEffect(() => {
        if (friendrequests != 0 || othernotifications != 0) {
            let count = 0;
            for (var friendrequest in friendrequests) {
                count = count + 1;
            }
            for (var notification in othernotifications) {
                count = count + 1;
            }
            setUserNotifications(count);
        }
        else if (friendrequests == 0 && othernotifications == 0) {
            setUserNotifications(null);
        }
    });
    return(
        React.createElement(Tab.Screen, { name: "Friends", component:List, options: {
                tabBarIcon: ({ color }) => (React.createElement(MaterialIcons, { name: "people-alt", color: color, size: 26 })),
            }}))
    
       
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    friendrequests: store.userState.friendrequests,
    othernotifications: store.userState.othernotifications,
});
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserFriends, fetchUserFriendRequests, fetchUserOtherNotifications, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Home);
