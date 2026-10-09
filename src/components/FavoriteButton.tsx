import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { useProgress, type FavoriteKey } from '../context/ProgressContext';

/** Başlık çubuğunda kullanılan "kaydet" yıldızı. */
export function FavoriteButton({ favKey }: { favKey: FavoriteKey }) {
  const { isFavorite, toggleFavorite } = useProgress();
  const active = isFavorite(favKey);
  return (
    <Pressable
      onPress={() => toggleFavorite(favKey)}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
    >
      <Ionicons name={active ? 'star' : 'star-outline'} size={22} color="#fff" />
    </Pressable>
  );
}
