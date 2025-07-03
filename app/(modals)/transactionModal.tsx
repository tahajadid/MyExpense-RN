
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { transactionTypes } from '@/constants/mockData';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { deleteWallet } from '@/services/walletService';
import { TransactionType, WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const TransactionModal = () => {

    const {user, updateUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [transaction, setTransaction] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description: "",
        category: "",
        date: new Date(),
        walletId: "",
        image: null
    });

    const router = useRouter();

    const {
        data: wallets,
        error: walletError,
        loading: walletLoading
    } = useFetchData<WalletType>("wallets",[
        where("uid","==", user?.uid), 
        orderBy("created","desc")
      ]
    );
    
    const oldTransaction: {name: string, image:string, id:string} = useLocalSearchParams();
    console.log("oldTransaction : ", oldTransaction)

    useEffect( () => {
        if(oldTransaction?.id) {
            setTransaction({
                name: oldTransaction?.name,
                image: oldTransaction?.image
            })
        }
    },[])


    
    const onSubmit = async () => {
        /*
        let {name, image} = transaction;
        if(!name.trim() || !image){
            Alert.alert("Wallet","Please enter the new name")
            return;
        }

        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        };

        if(oldWallet?.id) data.id = oldWallet?.id

        setLoading(true);
        const respose = await createOrUpdateWallet(data);
        setLoading(false);

        if(respose.success){
            // data is updated
            router.back();
        } else {
            Alert.alert("User","There is a probleme");
        }
            */
    };
    

    const onWalletDelete = async () => {
        if(!oldTransaction?.id) return;
        setLoading(true);
        const res = await deleteWallet(oldTransaction?.id);
        setLoading(false);
        if(res.success){
            router.back();
        }else{
            Alert.alert("Wallet",res.msg)
        }

    }
    const deletWalletAlert = () => {
        Alert.alert("Confirm","Delete Wallet\nThis action will remove all the related transactions of this wallet",
        [
            {
                text: "Cancel",
                onPress: ()=> console.log("camcel action"),
                style: 'cancel'
            },
            {
                text: "Delete",
                onPress: ()=> onWalletDelete(),
                style: 'destructive'
            }
        ]);
    }


  return (
    <ModalWrapper>
        <View style={styles.container}>
            <Header title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
            leftIcon={<BackButton/>}
            style={{ marginBottom: spacingY._10 }}/>

            {/** Form */}
            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200}>Type</Typo>
                    <Dropdown
                        style={styles.dropdownContainer}
                        // placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelectedText}
                        iconStyle={styles.dropdownIcon}
                        data={transactionTypes}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        itemTextStyle={styles.dropdownItemText}
                        itemContainerStyle={styles.dropdownItemContainer}
                        containerStyle={styles.dropdownListContainer}
                        activeColor={colors.neutral700}
                        value={transaction.type}
                        onChange={(item) => {
                            setTransaction({...transaction, type: item.value})
                        }}
                        />
                </View>

                <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200}>Wallet</Typo>
                    <Dropdown
                        style={styles.dropdownContainer}
                        placeholder={"Select Wallet"}
                        selectedTextStyle={styles.dropdownSelectedText}
                        iconStyle={styles.dropdownIcon}
                        data={wallets.map((wallet) => ({
                            label: `${wallet?.name} ($${wallet.amount})`,
                            value: wallet?.id
                        }))}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        itemTextStyle={styles.dropdownItemText}
                        itemContainerStyle={styles.dropdownItemContainer}
                        containerStyle={styles.dropdownListContainer}
                        activeColor={colors.neutral700}
                        value={transaction.walletId}
                        onChange={(item) => {
                            setTransaction({...transaction, walletId: item.value || ""})
                        }}
                        />
                </View>


                <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200}>Wallet Icon</Typo>
                    {/* image input */}
                    <ImageUpload
                        file={transaction.image}
                        placeholder="Upload Image" 
                        onSelect={(file) => setTransaction({...transaction, image: file})}
                        onClear={() => setTransaction({...transaction, image: null})}/>
                </View>
            </ScrollView>
        </View>

        <View style={styles.footer}>
            {oldTransaction?.id && !loading &&( 
              <Button onPress={deletWalletAlert} style={styles.deleteIcon}>
                <Icons.Trash color={colors.white} size={verticalScale(24)} weight='bold' />
              </Button>
            )}
            <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
                <Typo color={colors.black} fontWeight={"700"}>{oldTransaction?.id ? "Update" : "New Wallet"}</Typo>
            </Button>
        </View>
    </ModalWrapper>
  )
}

export default TransactionModal;

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 16,
    },
    footer: {
        alignItems: "center",
        flexDirection:"row",
        justifyContent:"center",
        paddingHorizontal: spacingX._20,
        gap: scale(20),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    inputContainer:{
        gap: spacingY._10,
    },
    iosDropDown:{
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        fontSize: verticalScale(14),
        borderColor: colors.neutral300,
        borderWidth: 1,
        color: colors.white,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15
    },
    androidDropDown:{
        // flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        fontSize: verticalScale(14),
        borderColor: colors.neutral300,
        borderWidth: 1,
        color: colors.white,
        borderRadius: radius._17,
        borderCurve: "continuous",
        //paddingHorizontal: spacingX._15
    },
    flexRow: {
        flexDirection: "row",
        alignItems:"center",
        gap: spacingX._5
    },
    dateInput:{
        flexDirection: "row",
        alignItems:"center",
        height: verticalScale(54),
        borderWidth:1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15
    },
    iosDatePicker: {
    },
    datePickerButton: {
        backgroundColor: colors.neutral700,
        alignSelf: "flex-end",
        padding: spacingY._7,
        marginRight: spacingX._7,
        paddingHorizontal: spacingY._15,
        borderRadius: radius._10,
    },
    dropdownContainer: {
        marginTop: 10,
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._15,
        borderCurve: "continuous"
    },
    dropdownItemText: {
        color : colors.white
    },
    dropdownSelectedText: {
        color: colors.white,
        fontSize: verticalScale(14),
    },
    dropdownListContainer: {
        backgroundColor: colors.neutral900,
        borderRadius: radius._15,
        borderCurve: "continuous",
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,
    },
    dropdownPlaceholder: {
        color: colors.white,
    },
    dropdownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7,
    },
    dropdownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral300,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500
    },
    editIcon:{
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.25,
        textShadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    deleteIcon: {
        backgroundColor: colors.redClose,
        paddingHorizontal: spacingX._15
    }
})