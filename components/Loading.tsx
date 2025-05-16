import { colors } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'


const Loading = ({
    sizeLoading = "large",
    color = colors.primary
}) => {
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <ActivityIndicator size="large" color={color} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})