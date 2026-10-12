import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderBackground, type IconName } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { colors, fonts } from '../../theme';

const tabs: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index', title: 'Ana Sayfa', icon: 'home-outline', iconActive: 'home' },
  { name: 'mevzuat', title: 'Mevzuat', icon: 'book-outline', iconActive: 'book' },
  { name: 'calis', title: 'Çalış', icon: 'school-outline', iconActive: 'school' },
  { name: 'araclar', title: 'Araçlar', icon: 'briefcase-outline', iconActive: 'briefcase' },
  { name: 'profil', title: 'Profil', icon: 'person-outline', iconActive: 'person' },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { ready, onboarded } = useProfile();
  // İlk açılışta önce karşılama ekranları gösterilir.
  if (!ready) return null;
  if (!onboarded) return <Redirect href="/karsilama" />;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerBackground: () => <HeaderBackground />,
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 0.3 },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 15 },
        // Varsayılan 49 px, Manrope'un Türkçe harf kuyruklarına (Ç, ş) dar geliyor.
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 58 + insets.bottom },
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.name === 'index' ? 'Uzman Kolluk' : t.title,
            tabBarLabel: t.title,
            // Ana sayfa kendi başlığını çizer.
            headerShown: t.name !== 'index',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
