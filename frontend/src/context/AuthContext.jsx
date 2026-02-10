import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Try fetching from users (Citizens)
                let userRef = doc(db, 'users', user.uid);
                let userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserData({ ...userSnap.data(), id: user.uid });
                } else {
                    // Try fetching from departments
                    userRef = doc(db, 'departments', user.uid);
                    userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserData({ ...userSnap.data(), id: user.uid, role: 'department' });
                    }
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
