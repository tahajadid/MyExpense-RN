import { Stack } from 'expo-router';
import React from 'react';

// This layout is specific to the (auth) group
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}