import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import DeleteButton from '@/components/DeleteButton';
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
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const walletModal = () => {

    const {user, updateUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    
    const { t, i18n } = useTranslation();

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
            Alert.alert(t("wallet_016"),t("wallet_017"))
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
            Alert.alert(t("wallet_016"),t("wallet_018"));
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
        Alert.alert(t("wallet_012"),t("wallet_013"),
        [
            {
                text: t("wallet_014"),
                onPress: ()=> console.log("camcel action"),
                style: 'cancel'
            },
            {
                text: t("wallet_015"),
                onPress: ()=> onWalletDelete(),
                style: 'destructive'
            }
        ]);
    }
    
  return (
    <ModalWrapper>
      <SafeAreaView
      style={{ flex: 1 }}
      edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.form} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              scrollEnabled={true}
              bounces={true}
              alwaysBounceVertical={false}
              onScrollBeginDrag={Keyboard.dismiss}
              scrollEventThrottle={16}>
                <Header 
                  title={oldWallet?.id ? t("wallet_005") : t("wallet_004")}
                  leftIcon={<BackButton/>}
                  style={{ marginBottom: spacingY._10 }}/>

                {/** Form */}
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200}>{t("wallet_006")}</Typo>
                  <Input
                    placeholder={t("wallet_007")}
                    value={wallet.name}
                    onChangeText={(value) => {
                      setWallet({...wallet, name: value})
                    }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200}>{t("wallet_008")}</Typo>
                  {/* image input */}
                  <ImageUpload
                    file={wallet.image}
                    placeholder={t("wallet_009")}
                    onSelect={(file) => setWallet({...wallet, image: file})}
                    onClear={() => setWallet({...wallet, image: null})}/>
                </View>
              </ScrollView>

            {/**
             * 
             

            
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
              
                */}

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.neutral500}]}>
                {oldWallet?.id && !loading && (
                  <DeleteButton onPress={deletWalletAlert} style={{ paddingHorizontal: spacingX._15 }}>
                    <Icons.Trash color={colors.screenBackground} size={verticalScale(24)} weight='bold' />
                  </DeleteButton>
                )}
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                  <Typo  color={colors.neutral900} fontWeight={"700"}>
                    {oldWallet?.id ? t("wallet_010") : t("wallet_011")}
                  </Typo>
                </Button>
              </View>

            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ModalWrapper>
  )
}

export default walletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
      },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 16,
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(20),
        paddingTop: spacingY._15,
        marginBottom: Platform.OS === 'ios' ? spacingY._15 : 0,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._10,
        marginTop: spacingY._15,
        paddingHorizontal: spacingX._20,
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    inputContainer: {
        gap: spacingY._10,
        marginTop: spacingY._10
    },
    deleteIcon: {
        paddingHorizontal: spacingX._15
    }
})