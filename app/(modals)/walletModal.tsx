import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useThemeColors from '@/hooks/useThemeColors';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const walletModal = () => {

    const {user, updateUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null
    });
    
    // colors hook
    const colors = useThemeColors();

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Header title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
                leftIcon={<BackButton/>}
                style={{ marginBottom: spacingY._10 }}/>

                {/** Form */}
                <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Name</Typo>
                        <Input
                            placeholder="Name.."
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
        </TouchableWithoutFeedback>

        <View style={[styles.footer, { borderTopColor: colors.neutral700}]}>
            {oldWallet?.id && !loading &&( 
              <Button onPress={deletWalletAlert} style={{paddingHorizontal: spacingX._15 ,backgroundColor: colors.redClose}}>
                <Icons.Trash color={colors.white} size={verticalScale(24)} weight='bold' />
              </Button>
            )}
            <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
                <Typo color={colors.neutral900} fontWeight={"700"}>{oldWallet?.id ? "Update" : "New Wallet"}</Typo>
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
        marginBottom: spacingY._15,
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
    inputContainer: {
        gap: spacingY._10
    },
    deleteIcon: {
        paddingHorizontal: spacingX._15
    }
})