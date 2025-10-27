import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import WalletListItem from '@/components/WalletListItem';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import useThemeColors from '@/hooks/useThemeColors';
import { WalletType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const Wallet = () => {
  // colors hook
  const colors = useThemeColors();
  
  const router = useRouter();
  const {user} = useAuth();

  const { t, i18n } = useTranslation();

  const {data: wallets, error, loading} = useFetchData<WalletType>("wallets",[
      where("uid","==", user?.uid), 
      orderBy("created","desc")
    ]
  );

  const calculateTotalBalance = () => {
    return wallets.reduce((total,item)=>{
      total = total + (item?.amount || 0);
      return total;
    }, 0)
  }

  return (
    <ScreenWrapper style={{backgroundColor: colors.primary}}>
      <View style={styles.container}>
        {/* balance view */}
        <View style={[styles.balanceView, { backgroundColor: colors.primary }]}>
          <View style={{alignItems: "center"}}>
            <Typo size={16} color={colors.screenBackground}>
              {t("wallet_001")}
            </Typo>
            <Typo size={45} fontWeight={"500"} color={colors.screenBackground}>
              ${calculateTotalBalance().toFixed(2)}
            </Typo>
          </View>
        </View>
        {/* wallet view */}
        <View style={[styles.wallets, { backgroundColor: colors.screenBackground }]}>
          {/* header of wallet */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"} color={colors.text}>
            {t("wallet_002")}
            </Typo>
            <View style={[styles.buttonRow, {backgroundColor: colors.gold}]}>
              <TouchableOpacity onPress={()=> router.push("/(modals)/walletModal")}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icons.Plus
                    weight="bold" 
                    color={colors.text}
                    size={verticalScale(14)}
                  />
                <Typo size={15} fontWeight={"300"} color={colors.text}>
                {t("wallet_003")}
                </Typo>
              </TouchableOpacity>
            </View>

          </View>

          {/* wallet list */}

          {loading && <Loading  colorLoader={colors.brightOrange}/>}
          <FlatList
            data={wallets}
            renderItem={ ({ item , index}) => {
              return(
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />

      
        </View>


      </View>
    </ScreenWrapper>
  )
}

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"space-between",
  },
  balanceView: {
    height: verticalScale(160),
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
      marginBottom: spacingY._10,
  },
  buttonRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: verticalScale(16),
    borderCurve: 'continuous',
    height: verticalScale(34),
    paddingHorizontal: verticalScale(12)
},
  wallets: {
    flex: 1,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
      paddingVertical: spacingY._10,
      paddingTop: spacingY._15
  },

});
