import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderBackground, type IconName } from '../../components/ui';
import { colors, fonts } from '../../theme';

const tabs: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index', title: 'Ana Sayfa', icon: 'home-outline', iconActive: 'home' },
  { name: 'mevzuat', title: 'Mevzuat', icon: 'book-outline', iconActive: 'book' },
  { name: 'calis', title: 'Çalış', icon: 'school-outline', iconActive: 'school' },
  { name: 'asistan', title: 'Asistan', icon: 'sparkles-outline', iconActive: 'sparkles' },
  { name: 'profil', title: 'Profil', icon: 'person-outline', iconActive: 'person' },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
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
            title: t.name === 'index' ? 'JSPS' : t.title,
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
