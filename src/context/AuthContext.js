import { createContext, useContext, useState, useEffect } from 'react';

import { auth } from '../firebase'

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    const updateEmail = (email) => {
        return currentUser.updateEmail(email)
    }

    const updatePassword = (password) => {
        return currentUser.updatePassword(password)
    }

    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email);
    }

    const logout = () => {
        setLoggedIn(false);
        return auth.signOut();
    }

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    }

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);


    const value = {
        currentUser,
        signup,
        login,
        loggedIn,
        setLoggedIn,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

