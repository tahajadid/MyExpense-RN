import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";


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
            const oldTransactionSnapshot = await getDoc(
                doc(firestore,"transactions",id)
            );
            const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
            const shouldRevertOriginal = 
                oldTransaction.type != type ||
                oldTransaction.amount != amount ||
                oldTransaction.walletId != walletId;

            if(shouldRevertOriginal){
                let res = await revertAndUpdateWallets(
                    oldTransaction, Number(amount), type, walletId
                )
                if(!res.success) return res;
            }

            // Handle image for existing transactions
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
            } else {
                // If no new image provided, keep the existing image
                transactionData.image = oldTransaction.image;
            }
        

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
        console.log("error deleting wallet : ",err)
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


const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string
) => {
    try {
        const originalWalletSnapshot = await getDoc(
            doc(firestore, "wallets", oldTransaction?.walletId)
        )

        const originalWallet = originalWalletSnapshot.data() as WalletType

        let newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId)
        )

        let newWallet = newWalletSnapshot.data() as WalletType

        const revertType = oldTransaction.type == "income" ? "totalIncome" : "totalExpense"

        const revertIncomeExpense : number = 
        oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

        const revertWalletAmount =
            Number(originalWallet.amount) + revertIncomeExpense;


        const revertIncomeExpenseAmount =
            Number(originalWallet[revertType]) - Number(revertIncomeExpense);

        if(newTransactionType=="expense"){
            // if user tries to convert income to expense on the same wallet
            // or if the user tries to increase the expense amount and don't have enough balance
            if(oldTransaction.walletId==newWalletId && revertWalletAmount<newTransactionAmount){
                return {
                    success: false,
                    msg: "The selected wallet don't have enough balance"
                }
            }

            if(newWallet.amount!< newTransactionAmount){
                return {
                    success: false,
                    msg: "The selected wallet don't have enough balance"
                }
            }
        }

        await createOrUpdateWallet({
            id: oldTransaction.walletId,
            amount: revertWalletAmount,
            [revertType]: revertIncomeExpenseAmount
        })

        // now we swhould refresh the new Wallet 

        newWalletSnapshot = await getDoc(
            doc(firestore, "wallets", newWalletId)
        )

        newWallet = newWalletSnapshot.data() as WalletType;

        const updateType = newTransactionType == "income" 
            ? "totalIncome" 
            : "totalExpense";
            

        const updatedTransactionAmount: number = newTransactionType == "income" 
            ? Number(newTransactionAmount) 
            : -Number(newTransactionAmount);

        const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;
        
        const newIncomeExpenseAmount = Number(
            newWallet[updateType]! + Number(newTransactionAmount)
        );

        await createOrUpdateWallet({
            id: newWalletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });


        return {success: true}
    }catch(err:any) {
        console.log("error revertAndUpdate Wallets : ",err)
        return {success: false, msg: err}
    }
}


export const deleteTransaction = async (id: string, walletId: string) => {
    try {
        const transactionRef = doc(firestore, "transactions", id)
        const transactionSnapshot = await getDoc(transactionRef)

        if(!transactionSnapshot.exists()){
            return {success: false, msg: "Transaction not found"}
        }

        const transactionData = transactionSnapshot.data() as TransactionType;

        const transactionType = transactionData?.type;
        const transactionAmount = transactionData?.amount;

        const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId))
        const walletData = walletSnapshot.data() as WalletType;

        // check fields that should be updates ased on transaction type
        const updateType = transactionType == "income" ? "totalIncome" : "totalExpense";
        const newWalletAmount = walletData?.amount! - (transactionType == "income" ? transactionAmount : -transactionAmount)
        const newWalletIncomeExpense = walletData[updateType]! - transactionAmount;

        // if it is am expense then the wallet amount can go below zero
        if(transactionType == "expense" && newWalletAmount < 0){
            return {success: false, msg: "Wallet amount can't go below zero"}
        }

        await createOrUpdateWallet({
            id: walletId,
            amount: newWalletAmount,
            [updateType]: newWalletIncomeExpense
        })

        await deleteDoc(transactionRef)

        return {success: true}
    }catch(err:any) {
        console.log("error deleting transaction : ",err)
        return {success: false, msg: err}
    }
}