import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
    walletData: Partial<WalletType>
): Promise<ResponseType> => {
    try{
        let walletToSave = {...walletData};

        if(walletData.image && walletData?.image?.uri){
            const imageUploadResponse = await uploadFileToCloudinary(
                walletData.image, "wallets"
            );
            if(!imageUploadResponse.success){
                return {
                    success:false,
                    msg: imageUploadResponse.msg || "Failed to upload profile image"
                }
            }

            walletToSave.image = imageUploadResponse.data;
        }

        if(!walletData?.id){
            // new wallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpense = 0;
            walletToSave.created = new Date();

        }
        const walletRef = walletData?.id ? doc(firestore, "wallets", walletData?.id)
         : doc(collection(firestore, "wallets"));

        await setDoc(walletRef, walletToSave, {merge: true});

        return{ success: true, data : {...walletToSave, id: walletRef.id}};
    } catch(error: any) {
        console.log("error updating in userService : ",error)
        return{ success: false};
    }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> =>{
    try {

        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);

        await deleteTrasactionsByWalletId(walletId);

        return {success: true, msg: "Wallet deleted successfully"}
    }catch(err:any) {
        console.log("error delering wallet : ",err)
        return {success: false, msg: err}

    }
}


export const deleteTrasactionsByWalletId = async (walletId: string) : Promise<ResponseType> => {
    try {

        let hasMoreTransactions = true;

        while(hasMoreTransactions){
            const transactionsQuery = query(
                collection(firestore, "transactions"),
                where("walletId", "==", walletId)
            );

            const transactionsSnapshot = await getDocs(transactionsQuery);

            if(transactionsSnapshot.size == 0){
                hasMoreTransactions = false;
                break;
            }

            const batch = writeBatch(firestore);

            transactionsSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            console.log("deleted transactions : ",transactionsSnapshot.size)

        }


        const transactionsRef = collection(firestore, "transactions");
        const transactionsSnapshot = await getDocs(transactionsRef);
        return {success: true, msg: "Transactions deleted successfully"}
    } catch (error: any) {
        console.log("error deleting transactions by wallet id : ",error)
        return {success: false, msg: error}
    }
}