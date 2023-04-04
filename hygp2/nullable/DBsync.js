import firestore from '@react-native-firebase/firestore';

export function getCollection(collectionName) {
  return firestore().collection(collectionName);
}

export function createData({ collectionName, user, photoURL, description }) {
  const collection = getCollection(collectionName);
  return collection.add({
    user,
    photoURL,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

export const PAGE_SIZE = 12;
export async function getData({ collectionName, userId, mode, id } = {}) {
  const collection = getCollection(collectionName);
  let query = collection.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
  if (userId) {
    query = query.where('user.id', '==', userId);
  }
  if (id) {
    const cursorDoc = await collection.doc(id).get();
    query =
      mode === 'older'
        ? query.startAfter(cursorDoc)
        : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();

  const Datas = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return Datas;
}

export async function getOlderDatas({ collectionName, id, userId }) {
  return getDatas({
    collectionName,
    id,
    mode: 'older',
    userId,
  });
}

export async function getNewerDatas({ collectionName, id, userId }) {
  return getDatas({
    collectionName,
    id,
    mode: 'newer',
    userId,
  });
}

export function removeData({ collectionName, id }) {
  const collection = getCollection(collectionName);
  return collection.doc(id).delete();
}

export function updateData({ collectionName, id, description }) {
  const collection = getCollection(collectionName);
  return collection.doc(id).update({
    description,
  });
}
