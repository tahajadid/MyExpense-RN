import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

const barData = [
  {
    value: 40,
    label: "Mon",
    spacing: scale(4),
    frontColor: colors.primary
  },
  {
    value: 40,
    frontColor: colors.rose
  },
  {
    value: 50,
    label: "Tue",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary
  },
  {
    value: 75,
    label: "Wed",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary
  },
  {
    value: 25,
    frontColor: colors.rose
  },
  {
    value: 38,
    label: "Thu",
    spacing: scale(4),
    frontColor: colors.primary
  },
  {
    value: 38,
    label: "Fri",
    spacing: scale(4),
    frontColor: colors.primary
  },
  {
    value: 15,
    label: "Sat",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary
  },
  {
    value: 66,
    label: "Sun",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary
  },
]

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const [chartData, setChartData] = useState(barData);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <Header title='Statistics'/>
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
            values={["Weekly","Monthly","Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance='dark'
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{...styles.segmentFontStyle, color: colors.white}}

          />

          <View style={styles.chartContainer}>
            {
              chartData.length>0 ? (
                <BarChart data={chartData}/>
              ) : (
                <View style={styles.noChart}/>
              )
            }
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
    backgroundColor: colors.black
  },
  header: {

  },
  noChart: {
    backgroundColor: colors.black,
    height: verticalScale(20)
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale (35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale (13),
    fontWeight: "bold",
    color: colors.black,
  },

  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  }
})