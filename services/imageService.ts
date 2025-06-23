import { CLOUDINATY_CLOUD_NAME, CLOUDINATY_UPLOAD_PRESET } from "@/constants";
import { ResponseType } from "@/types";
import axios from 'axios';
 
export const CLOUDINATY_API_URL = "https://api.cloudinary.com/v1_1/"+CLOUDINATY_CLOUD_NAME+"/image/upload";

export const uploadFileToCloudinary = async (
    file: {uri?: string} | string,
    fodlerName: string
): Promise<ResponseType> => {
    try{
        if(!file) return {success: true, data: null}
        if(typeof file == 'string'){
            return {success: true, data : false};
        }

        if(file && file.uri){
            const formData = new FormData();
            formData.append("file", {
                uri: file?.uri,
                type: "image/jpeg",
                name: file?.uri?.split("/").pop() || "file.jpg"
            } as any);

            formData.append("upload_preset", CLOUDINATY_UPLOAD_PRESET);
            formData.append("folder", fodlerName);

            const respose = await axios.post(CLOUDINATY_API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            console.log("upload image result : ", respose?.data);
            
            return {  success: true, data: respose?.data?.secure_url}

        }

        return {success:true};
    } catch(error:any){
        console.log("got error : ",error)
        return {success: false, msg: error.message || "Could not upload the file"};
    }
};


export const getProfileImage = (file:any)=>{
    if(file && typeof file == 'string') return file;
    if(file && typeof file == 'object') return file.uri;

    return require('../assets/images/defaultAvatar.png');
}

export const getFielPath = (file: any) => {
    if (file && typeof file == "string") return file;
    if (file && typeof file == "object") return file.uri;

    return null;
}