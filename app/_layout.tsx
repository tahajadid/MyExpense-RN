import { ThemeProvider } from "@/constants/ThemeContext";
import { AuthProvider } from '@/contexts/authContext';
import { Stack } from 'expo-router';
import React from 'react';


const StackLayout= () =>{
    return(
      <Stack screenOptions={{ headerShown: false}}>
          <Stack.Screen
            name="(modals)/profileModal"
            options={{
              presentation:"modal"
            }}
          />
          <Stack.Screen
            name="(modals)/walletModal"
            options={{
              presentation:"modal"
            }}
          />
          <Stack.Screen
            name="(modals)/transactionModal"
            options={{
              presentation:"modal"
            }}
          />
      </Stack>
    )
}

// This is the root layout file
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StackLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}