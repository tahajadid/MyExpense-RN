import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { TransactionListType, TransactionType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { FlashList } from "@shopify/flash-list"
import { useRouter } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Loading from './Loading'
import TransactionItem from './TransactionItem'
import Typo from './Typo'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage
}: TransactionListType) => {
    
    const router = useRouter();

    const handleClick = (item: TransactionType) => {
        router.push({
            pathname:"/(modals)/transactionModal",
            params: {
                id: item?.id,
                type: item?.type,
                amount: item?.amount?.toString(),
                category: item?.category,
                date: (item.date as Timestamp)?.toDate().toISOString(),
                description: item?.description,
                image: item?.image,
                uid: item?.uid,
                walletId: item?.walletId
            }
        })
    }

  return (
    <View style={styles.container}>
        {title && (
            <Typo size={20} fontWeight={"500"}>{title}</Typo>
        )}
    
        <View style={styles.list}>
            <FlashList 
                data={data}
                renderItem={({ item, index}) => (
                    <TransactionItem item={item} index={index} handleClick={handleClick}/>
                )}
            />
        </View>
        {
            !loading && data.length == 0 && (
                <Typo
                    size={15} color={colors.neutral400}
                    style={styles.emptyListMessage}
                >{emptyListMessage}
                </Typo>
            )
        }
        {
            loading && (
                <View style={{top : verticalScale(20)}}><Loading/></View>
            )
        }
    </View>
  )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17
    },
    list:{
        minHeight: 3
    },
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
    categoryDes: {
        flex: 1,
        gap: 2.5
    },
    amountDate: {
        alignItems: "flex-end",
        gap: 3
    },
    emptyListMessage: {
        textAlign:"center",
        marginTop: spacingY._15
    }
})