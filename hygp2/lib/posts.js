import firestore from '@react-native-firebase/firestore';

const postsCollection = firestore().collection('posts');

export function createPost({user, photoURL, description}) {
  return postsCollection.add({
    user,
    photoURL,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

export const PAGE_SIZE = 12;
export async function getPosts({userId, mode, id} = {}) {
  let query = postsCollection.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
  if (userId) {
    query = query.where('user.id', '==', userId);
  }
  if (id) {
    const cursorDoc = await postsCollection.doc(id).get();
    query =
      mode === 'older'
        ? query.startAfter(cursorDoc)
        : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();

  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

export async function getOlderPosts(id, userId) {
  return getPosts({
    id,
    mode: 'older',
    userId,
  });
}

export async function getNewerPosts(id, userId) {
  return getPosts({
    id,
    mode: 'newer',
    userId,
  });
}

export function removePost(id) {
  return postsCollection.doc(id).delete();
}

export function updatePost({id, description}) {
  return postsCollection.doc(id).update({
    description,
  });
}

export function createTest({user, name}) {
  return testCollection.add({
    user: user,
    name: name,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

// posts에 참조된 user의 값을 변경해준다
export function updateProfile({id, user}){
  return postsCollection.where('user.id', '==', id).get().then(function (querySnapshot) {
    console.log("user :", user);
    querySnapshot.forEach(function (doc) {
      doc.ref.update({user : user});
    });
  });

}

