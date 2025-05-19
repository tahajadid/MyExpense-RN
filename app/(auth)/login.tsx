import BackButton from '@/components/BackButton';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const login = () => {
  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <BackButton/>

            {/** Top label */}
            <View style={{gap:5, marginTop: spacingY._20}}>
                <Typo size={30} fontWeight={"800"}>
                    Hey,
                </Typo>
                <Typo size={30} fontWeight={"800"}>
                    Welcome Back
                </Typo>
            </View>

            {/** input layout */}

            <View style={styles.form}>
                <Typo>
                    Login now to track every expenses
                </Typo>

                {/** email adress Input */}
                <Input
                    placeholder='Enter your email..' 
                    icon={
                        <Icons.At
                            size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill'
                        />
                    }
                    />

                {/** password Input */}
                <Input
                    placeholder='****' 
                    icon={
                        <Icons.Eye
                            size={verticalScale(26)}
                            color={colors.neutral300}
                            weight='fill'
                        />
                    }
                    />
            
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default login;

const styles = StyleSheet.create({ 
    container: { 
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingY._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    footer: { 
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        alignItems: "center",
    },
    footerText: {
        textAlign:"center",
        color: colors.text,
        fontSize: verticalScale(10)
    }
});