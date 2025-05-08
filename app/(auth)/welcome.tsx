import ScreenWrapper from '@/components/ScreenWrapper'
import { colors } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

const welcome = () => {
  return (
    <ScreenWrapper>
      <Text style={{color: colors.white}} >welcome</Text>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({})