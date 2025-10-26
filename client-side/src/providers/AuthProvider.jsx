import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/firebase.config";


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

   const signInWithGooglePopup = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    // ensure latest fields are loaded
    try { await cred.user.reload(); } catch {}
    return cred;
  };

  // useEffect(() => {
  //   const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });
  //   return () => {
  //     unSubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // optional: ensure latest profile right after OAuth
          try { await firebaseUser.reload(); } catch {}
          setUser(firebaseUser); // <-- store the real object
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const authInfo = useMemo(
    () => ({
      user,
      createUser,
      logOut,
      signIn,
      setUser,
      auth,
      loading,
      signInWithGooglePopup,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
