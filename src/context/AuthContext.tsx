import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Create or update user profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            role: 'student',
            bookmarks: [],
            createdAt: serverTimestamp(),
          });
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginWithGoogle = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/cancelled-popup-request') {
        alert("লগইন পপআপটি বন্ধ হয়ে গেছে বা অন্য একটি অনুরোধ প্রক্রিয়াধীন আছে। দয়া করে আবার চেষ্টা করুন।");
      } else if (error.code === 'auth/popup-blocked') {
        alert("আপনার ব্রাউজার পপআপ ব্লক করেছে। দয়া করে পপআপ অ্যালাউ করুন।");
      } else if (error.code === 'auth/api-key-not-valid') {
        alert("ফায়ারবেস এপিআই কী সঠিক নয়। দয়া করে অ্যাডমিনকে জানান।");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("এই ডোমেইনটি ফায়ারবেসে অনুমোদিত নয়। দয়া করে ফায়ারবেস কনসোলে গিয়ে এই ডোমেইনটি (Authorized Domains) তালিকায় যুক্ত করুন।");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
