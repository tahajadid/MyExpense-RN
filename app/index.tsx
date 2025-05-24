import { colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, View } from 'react-native';

const index = () => {

    /*
    // navigate to welcome page after 2s
    const router = useRouter();
    useEffect(() =>{
        setTimeout(()=>{
            router.push("/(auth)/welcome");
        },2000)
    },[])
    */

    return (
        <View style={styles.conatinaer}>
        <Image
            source={require('../assets/images/onboardingTwo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
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
    logo: {
        aspectRatio: 1,
        height: "20%",
    }
})