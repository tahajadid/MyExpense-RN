import { incomeCategory } from '@/constants/mockData'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { TransactionItemProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Typo from './Typo'

const TransactionItem = ({
    item, index, handleClick
}: TransactionItemProps) => {

    let category = incomeCategory
    const ComponentIcon = category.icon;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(14)}>
        <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
            <View style={[styles.icon, {backgroundColor: category.bgColor}]}>
                { ComponentIcon && (
                    <ComponentIcon
                    size = {verticalScale(25)}
                    weight="fill"
                    color={colors.white}
                    />
                )
                }
            </View>

            <View style={styles.categoryDes}>
                <Typo size={17}>{category.label}</Typo>
                <Typo size={12} color={colors.neutral400} textProps={{numberOfLines: 1}}>wifi bill</Typo>
            </View>

            <View style={styles.amountDate}>
                <Typo fontWeight={"500"} color={colors.primary}>$23</Typo>
                <Typo size={13} color={colors.neutral400}>10 jn</Typo>
            </View>
        </TouchableOpacity>
    </Animated.View>
  )
}

export default TransactionItem

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._12,
        backgroundColor: colors.neutral800,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._17
    },
    icon:{
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: radius._12,
        borderCurve: "continuous"
    },
    categoryDes:{
        flex:1,
        gap: 2.5
    },
    amountDate:{
        alignItems:"flex-end",
        gap:3
    }
})