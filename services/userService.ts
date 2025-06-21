import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try{
        if(updatedData.image && updatedData?.image?.uri){
            const imageUploadResponse = await uploadFileToCloudinary(
                updatedData.image, "users"
            );
            if(!imageUploadResponse.success){
                return {
                    success:false,
                    msg: imageUploadResponse.msg || "Failed to upload profile image"
                }
            }

            updatedData.image = imageUploadResponse.data;
        }

        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, updatedData);

        return{ success: true, msg : "updated successefully"};
    } catch(error: any) {
        console.log("error updating in userService : ",error)
        return{ success: false};
    }
}