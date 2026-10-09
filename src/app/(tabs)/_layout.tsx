import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import type { IconName } from '../../components/ui';
import { colors } from '../../theme';

const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Ana Sayfa', icon: 'home-outline' },
  { name: 'mevzuat', title: 'Mevzuat', icon: 'book-outline' },
  { name: 'calis', title: 'Çalış', icon: 'school-outline' },
  { name: 'asistan', title: 'Asistan', icon: 'sparkles-outline' },
  { name: 'profil', title: 'Profil', icon: 'person-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.name === 'index' ? 'JSPS' : t.title,
            tabBarLabel: t.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={t.icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
