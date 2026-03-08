import Map from 'react-map-gl/maplibre';

const MAP_STYLE_URL = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;

export default function MapView() {
  return (
    <Map
      mapStyle={MAP_STYLE_URL}
      projection={{ type: 'globe' }}
      minZoom={3}
      maxZoom={7}
      initialViewState={{
        longitude: 60,
        latitude: 40,
      }}
    />
  );
}
