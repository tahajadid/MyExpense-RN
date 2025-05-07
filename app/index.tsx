import { colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const index = () => {
  return (
    <View style={styles.conatinaer}>
      <Text>index</Text>
    </View>
  )
}

export default index;

const styles = StyleSheet.create({  
    conatinaer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.neutral900,
    },
})