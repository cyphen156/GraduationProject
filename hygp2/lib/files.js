import firestore from '@react-native-firebase/firestore';

const filesCollection = firestore().collection('files');

export function createFile({user, file, photoURL}) {
  return filesCollection.add({
    user,
    //description,
    file,
    createdAt: firestore.FieldValue.serverTimestamp(),
    photoURL,
  });
}

export const PAGE_SIZE = 12;

export async function getFiles({userId, mode, id} = {}) {
  let query = filesCollection.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
  if (userId) {
    query = query.where('user.id', '==', userId);
  }
  if (id) {
    const cursorDoc = await filesCollection.doc(id).get();
    query =
      mode === 'older'
        ? query.startAfter(cursorDoc)
        : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();

  const files = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return files;
}

export async function getOlderFiles(id, userId) {
  return getFiles({
    id,
    mode: 'older',
    userId,
  });
}

export async function getNewerFiles(id, userId) {
  return getFiles({
    id,
    mode: 'newer',
    userId,
  });
}

export function removeFile(id) {
  return filesCollection.doc(id).delete();
}

export function updateFile({id, description, file}) {
  return filesCollection.doc(id).update({
    description,
    file,
  });
}
