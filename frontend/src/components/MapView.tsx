import Map from 'react-map-gl/maplibre';
import FlightsLayer from './FlightsLayer';
import type { FlightFilters } from '../types/filters';

const MAP_STYLE_URL = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;

interface Props {
  filters: FlightFilters;
}

export default function MapView({ filters }: Props) {
  return (
    <Map
      id="mainMap"
      mapStyle={MAP_STYLE_URL}
      projection={{ type: 'globe' }}
      minZoom={3}
      maxZoom={7}
      initialViewState={{
        longitude: 60,
        latitude: 40,
      }}
    >
      <FlightsLayer filters={filters} />
    </Map>
  );
}
