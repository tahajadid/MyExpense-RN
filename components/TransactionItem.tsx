import { TransactionItemProps } from '@/types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const TransactionItem = ({
    item, index, handleClick
}: TransactionItemProps) => {
  return (
    <View>
      <Text>TransactionItem</Text>
    </View>
  )
}

export default TransactionItem

const styles = StyleSheet.create({})