const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.getRecommendedTeams = functions.https.onCall(async (data) => {
  const userRef = admin.firestore().collection("user").doc(data.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "No such user!");
  }

  const userInterests = userDoc.data().interests;
  const teamsRef = admin.firestore().collection("teams");
  const recommendedTeams = [];

  for (const interest of userInterests) {
    const snapshot = await teamsRef
        .where("hashtags", "array-contains", interest).get();
    snapshot.forEach((doc) => {
      recommendedTeams.push({id: doc.id, ...doc.data()});
    });
  }

  return recommendedTeams;
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
