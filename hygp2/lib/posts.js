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

export async function getOlderPosts(user) {
  return getPosts({
    user,
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

// posts에 참조된 user의 값을 변경해준다
// export function updateUserProfile({id, photoURL}) {
//   return postsCollection.doc(id).collection('user').update({
//     photoURL,
//   });
// }
///////////////////////////////////////////////////////////

const testCollection = firestore().collection('test');

export function createTest({user, name}) {
  return testCollection.add({
    user: user,
    name: name,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

// posts에 참조된 user의 값을 변경해준다
export function updateTest({displayName, user}) {
  //   const rows = testCollection.collection('user').where('id', '==', id); //같은 id를 가져옴
  //  ;
    return testCollection.where('name', '==', '전명재')
    .get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log('doc: ',doc);
        console.log('doc.ref: ',doc.ref.update);
        doc.ref.update({displayName : displayName});
      });
    });

};

export function readTest(name){
  return testCollection.doc(name).get();
}

// const messageRef = db.collection('rooms').doc('roomA')
//   .collection('messages').doc('message1');