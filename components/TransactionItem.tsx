import { expenseCategories, incomeCategory } from '@/constants/mockData'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { TransactionItemProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Typo from './Typo'

const TransactionItem = ({
    item, index, handleClick
}: TransactionItemProps) => {

    let category = item?.type == "income" ? incomeCategory : expenseCategories[item.category!]
    const ComponentIcon = category.icon;
    const date = (item?.date as Timestamp)?.toDate()?.toLocaleDateString("en-GB",{
        day: "numeric",
        month: "short",

    })

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
                <Typo size={12} color={colors.neutral400} textProps={{numberOfLines: 1}}>
                    {item?.description}
                </Typo>
            </View>

            <View style={styles.amountDate}>
                <Typo fontWeight={"500"} 
                color={item?.type == "income" ? colors.primary : colors.rose}>
                    {`${item?.type== "income" ? "+ $" : "- $"}${item?.amount}`}
                </Typo>
                <Typo size={13} color={colors.neutral400}>{date}</Typo>
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