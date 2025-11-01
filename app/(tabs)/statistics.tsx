import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import TabHeader from '@/components/TabHeader';
import TransactionList from '@/components/TransactionList';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useThemeColors from '@/hooks/useThemeColors';
import "@/i18n";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService';
import { scale, verticalScale } from '@/utils/styling';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

const Statistics = () => {
  // colors hook
  const colors = useThemeColors();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const {user} = useAuth();
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([])

  const { t, i18n } = useTranslation();
  
  useEffect(()=> {
    if(activeIndex==0){
      getWeeklyStats();
    }
    if(activeIndex==1){
      getMonthlyStats();
    }
    if(activeIndex==2){
      getYearlyStats();
    }
  },[activeIndex])

  // get days statistics
  const getWeeklyStats = async ()=> {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string)
    setChartLoading(false);
    if(res.success){
      const updatedData = Array.isArray(res?.data?.stats)
      ? res.data.stats.map((item: { frontColor: string; }) => ({
          ...item,
          frontColor:
            item.frontColor === colors.white
              ? colors.green
              : colors.redClose,
        }))
      : [];

      setChartData(updatedData);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error",res.msg)
    }
  }

  // get months statistics
  const getMonthlyStats = async ()=> {
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string)
    setChartLoading(false);
    if(res.success){
      const updatedData = Array.isArray(res?.data?.stats)
      ? res.data.stats.map((item: { frontColor: string; }) => ({
          ...item,
          frontColor:
            item.frontColor === colors.white
              ? colors.green
              : colors.redClose,
        }))
      : [];


      setChartData(updatedData);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error",res.msg)
    }
  }

  // get years statistics
  const getYearlyStats = async ()=> {
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string)
    setChartLoading(false);
    if(res.success){
      
      const updatedData = Array.isArray(res?.data?.stats)
      ? res.data.stats.map((item: { frontColor: string; }) => ({
          ...item,
          frontColor:
            item.frontColor === colors.white
              ? colors.green
              : colors.redClose,
        }))
      : [];

      setChartData(updatedData);
      setTransactions(res?.data?.transactions);
      //setChartData(res?.data?.stats);
    } else {
      Alert.alert("Error",res.msg)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TabHeader title={t("statistics_001")}/>
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100)
          }}

          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl 
            values={[t("statistics_002"),t("statistics_003"), t("statistics_004")]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.primary}
            backgroundColor={colors.neutral600}
            appearance='dark'
            activeFontStyle={{...styles.segmentFontStyle, color: colors.screenBackground}}
            style={styles.segmentStyle}
            fontStyle={{...styles.segmentFontStyle, color: colors.text}}

          />

          <View style={styles.chartContainer}>
            {
              chartData.length>0 ? (
                <BarChart 
                data={chartData}
                barWidth={scale(12)}
                spacing={[1,2].includes(activeIndex) ? scale(25) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix='$'
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={[1,2].includes(activeIndex) ? scale(38) : scale(35)}
                yAxisTextStyle={{ color : colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12)
                }}
                noOfSections={3}
                minHeight={5}
                />
              ) : (
                <View style={[styles.noChart, { backgroundColor: colors.black}]}/>
              )
            }
            { chartLoading && (
              <View style={[styles.chartLoadingContainer, {backgroundColor: colors.neutral600}]}>
                  <Loading colorLoader={colors.primary} />
              </View>
            )}

          </View>

            {/** transaction list */}
            <View>
              <TransactionList 
                title={t("statistics_005")}
                emptyListMessage={t("statistics_006")}
                data={transactions}
              />
            </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
  },
  header: {
  },
  noChart: {
    height: verticalScale(20)
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale (13),
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  }
})