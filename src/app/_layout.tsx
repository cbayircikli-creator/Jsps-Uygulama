import { BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed/600SemiBold';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed/700Bold';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { Manrope_800ExtraBold } from '@expo-google-fonts/manrope/800ExtraBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { HeaderBackground } from '../components/ui';
import { ProfileProvider } from '../context/ProfileContext';
import { ProgressProvider } from '../context/ProgressContext';
import { colors, fonts } from '../theme';

// Yazı tipleri yüklenene kadar açılış ekranı açık kalır.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const fontsReady = fontsLoaded || !!fontError;
  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => {});
  }, [fontsReady]);
  // Yazı tipi yüklenemezse sistem yazı tipiyle devam edilir.
  if (!fontsReady) return null;

  return (
    <ProfileProvider>
      <ProgressProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerBackground: () => <HeaderBackground />,
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: fonts.display, fontSize: 22 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="karsilama" options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />
          <Stack.Screen name="mevzuat/[id]" options={{ title: 'Mevzuat' }} />
          <Stack.Screen name="kararlar/index" options={{ title: 'Emsal Kararlar' }} />
          <Stack.Screen name="kararlar/[id]" options={{ title: 'Karar' }} />
          <Stack.Screen name="duyurular/index" options={{ title: 'Duyurular' }} />
          <Stack.Screen name="duyurular/[id]" options={{ title: 'Duyuru' }} />
          <Stack.Screen name="deneme/[id]" options={{ title: 'Deneme' }} />
          <Stack.Screen name="kartlar/[id]" options={{ title: 'Bilgi Kartları' }} />
          <Stack.Screen name="konu/[ders]" options={{ title: 'Konu Testleri' }} />
          <Stack.Screen name="istatistik" options={{ title: 'İstatistikler' }} />
          <Stack.Screen name="ozetler/index" options={{ title: 'Konu Özetleri' }} />
          <Stack.Screen name="ozetler/[id]" options={{ title: 'Özet' }} />
          <Stack.Screen name="ara" options={{ title: 'Soru Ara' }} />
        </Stack>
      </ProgressProvider>
    </ProfileProvider>
  );
}
