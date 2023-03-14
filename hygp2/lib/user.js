// 파이어베이스에 사용자 정보가 담긴 문서를 저장

import firestore from '@react-native-firebase/firestore'

export const usersCollection = firestore().collection('users');

export function createUser({id, displayName, photoURL}){
    return usersCollection.doc(id).set({
        id,
        displayName,
        photoURL,
    });
}

export async function getUser(id){
    const doc = await usersCollection.doc(id).get();
    return doc.data();
}