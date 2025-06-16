import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try{
        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, updatedData);

        return{ success: true, msg : "updated successefully"};
    } catch(error: any) {
        console.log("error updating in userService : ",error)
        return{ success: false};
    }
}