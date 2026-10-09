import Constants from 'expo-constants';
import { Text } from 'react-native';

import { RankPicker } from '../../components/RankPicker';
import { Button, Card, Screen, SectionTitle, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';

export default function Profil() {
  const { rank, setRank } = useProfile();

  return (
    <Screen>
      <Card>
        <Text style={text.muted}>Seçili rütbe</Text>
        <Text style={text.title}>{rank?.name ?? 'Seçilmedi'}</Text>
        {rank && <Button title="Rütbe seçimini temizle" variant="outline" onPress={() => setRank(null)} />}
      </Card>

      <SectionTitle>Rütbe değiştir</SectionTitle>
      <RankPicker />

      <Text style={[text.muted, { textAlign: 'center' }]}>Sürüm {Constants.expoConfig?.version}</Text>
    </Screen>
  );
}
