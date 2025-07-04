import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";


export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
) : Promise<ResponseType> => {
    try {
        const {id, type, walletId, amount, image} = transactionData;
        if(!amount || amount<=0 || !walletId || !type) {
            return {success: false, msg: "Invalid data"}
        }

        if(id){
            // update existing

        } else {
            // update wallet for new transaction
            let resp = await updateWalletForNewTransaction(
                walletId,
                Number(amount),
                type
            );

            if(!resp.success) return resp;

            if(image){
                const imageUploadResponse = await uploadFileToCloudinary(
                    image, "transactions"
                );
                if(!imageUploadResponse.success){
                    return {
                        success:false,
                        msg: imageUploadResponse.msg || "Failed to upload receipt transaction image"
                    }
                }
                transactionData.image = imageUploadResponse.data;
            }
        }

        const transactionRef = id
        ? doc(firestore, "transactions", id)
        : doc(collection(firestore, "transactions"))

        await setDoc(transactionRef, transactionData, {merge:true});

        return {success: true, data : {...transactionData, id: transactionRef.id}};
    }catch(err:any) {
        console.log("error delering wallet : ",err)
        return {success: false, msg: err}

    }
}


const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string
) => {
    try {
        const walletRef = doc(firestore, "wallets", walletId)
        const walletSnapshot = await getDoc(walletRef)

        // check wallet existance
        if(!walletSnapshot.exists()){
            console.log("Wallet  Wallet found")
            return {success: false, msg: "Wallet Wallet found"}
        }

        // check wallet balance
        const walletData = walletSnapshot.data() as WalletType
        if(type == "expense" && walletData.amount! - amount <0){
            return {success: false, msg: "Selected wallet does not have enough balance"}
        }

        // calculate new balance
        const updateType = type == "income" ? "totalIncome" : "totalExpense";
        const updateWalletAmount = type == "income" 
        ? (Number(walletData.amount) + amount) 
        : (Number(walletData.amount) - amount) 

        // calculate total of the transaction on the wallet
        const updateTotal = type == "income" 
        ? (Number(walletData.totalIncome) + amount) 
        : (Number(walletData.totalExpense) + amount)

        await updateDoc(walletRef, {
            amount: updateWalletAmount,
            [updateType]: updateTotal
            }
        );

        return {success: true}
    }catch(err:any) {
        console.log("error delering wallet : ",err)
        return {success: false, msg: err}
    }
}