// Telefonda gerçek harita (iOS: Apple Haritalar, Android: Google Haritalar).
// Web sürümü SatelliteMap.web.tsx dosyasındadır; react-native-maps web'de çalışmaz.
import { StyleSheet } from 'react-native';
import MapView, { Marker, type MapType } from 'react-native-maps';

export type MapKind = Extract<MapType, 'satellite' | 'hybrid' | 'standard'>;

export function SatelliteMap({ lat, lon, kind }: { lat: number; lon: number; kind: MapKind }) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      mapType={kind}
      region={{ latitude: lat, longitude: lon, latitudeDelta: 0.004, longitudeDelta: 0.004 }}
      showsUserLocation
      showsCompass
      showsScale
    >
      <Marker coordinate={{ latitude: lat, longitude: lon }} title="Konumun" />
    </MapView>
  );
}
