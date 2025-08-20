import AddButton from '@/components/AddButton';
import HomeCard from '@/components/HomeCard';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import useThemeColors from '@/hooks/useThemeColors';
import "@/i18n";
import { TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { limit, orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useRef } from 'react';
import { useTranslation } from "react-i18next";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';


const Home = () => {
  const colors = useThemeColors();
  const { user } = useAuth();
  const router = useRouter();
  
  const { t, i18n } = useTranslation();
  console.log("useTranslation language:", i18n.language);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  const TransactionsConstrainnts = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30)
  ];

  const {
    data: recentTransactions,
    loading: transactionsLoading
  } = useFetchData<TransactionType>("transactions", TransactionsConstrainnts);

  // Interpolate opacity based on scroll direction
  const textOpacity = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });


  const buttonWidth = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [120, 48], // Full width to icon-only
    extrapolate: 'clamp',
  });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.descriptionText}>
              {t("welcome_001")}
            </Typo>
            <Typo size={20} fontWeight={"500"} color={colors.text}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity
            style={[styles.searchIcon, { backgroundColor: colors.searchIconBackground }]}
          >
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.searchIcon}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        {/* ScrollView with Animated */}
        <Animated.ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false } // Important!
          )}
          scrollEventThrottle={16}
        >
          <HomeCard />
          <TransactionList
            data={recentTransactions}
            loading={transactionsLoading}
            emptyListMessage="No transactions added yet"
            title="Recent transactions"
          />
        </Animated.ScrollView>

        {/* Floating Button with animated text */}
        <AddButton
          style={styles.floatingButton}
          onPress={() => router.push("./../ui/transaction/newTransaction")}
          animatedWidth={buttonWidth}
        >
          {/* Icon-only view (visible when scrolled) */}
          <Animated.View style={[
            styles.iconOnlyView,
            {
              opacity: textOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            }
          ]}>
            <Icons.Plus size={verticalScale(16)} color={colors.white} weight="bold" />
          </Animated.View>

          {/* Full view with text (visible when not scrolled) */}
          <Animated.View style={[
            styles.fullView,
            {
              opacity: textOpacity,
            }
          ]}>
            <Icons.Plus size={verticalScale(14)} color={colors.white} weight="bold" />
            <Typo size={14} color={colors.white} style={{ marginLeft: 8 }}>
              Transaction
            </Typo>
          </Animated.View>
        </AddButton>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(44),
    width: verticalScale(120),
    borderRadius: 24,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(20),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
  iconOnlyView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fullView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
