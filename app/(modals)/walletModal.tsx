import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

const walletModal = () => {

    const {user, updateUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null
    });

    const router = useRouter();
    
    const oldWallet: {name: string, image:string, id:string} = useLocalSearchParams();
    console.log("oldWallet : ", oldWallet)

    useEffect( () => {
        if(oldWallet?.id) {
            setWallet({
                name: oldWallet?.name,
                image: oldWallet?.image
            })
        }
    },[])


    const onSubmit = async () => {
        let {name, image} = wallet;
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
    };

    const onWalletDelete = async () => {
        if(!oldWallet?.id) return;
        setLoading(true);
        const res = await deleteWallet(oldWallet?.id);
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
            <Header title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
            leftIcon={<BackButton/>}
            style={{ marginBottom: spacingY._10 }}/>

            {/** Form */}
            <ScrollView contentContainerStyle={styles.form}>
                <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200}>Wallet Name</Typo>
                    <Input
                        placeholder="Salary"
                        value={wallet.name}
                        onChangeText={(value) => {
                            setWallet({...wallet, name: value})
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200}>Wallet Icon</Typo>
                    {/* image input */}
                    <ImageUpload
                        file={wallet.image}
                        placeholder="Upload Image" 
                        onSelect={(file) => setWallet({...wallet, image: file})}
                        onClear={() => setWallet({...wallet, image: null})}/>
                </View>
            </ScrollView>
        </View>

        <View style={styles.footer}>
            {oldWallet?.id && !loading &&( 
              <Button onPress={deletWalletAlert} style={styles.deleteIcon}>
                <Icons.Trash color={colors.white} size={verticalScale(24)} weight='bold' />
              </Button>
            )}
            <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
                <Typo color={colors.black} fontWeight={"700"}>{oldWallet?.id ? "Update" : "New Wallet"}</Typo>
            </Button>
        </View>
    </ModalWrapper>
  )
}

export default walletModal

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
    inputContainer: {
        gap: spacingY._10
    },
    deleteIcon: {
        backgroundColor: colors.redClose,
        paddingHorizontal: spacingX._15
    }
})