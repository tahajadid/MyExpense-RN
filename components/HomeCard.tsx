import { useTheme } from '@/constants/ThemeContext'
import { spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import useThemeColors from '@/hooks/useThemeColors'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { ImageBackground } from 'expo-image'
import { orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Loading from './Loading'
import Typo from './Typo'

const HomeCard = () => {
    // colors hook
    const colors = useThemeColors();

    const {user} = useAuth();
    const { theme, mode } = useTheme();
    const cardImage = theme === 'dark'
        ? require('../assets/images/main_card_dark.png')
        : require('../assets/images/main_card_light.png');

    const {
        data: wallets,
        error,
        loading: walletLoading
    } = useFetchData<WalletType>(
        "wallets",[
            where("uid","==",user?.uid),
            orderBy("created","desc")
        ]
    )

    const getTotals = () => {
        return wallets.reduce((totals: any, item: WalletType) => {
            totals.balance = totals.balance + Number(item.amount);
            totals.income = totals.balance + Number(item.totalIncome);
            totals.expenses = totals.balance + Number(item.totalExpense);
            return totals;
        }, {balance: 0, income: 0, expenses: 0} );
    };

    return (
    <ImageBackground 
        source={cardImage}
        contentFit='fill'
        style={styles.bgImage}>
        <View style={styles.container}>
            <View>
                {/** balance view */}
                <View style={styles.totalBalanceRow}>
                    <Typo color={colors.black}
                        size={17} fontWeight={"500"}>
                            Total Balance
                    </Typo>
                    <Icons.DotsThreeOutline
                    size={verticalScale(23)}
                    color={colors.black}
                    weight='fill' />
                </View>

                {walletLoading && (
                    <View style={{alignItems:"flex-start", marginTop: spacingY._20, marginStart: spacingY._35}}>
                        <Loading colorLoader={colors.primary} sizeLoading='small'/>
                    </View>
                    )
                }
                <Typo 
                    color={"#000"}
                    size={30} fontWeight={"bold"}>
                    {walletLoading ? "" : "$"+getTotals()?.balance?.toFixed(2)}
                </Typo>
            </View>

            {/** total expenses and incomes */}
            <View style={styles.stats}>
                {/** income */}
                <View style={{ gap: verticalScale(5)}}>
                    <View style={styles.incomeExpense}>
                        <View style={[styles.statsIcon, {backgroundColor: colors.incomeIconColor}]}>
                            <Icons.ArrowDown 
                                size={verticalScale(15)}
                                color={colors.black}
                                weight='bold'
                            />
                        </View>
                        <Typo size={16} color={colors.incomeLabelColor} fontWeight={"500"}>
                            Income
                        </Typo>
                    </View>
                    <View style={{alignSelf: "center"}}>
                        <Typo size={17} color={colors.green} fontWeight={"600"}>
                            {walletLoading ? "" : "$"+getTotals()?.income?.toFixed(2)}
                        </Typo>
                    </View>
                </View>

                {/** expense */}
                <View style={{ gap: verticalScale(5)}}>
                    <View style={styles.incomeExpense}>
                        <View style={[styles.statsIcon, {backgroundColor: colors.incomeIconColor}]}>
                        <Icons.ArrowUp 
                                size={verticalScale(15)}
                                color={colors.black}
                                weight='bold'
                            />
                        </View>
                        <Typo size={16} color={colors.incomeLabelColor} fontWeight={"500"}>
                            Expense
                        </Typo>
                    </View>
                    <View style={{alignSelf: "center"}}>
                        <Typo size={17} color={colors.rose} fontWeight={"600"}>
                            {walletLoading ? "" : "$"+getTotals()?.expenses?.toFixed(2)}
                        </Typo>
                    </View>
                </View>


            </View>
        </View>
    </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({
    bgImage: {
        height: scale(200),
        width: "100%"
    },
    container: {
        padding: spacingX._20,
        paddingHorizontal: scale(23),
        height: "87%",
        width: "100%",
        justifyContent: "space-between",
    },
    totalBalanceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY._5
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    statsIcon: {
        padding: spacingY._5,
        borderRadius: 50
    },
    incomeExpense: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingY._7
    }
})