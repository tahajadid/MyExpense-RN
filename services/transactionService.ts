import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { getLastMonths, getLatSevenDays, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
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

// get the weekly stats
export const fetchWeeklyStats = async (
    uid: string
) : Promise<ResponseType> => {

    
    try {
        const db = firestore
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7)

        const transactionQuery = query(
            collection(db, "transactions"),
            where("date",">=",Timestamp.fromDate(sevenDaysAgo)),
            where("date","<=",Timestamp.fromDate(today)),
            orderBy("date","desc"),
            where("uid","==",uid)
        )

        const querySnapshot = await getDocs(transactionQuery)
        const weeklyData = getLatSevenDays();
        const transactions: TransactionType[] = [];

        
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;

            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDateoNE = (transaction.date as Timestamp)

            const transactionDate = (transaction.date as Timestamp)
                .toDate()
                .toISOString()
                .split("T")[0]

                const dayData = weeklyData.find((day) => day.date == transactionDate)

                if(dayData){
                    if(transaction.type == "income"){
                        dayData.income += transaction.amount;
                    } else {
                        dayData.expense += transaction.amount;
                    }
                }
        });

        const stats = weeklyData.flatMap((day) => 
            [
                {
                    value: day.income,
                    label: day.day,
                    spacing: scale(4),
                    labelWidth: scale(30),
                    frontColor: colors.white
                },
                { value : day.expense, frontColor: colors.black}
            ]
        );

        return {success: true, data:{stats, transactions}}
    }catch(err:any) {
        console.log("error fetch weekly stats : ",err)
        return {success: false, msg: err}
    }
}


// get the monthly stats
export const fetchMonthlyStats = async (
    uid: string
) : Promise<ResponseType> => {
    try {
        const db = firestore
        const today = new Date();
        const twelveMonthsAgo = new Date(today);
        twelveMonthsAgo.setMonth(today.getMonth() - 7)

        const transactionQuery = query(
            collection(db, "transactions"),
            where("date",">=",Timestamp.fromDate(twelveMonthsAgo)),
            where("date","<=",Timestamp.fromDate(today)),
            orderBy("date","desc"),
            where("uid","==",uid)
        )

        const querySnapshot = await getDocs(transactionQuery)
        const monthlyData = getLastMonths();
        const transactions: TransactionType[] = [];

        
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;

            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp).toDate()

            const monthName = transactionDate.toLocaleString("default", {
                month: "short"
            })

            const shortYear = transactionDate.getFullYear().toString().slice(-2)

            const monthData = monthlyData.find((month)=> month.month ===`${monthName} ${shortYear}`)


            if(monthData){
                if(transaction.type == "income"){
                    monthData.income += transaction.amount;
                } else {
                    monthData.expense += transaction.amount;
                }
            }
        });

        // reformat monthlyData for the bar chart with income and expense entries for each month

        const stats = monthlyData.flatMap((month) => 
            [
                {
                    value: month.income,
                    label: month.month,
                    spacing: scale(4),
                    labelWidth: scale(45),
                    frontColor: colors.white
                },
                { value : month.expense, frontColor: colors.black}
            ]
        );

        return {success: true, data:{stats, transactions}}
    }catch(err:any) {
        console.log("error fetch monthly stats : ",err)
        return {success: false, msg: err}
    }
}

// get the monthly stats
export const fetchYearlyStats = async (
    uid: string
) : Promise<ResponseType> => {
    try {
        const db = firestore
        const today = new Date();
        const twelveMonthsAgo = new Date(today);
        twelveMonthsAgo.setMonth(today.getMonth() - 7)

        const transactionQuery = query(
            collection(db, "transactions"),
            orderBy("date","desc"),
            where("uid","==",uid)
        )

        const querySnapshot = await getDocs(transactionQuery)
        const transactions: TransactionType[] = [];

        const firstTransaction = querySnapshot.docs.reduce((earliest, doc)=>{
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate: earliest;
        }, new Date())

        const firstYear = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();

        const yearlyData = getYearsRange(firstYear, currentYear);
        
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;

            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionYear = (transaction.date as Timestamp).toDate().getFullYear();

            const yearData = yearlyData.find((item:any)=> item.year === transactionYear.toString())

            if(yearData){
                if(transaction.type == "income"){
                    yearData.income += transaction.amount;
                } else {
                    yearData.expense += transaction.amount;
                }
            }
        });

        // reformat monthlyData for the bar chart with income and expense entries for each month

        const stats = yearlyData.flatMap((year: any) => 
            [
                {
                    value: year.income,
                    label: year.year,
                    spacing: scale(4),
                    labelWidth: scale(35),
                    frontColor: colors.white
                },
                { value : year.expense, frontColor: colors.black}
            ]
        );

        return {success: true, data:{stats, transactions}}
    }catch(err:any) {
        console.log("error fetch yearly stats : ",err)
        return {success: false, msg: err}
    }
}