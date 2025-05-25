import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { colors } from '@/constants/theme';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const Home = () => {
    const handleLogout = async () => {
        await signOut(auth);
    };
    
  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button onPress={handleLogout}>
        <Typo color={colors.black}>Logout</Typo>
      </Button>
    </ScreenWrapper>
  )
}

export default Home;

const styles = StyleSheet.create({})