import AddButton from '@/components/AddButton';
import HomeCard from '@/components/HomeCard';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import useThemeColors from '@/hooks/useThemeColors';
import { TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { limit, orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const Home = () => {
  // colors hook
  const colors = useThemeColors();

  const {user} = useAuth();
  const router = useRouter();

  const TransactionsConstrainnts = [
    where("uid","==",user?.uid),
    orderBy("date","desc"),
    limit(30)
  ];

  const {
      data: recentTransactions,
      error,
      loading: transactionsLoading
  } = useFetchData<TransactionType>(
      "transactions",TransactionsConstrainnts
  )

  return (
    <ScreenWrapper>
      <View style={styles.container}>
          {/** Header */}
          <View style={styles.header}>
            <View style={{ gap: 4}}>
              <Typo size={16} color={colors.descriptionText}>
                Hello,
              </Typo>
              <Typo size={20} fontWeight={"500"} color={colors.text}>{user?.name}</Typo>
            </View>
          <TouchableOpacity style={[styles.searchIcon,{backgroundColor: colors.searchIconBackground} ]}>
            <Icons.MagnifyingGlass 
              size={verticalScale(22)}
              color={colors.searchIcon}
              weight='bold'
            />
          </TouchableOpacity>
        </View>

        {/** Scroll view */}
        <ScrollView 
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/** Cards */}
          <View>
              <HomeCard />
          </View>

          {/** Transaction List */}
          <TransactionList 
            data={recentTransactions}
            loading={transactionsLoading}
            emptyListMessage="No transactions added yet"
            title="Recent transactions"/>
        </ScrollView>
        
        <AddButton 
          style={styles.floatingButton}
          onPress={()=> router.push("./../ui/transaction/newTransaction")}>
            <View style={styles.addRow}>
              <Icons.Plus 
              size={verticalScale(14)}
              color={colors.white}
              weight="bold" />
              <Typo size={14} color={colors.white}>
                Transaction
              </Typo>
            </View>
        </AddButton>
      </View>
    </ScreenWrapper>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8)
  },
  header :{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10
  },
  searchIcon: {
    padding: spacingX._10,
    borderRadius: 50
  },
  floatingButton: {
    height: verticalScale(40),
    width: verticalScale(120),
    borderRadius: 20,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(20)
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25
  },
  addRow:{
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7
  }
})