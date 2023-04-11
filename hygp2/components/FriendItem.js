import React from 'react';
import { View, Button } from 'react-native';

const FriendItem = ({ friendUserId }) => {
return (
<View>
<Button
title="친구 추가"
_onPress={() => AddFriends(friendUserId)}
/>
<Button
title="친구 삭제"
_onPress={() => removeFriend(friendUserId)}
/>
</View>
);
}