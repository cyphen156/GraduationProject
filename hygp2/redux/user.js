import { USER_STATE_CHANGE, USER_FRIENDS_STATE_CHANGE, USER_NOTIFICATIONS_FRIENDREQUESTS_STATE_CHANGE, USER_NOTIFICATIONS_OTHER_STATE_CHANGE, CLEAR_DATA } from "../constants/index";
const initialState = {
    currentUser: null,
    friends: [],
    friendrequests: [],
    othernotifications: [],
};
export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return Object.assign(Object.assign({}, state), { currentUser: action.currentUser });
        case USER_FRIENDS_STATE_CHANGE:
            return Object.assign(Object.assign({}, state), { friends: action.friends });
        case USER_NOTIFICATIONS_FRIENDREQUESTS_STATE_CHANGE:
            return Object.assign({}, state, {
                friendrequests: action.friendrequests
            });
        case USER_NOTIFICATIONS_OTHER_STATE_CHANGE:
            return Object.assign({}, state, {
                othernotifications: action.othernotifications
            });
        case CLEAR_DATA:
            return {
                currentUser: null,
                friends: [],
                friendrequests: [],
                othernotifications: [],
            };
        default:
            return state;
    }
};
