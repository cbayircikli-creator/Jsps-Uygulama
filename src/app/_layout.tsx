import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProfileProvider } from '../context/ProfileContext';
import { ProgressProvider } from '../context/ProgressContext';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <ProfileProvider>
      <ProgressProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: colors.background },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="mevzuat/[id]" options={{ title: 'Mevzuat' }} />
          <Stack.Screen name="kararlar/index" options={{ title: 'Emsal Kararlar' }} />
          <Stack.Screen name="kararlar/[id]" options={{ title: 'Karar' }} />
          <Stack.Screen name="duyurular/index" options={{ title: 'Duyurular' }} />
          <Stack.Screen name="duyurular/[id]" options={{ title: 'Duyuru' }} />
          <Stack.Screen name="deneme/[id]" options={{ title: 'Deneme' }} />
          <Stack.Screen name="kartlar/[id]" options={{ title: 'Bilgi Kartları' }} />
        </Stack>
      </ProgressProvider>
    </ProfileProvider>
  );
}
