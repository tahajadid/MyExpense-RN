import { AuthProvider } from '@/contexts/authContext';
import { Stack } from 'expo-router';
import React from 'react';

// This is the root layout file
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}