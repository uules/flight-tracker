import { flightsToGeoJSON } from '../utils/flightsToGeoJSON';
import { useFlights } from '../hooks/useFlights';
import { useMap } from 'react-map-gl/maplibre';
import { useEffect, useMemo } from 'react';
import { GeoJSONSource } from 'maplibre-gl';
import airplane from '../assets/airplane.svg';

const EMPTY_GEOJSON = flightsToGeoJSON([]);

const SOURCE_ID = 'flights';
const LAYER_ID = 'flights-layer';
const ICON_ID = 'airplane-icon';

const ICON = new Image(24, 24);
ICON.src = airplane;

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

    function addIcon() {
      if (!map.hasImage(ICON_ID)) map.addImage(ICON_ID, ICON);
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: 'geojson', data: EMPTY_GEOJSON });
        map.addLayer({
          id: LAYER_ID,
          type: 'symbol',
          source: SOURCE_ID,
          layout: {
            'icon-image': ICON_ID,
            'icon-size': 0.8,
            'icon-rotate': ['get', 'heading'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
          },
        });
      }
    }

    function setup() {
      if (ICON.complete) addIcon();
      else ICON.onload = addIcon;
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
