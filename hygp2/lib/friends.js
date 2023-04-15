import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from "uuid";

export const friendsCollection = firestore().collection('friends');

  // friend : 나의 user.id => 배열형태[상대방 user 객체]

  //피드 업데이트
  export function addFriend({id, user}) {

    return friendsCollection.doc(id).update({

        friend : firestore.FieldValue.arrayUnion(user),
    });
  }

  //피드 생성 : 피드 처음 생성 할 경우 사용하면 된다.
  export function createFriend({id ,user}){

    return friendsCollection.doc(id).set({
      friend: firestore.FieldValue.arrayUnion(user),
    });
  }

  // 컬렉션 feeds -> id 확인하기
  export function friendIdSearch(id){
    friendsCollection.get().then(function (querySnapshot){
        querySnapshot.forEach(function (doc) {
            if (doc.id == id){
                //console.log(doc.id, '=>', doc.data()); 
                console.log(doc.id, '=>', doc.data().friend); 
              return doc.data().friend;
            }
            return false
        });
    });
  }

  // 컬렉션 feeds -> id 있는지 확인 -> 추가
  export function feedIdExists({id , user}){
    friendsCollection.doc(id).get().then(documentSnapshot => {
        //console.log('User exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {//있음
          //console.log('User data: ', documentSnapshot.data());
          addFriend({id, user})
          return true
        }else{ //없음
            createFriend({id , user})
            return true
        }

      });

    }

   // 지우기
   export function removeFriend(id, user){
    friendsCollection.doc(id).update({
      
      friend : firestore.FieldValue.arrayRemove(user),

    });

   }

   // 수정하기 : 기존 데이터 삭제 -> 수정 데이터 생성
   export function updateFriend({id, original, change}){
      addFriend({id, change});
      //removeFeed({id, original});
   }
