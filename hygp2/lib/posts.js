// 파이어베이스에 포스트 등록하기

import firestore from '@react-native-firebase/firestore'

export const postsCollection = firestore().collection('posts');

export function createPost({user, photoURL, description}) {
    return postsCollection.add({
      user,
      photoURL,
      description,
      createAt : firestore.FieldValue.serverTimestamp(),
    });
  }

export const PAGE_SIZE = 12;
export async function getPosts(){
  const snapshot = await postsCollection
  .orderBy('createAt','desc')
  .limit(PAGE_SIZE)
  .get();

  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

export async function getOlderPosts(id){
  const cursorDoc = await postsCollection.doc(id).get();
  const snapshot = await postsCollection
  .orderBy('createdAt','desc')
  .startAfter(cursorDoc)
  .limit(PAGE_SIZE)
  .get();

  const posts =snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

//최근 작성한 포스트 불러오기
export async function getNewerPosts(id){
  const cursorDoc = await postsCollection.doc(id).get();
  const snapshot = await postsCollection
    .orderBy('createdAt', 'desc')
    .endBefore(cursorDoc)
    .limit(PAGE_SIZE)
    .get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return posts;
}
