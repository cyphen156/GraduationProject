import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from "uuid";

export const friendsCollection = firestore().collection('friends');

  // friend : 나의 user.id => 배열형태[상대방 user.id]

  //피드 업데이트z
  export function addFriend(id, uid) {

    return friendsCollection.doc(id).update({

      id : firestore.FieldValue.arrayUnion(uid),
    });
  }

  //피드 생성 : 피드 처음 생성 할 경우 사용하면 된다.
  export function createFriend(id ,uid){

    return friendsCollection.doc(id).set({
      id: firestore.FieldValue.arrayUnion(uid),
    });
  }

  // 컬렉션 feeds -> id 배열 가져오고 자신의 아이디 추가한 배열을 리턴
  export async function friendIdSearch(id){
    
    const doc = await friendsCollection.doc(id).get(); 
    doc.data().id.push(id);
    return doc.data();
 
  }

  // 컬렉션 feeds -> id 있는지 확인 -> 추가
  export function friendIdExists(id , uid){
    friendsCollection.doc(id).get().then(documentSnapshot => {
        //console.log('User exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {//있음
          //console.log('User data: ', documentSnapshot.data());
          addFriend(id, uid)
          return true
        }else{ //없음
            createFriend(id , uid)
            return true
        }

      });

    }

   // 지우기
   export function removeFriend(id, user){
    friendsCollection.doc(id).update({
      
      id : firestore.FieldValue.arrayRemove(user),

    });

   }

   // 수정하기 : 기존 데이터 삭제 -> 수정 데이터 생성
   export function updateFriend({id, original, change}){
      
   }
