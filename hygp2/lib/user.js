// 파이어베이스에 사용자 정보가 담긴 문서를 저장

import firestore from '@react-native-firebase/firestore'
import { Alert } from 'react-native';

export const usersCollection = firestore().collection('user');

export function createUser({id, displayName, photoURL}) {
    return usersCollection.doc(id).set({
      id,
      displayName,
      photoURL,
    });
  }
  
  export async function getUser(id) {
    const doc = await usersCollection.doc(id).get();
  
    return doc.data();
  }

  export function updateUser({id, displayName, photoURL}) {
    return usersCollection.doc(id).update({
      displayName,
      photoURL,
    });
  }

  // 유저 displayName 중복 체크하기 : 아이디 사용가능 여부
  export async function nameCheck({id, displayName}) {
    
     let check = true;

     usersCollection.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, '=>', doc.data());
        if(displayName == doc.data().displayName){
          console.log('중복 있음');
          Alert.alert('중복 있음')
          check = false;
        }
        
      });
    }).then(() => {
      console.log('check : ', check);
      if (check == true){

        Alert.alert('변경 가능')
        return check;
      }
      return check;
    });




  }