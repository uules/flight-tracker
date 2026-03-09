import { flightsToGeoJSON } from '../utils/flightsToGeoJSON';
import { useFlights } from '../hooks/useFlights';
import { useMap } from 'react-map-gl/maplibre';
import { useEffect, useMemo } from 'react';
import { GeoJSONSource } from 'maplibre-gl';

const EMPTY_GEOJSON = flightsToGeoJSON([]);
const SOURCE_ID = 'flights';
const LAYER_ID = 'flights-layer';

export default function FlightsLayer() {
  const { data } = useFlights();
  const flightsData = useMemo(
    () => (data ? flightsToGeoJSON(data.flights) : EMPTY_GEOJSON),
    [data],
  );

  const { current: mapRef } = useMap();

  useEffect(() => {
    if (!mapRef) return;
    const map = mapRef.getMap();

    let registered = false;

    function setup() {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: EMPTY_GEOJSON,
        });
        map.addLayer({
          id: LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 3,
            'circle-color': '#60a5fa',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        });
      }
    }

    if (map.isStyleLoaded()) {
      setup();
    } else {
      registered = true;
      map.once('load', setup);
    }

    return () => {
      if (registered) map.off('load', setup);
      if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    };
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef) return;
    const map = mapRef.getMap();

    let registered = false;

    function update() {
      const source = map.getSource(SOURCE_ID);
      if (source && source.type === 'geojson') {
        (source as GeoJSONSource).setData(flightsData);
      }
    }

    if (map.isStyleLoaded()) {
      update();
    } else {
      registered = true;
      map.once('load', update);
    }

    return () => {
      if (registered) map.off('load', update);
    };
  }, [mapRef, flightsData]);

  return <></>;
}
