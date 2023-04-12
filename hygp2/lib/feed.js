import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from "uuid";

export const feedsCollection = firestore().collection('feeds');


  export function addFeed({id, feed}) {

    return feedsCollection.doc(id).update({

        feed: firestore.FieldValue.arrayUnion(feed),
    });
  }

  export function createFeed({id ,feed}){

    return feedsCollection.doc(id).set({
        feed: firestore.FieldValue.arrayUnion(feed),
    });
  }

  // 컬렉션 feeds -> id 가 있는지 검사
  export function feedIdSearch(id){
    return feedsCollection.get().then(function (querySnapshot){
        querySnapshot.forEach(function (doc) {
            if (doc.id == id){
                console.log(doc.id, '=>', doc.data());               
            }
        });
    });
  }

      // 컬렉션 feeds -> id 있는지 확인 
  export function feedIdExists({id ,feed}){
     feedsCollection.doc(id).get().then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {//있음
          console.log('User data: ', documentSnapshot.data());
          addFeed({id, feed})

        }else{ //없음
            createFeed({id ,feed})
        }

      });
    }
