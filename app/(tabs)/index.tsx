import Button from '@/components/Button';
import HomeCard from '@/components/HomeCard';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const Home = () => {

  const {user} = useAuth();
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
          {/** Header */}
          <View style={styles.header}>
            <View style={{ gap: 4}}>
              <Typo size={16} color={colors.neutral400}>
                Hello,
              </Typo>
              <Typo size={20} fontWeight={"500"}>{user?.name}</Typo>
            </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass 
              size={verticalScale(22)}
              color={colors.neutral200}
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

          <TransactionList 
            data={[1, 2, 3]}
            loading={false}
            emptyListMessage="No transactions added yet"
            title="Recent transactions"/>
        </ScrollView>
        <Button 
        style={styles.floatingButton}
        onPress={()=> router.push('/(modals)/profileModal')}
        >
          <Icons.Plus 
          size={verticalScale(24)}
          color={colors.black}
          weight="bold" />
        </Button>
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
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30)
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25
  }
})