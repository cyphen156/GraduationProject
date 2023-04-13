import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from "uuid";

export const feedsCollection = firestore().collection('feeds');

  //피드 업데이트
  export function addFeed({id, feed}) {

    return feedsCollection.doc(id).update({

        feed: firestore.FieldValue.arrayUnion(feed),
    });
  }

  //피드 생성 : 피드 처음 생성 할 경우 사용하면 된다.
  export function createFeed({id ,feed}){

    return feedsCollection.doc(id).set({
        feed: firestore.FieldValue.arrayUnion(feed),
    });
  }

  // 컬렉션 feeds -> id 확인하기
  export function feedIdSearch(id){
     feedsCollection.get().then(function (querySnapshot){
        querySnapshot.forEach(function (doc) {
            if (doc.id == id){
                //console.log(doc.id, '=>', doc.data()); 
                console.log(doc.id, '=>', doc.data().feed); 
              return doc.data().feed;
            }
            return false
        });
    });
  }

      // 컬렉션 feeds -> id 있는지 확인 
  export function feedIdExists({id ,feed}){
     feedsCollection.doc(id).get().then(documentSnapshot => {
        //console.log('User exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {//있음
          //console.log('User data: ', documentSnapshot.data());
          addFeed({id, feed})
          return true
        }else{ //없음
            createFeed({id ,feed})
            return true
        }

      });

    }

   // 지우기
   export function removeFeed(id, feed){
    feedsCollection.doc(id).update({
      
      feed: firestore.FieldValue.arrayRemove(feed),

    });

   }
