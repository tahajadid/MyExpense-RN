import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserType>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            //console.log("firebase user: ", firebaseUser)
            if(firebaseUser){
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName
                });
                updateUserData(firebaseUser.uid)
                router.replace("/(tabs)")
            }else{
                setUser(null);
                router.replace("/(auth)/welcome");
            }
        });

        return ()=> unsub();
    }, [])



    const login = async(email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch(error: any) {
            let msg = error.message;
            console.log("error message : ", msg);
            // check for a code error
            if(msg.includes("(auth/invalid-credential)")){
                msg =  "Wrong email or password";
            } else if(msg.includes("(auth/invalid-email)")){
                msg =  "This email have not an account";
            }
            return { success: false, msg };
        }
    };

    const register = async(email: string, password: string, name: string) => {
        try {
            let response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response?.user?.uid), {
                name,
                email,
                // Fixed the typo from 'uis' to 'uid'
                uid: response?.user?.uid,
            });
            return { success: true };
        } catch(error: any) {
            let msg = error.message;
            if(msg.includes("(auth/email-already-in-use)")){
                msg =  "This email is already in use";
            }
            return { success: false, msg };
        }
    };

    const updateUserData = async(uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data?.uid,
                    email: data.email || null,
                    name: data.name || null,
                    image: data.image || null,
                };
                // Add this line to actually update the user state
                setUser(userData);
            }
        } catch(error: any) {
            let msg = error.message;
            console.log("error : ", msg);
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    };

    return ( 
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context) {
        // Fixed the typo in the error message
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};