import { firebase } from '@react-native-firebase/database'; 

// 친구 추가 함수
const AddFriends = async (friendUserId) => {
    // 현재 로그인한 사용자의 UserID 가져오기  
    const currentUserId = firebase.auth().currentUser.uid;
    try {  
    // Firebase Realtime Database의 'friends' 노드에 새로운 친구 추가  
    await firebase.database().ref(`friends/${currentUserId}/${friendUserId}`).set(true);    
    console.log('친구 추가 완료!');  
    } catch (error) {  
    console.error(error);  
    }  
}
       
    // 친구 삭제 함수    
    const removeFriend = async (friendUserId) => {  
    // 현재 로그인한 사용자의 UserID 가져오기    
    const currentUserId = firebase.auth().currentUser.uid;
       
    try {  
    // Firebase Realtime Database의 'friends' 노드에서 친구 삭제  
    await firebase.database().ref(`friends/${currentUserId}/${friendUserId}`).remove();  
    console.log('친구 삭제 완료!');  
    } catch (error) {    
    console.error(error);  
    }  
}