import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import auth from "@react-native-firebase/auth";

GoogleSignin.configure({
    webClientId: '603930050293-avrif6sguq0egvl91gjdogd35uudck1h.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

function GoogleSigninBTN() {
    async function handleSignIn() {
        try {
          await GoogleSignin.signIn();
          // User is signed in.
        } catch (error) {
          // Error occurred.
        }
    }
    
    return (
    <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleSignIn}
    />
    );
}


async function handleSignIn() {
  try {
    const { idToken, accessToken } = await GoogleSignin.signIn();
    const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
    await auth().signInWithCredential(credential);
    // User is signed in.
  } catch (error) {
    // Error occurred.
  }
}

export default GoogleSigninBTN