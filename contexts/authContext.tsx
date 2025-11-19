import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
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

    const forgotPassword = async(email: string) => {
        try {
            console.log("Attempting to send password reset email to:", email);
            await sendPasswordResetEmail(auth, email);
            console.log("Password reset email sent successfully to:", email);
            return { success: true };
        } catch(error: any) {
            // Log full error details for debugging
            console.error("Forgot password error:", {
                code: error.code,
                message: error.message,
                email: email,
                fullError: error
            });
            
            let msg = error.message || "An unknown error occurred";
            
            // Handle common Firebase errors with user-friendly messages
            if(error.code === "auth/user-not-found" || msg.includes("(auth/user-not-found)")){
                msg = "No account found with this email address";
            } else if(error.code === "auth/invalid-email" || msg.includes("(auth/invalid-email)")){
                msg = "Invalid email address format";
            } else if(error.code === "auth/too-many-requests" || msg.includes("(auth/too-many-requests)")){
                msg = "Too many requests. Please try again later";
            } else if(error.code === "auth/network-request-failed" || msg.includes("network")){
                msg = "Network error. Please check your internet connection";
            } else if(error.code === "auth/quota-exceeded" || msg.includes("quota")){
                msg = "Email quota exceeded. Please try again later";
            } else {
                // For any other error, show a generic message but log the actual error
                msg = `Failed to send reset email: ${error.message || "Unknown error"}`;
            }
            
            return { success: false, msg };
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData,
        forgotPassword
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