import PropTypes from 'prop-types';
import { createContext, useEffect, useState, useRef } from 'react'; // Import useRef
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import auth from '../firebase/firebase.config';
import axios from 'axios';
export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();






const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  // useRef to store the previous user state, resilient across StrictMode remounts
  const prevUserRef = useRef(null); // Keep track of the user state from the previous render

  // Function to save token to localStorage and set Axios header
  const saveToken = async (idToken) => {
    try {
      if (idToken) {
        localStorage.setItem('access-token', idToken);
        console.log('AuthProvider: Firebase ID Token stored in localStorage.');
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        console.log('AuthProvider: Axios Authorization header set.');
      } else {
        localStorage.removeItem('access-token');
        delete axios.defaults.headers.common['Authorization'];
        console.log('AuthProvider: Firebase ID Token and Axios header removed (null token provided).');
      }
    } catch (error) {
      console.error('AuthProvider: Error handling token in localStorage or setting Axios header:', error);
    }
  };

  // Function to remove token from localStorage and Axios header
  const removeToken = () => {
    localStorage.removeItem('access-token');
    delete axios.defaults.headers.common['Authorization'];
    console.log('AuthProvider: Access token removed from localStorage and Axios header on explicit logout/no user.');
  };

  // --- Firebase Authentication Methods ---
  // These are fine, they just call Firebase functions and set loading
  const createUser = (email, password) => {
    setLoading(true);
    console.log('AuthProvider: createUser called.');
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    console.log('AuthProvider: signIn called.');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    console.log('AuthProvider: signInWithGoogle called.');
    return signInWithPopup(auth, googleProvider);
  };

  const resetPassword = (email) => {
    setLoading(true);
    console.log('AuthProvider: resetPassword called.');
    return sendPasswordResetEmail(auth, email);
  };

const logOut = async () => {
  setLoading(true);
  console.log('AuthProvider: logOut called (explicitly by user).');
  try {
    // Remove both tokens (custom JWT and Firebase token)
    localStorage.removeItem("newUserToken"); // 👈 remove manual JWT
    localStorage.removeItem("access-token"); // 👈 remove Firebase token
    delete axios.defaults.headers.common['Authorization'];

    // Sign out from Firebase too
    await signOut(auth); 
    console.log('AuthProvider: Firebase signOut successful. Tokens removed.');
  } catch (error) {
    console.error('AuthProvider: Error during logout:', error);
  } finally {
    setLoading(false);
  }
};

  const updateUserProfile = (name, photo) => {
    console.log('AuthProvider: updateUserProfile called.');
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };
  // --- END Firebase Authentication Methods ---


  // Main Effect for Firebase Auth State Changes
  useEffect(() => {
    console.log('AuthProvider useEffect: Running onAuthStateChanged listener setup.');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // console.log('onAuthStateChanged: User status changed to:', currentUser ? currentUser.email : 'null');

      // Update user state first
      setUser(currentUser);

      // Check if this is a genuine user or a temporary null from StrictMode/initial state
      // We only want to remove token if the user genuinely becomes null (not just a remount artifact)
      // or if there was no user before and still no user.
      if (!currentUser && prevUserRef.current) {
        // If currentUser is null, BUT we previously had a user,
        // it means a logout or session expiration occurred.
        // Or it could be StrictMode unmount/remount - but if the user *was* present
        // before this specific onAuthStateChanged firing, we assume it's a real change.
        console.log('onAuthStateChanged: Detected transition from user to null. Removing token.');
        removeToken(); // Clear token for real logouts/expirations
      } else if (!currentUser && !prevUserRef.current && localStorage.getItem('access-token')) {
         // This handles scenarios where component remounts, no user is immediately detected
         // but a token *still exists* in local storage (meaning a potential previous session)
         console.log('onAuthStateChanged: No user, but token in localStorage. Clearing old token.');
         removeToken(); // Ensure token is cleared if no user and old token exists
      } else if (currentUser) {
        // User is logged in. Get and save token.
        try {
          const idToken = await currentUser.getIdToken(true); // Force refresh to get latest token
          await saveToken(idToken); // Always save/update token for active user
          console.log('onAuthStateChanged: Firebase ID Token obtained and saved/updated.');
        } catch (error) {
          console.error('onAuthStateChanged: Error getting or saving ID Token:', error);
          // If token fetching fails after a user is detected, force a full logout.
          await logOut();
        }
      }

      // After determining auth state and token, set loading/checked states
      setLoading(false); // Auth check is complete
      setIsAuthChecked(true); // Initial check is complete
      console.log('onAuthStateChanged: loading set to false, isAuthChecked set to true.');

      // Update the ref to the current user for the next render/effect cycle
      prevUserRef.current = currentUser;
    });

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
      console.log('AuthProvider useEffect: Cleanup onAuthStateChanged listener executed.');
    };
  }, []); // Empty dependency array means this runs once on mount/initialization

  // No separate useEffect for Axios headers needed, it's now handled directly in saveToken/removeToken
  // and the main onAuthStateChanged useEffect.

  const authInfo = {
    user,
    loading,
    isAuthChecked,
    setLoading, // Keep setLoading exposed if external components need to indicate loading (e.g., during login API calls)
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;