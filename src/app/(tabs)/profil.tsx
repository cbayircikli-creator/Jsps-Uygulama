import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Text } from 'react-native';

import { RankPicker } from '../../components/RankPicker';
import { Button, Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress, type FavoriteKey } from '../../context/ProgressContext';
import { content } from '../../services/content';

function resolveFavorite(key: FavoriteKey) {
  const [type, id] = key.split(':') as ['mevzuat' | 'karar', string];
  if (type === 'mevzuat') {
    const l = content.legislationById(id);
    return l && { label: 'Mevzuat', title: l.title, href: `/mevzuat/${id}` as const };
  }
  const d = content.decisionById(id);
  return d && { label: 'Emsal Karar', title: d.topic, href: `/kararlar/${id}` as const };
}

export default function Profil() {
  const { rank, setRank } = useProfile();
  const { favorites, clearProgress } = useProgress();
  const saved = favorites.map(resolveFavorite).filter((f) => !!f);

  return (
    <Screen>
      <Card>
        <Text style={text.muted}>Seçili rütbe</Text>
        <Text style={text.title}>{rank?.name ?? 'Seçilmedi'}</Text>
        {rank && <Button title="Rütbe seçimini temizle" variant="outline" onPress={() => setRank(null)} />}
      </Card>

      <SectionTitle>Kaydedilenler</SectionTitle>
      {saved.length === 0 && (
        <EmptyState icon="star-outline" text="Mevzuat veya karar sayfasındaki yıldıza dokunarak kaydedin." />
      )}
      {saved.map((f) => (
        <Card key={f.href} onPress={() => router.push(f.href)}>
          <Tag label={f.label} />
          <Text style={text.heading}>{f.title}</Text>
        </Card>
      ))}

      <SectionTitle>Rütbe değiştir</SectionTitle>
      <RankPicker />

      <SectionTitle>Veriler</SectionTitle>
      <Button title="İlerlemeyi sıfırla" variant="outline" onPress={clearProgress} />

      <Text style={[text.muted, { textAlign: 'center' }]}>Sürüm {Constants.expoConfig?.version}</Text>
    </Screen>
  );
}
