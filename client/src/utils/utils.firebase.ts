import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log(token, user);
        return {
            user: user,
            token: token
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// Sign out
export const mySignOut = () => {
    signOut(auth).then(() => {
    }).catch((error) => {
        console.error(error);
    });
};
