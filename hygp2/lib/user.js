// 파이어베이스에 사용자 정보가 담긴 문서를 저장

import firestore from '@react-native-firebase/firestore'
import { da } from 'date-fns/locale';
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
  export async function nameCheck(displayName) {
    
     usersCollection.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        
        if(displayName == doc.data().displayName){
          console.log('닉네임 있음');    
          console.log(doc.id, '=>', doc.data());   
          return doc.data();
        }    
      });
    });
    
  }
  // user.id로 user값 가져오기 
  export async function fromIdtoUser(friends){
    usersCollection.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, '=>', doc.data());   
        const arr = friends.map((friend) => {
          console.log(friend); 
        });
          
          
        
      });
    });
  }

  export async function getUserId(friendArray) {
    let data = [];
    await friendArray.forEach( async (id) => {
      console.log('id', id);
  
      await usersCollection.doc(id).get()
      .then((snapshot) => {
        data.push(snapshot.data())
        
      });
    })

    return data
  }