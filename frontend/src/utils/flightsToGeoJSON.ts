import { Flight } from '@backend/types';
import type { FeatureCollection, Point } from 'geojson';

export function flightsToGeoJSON(flights: Flight[]): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: flights.map((flight) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [flight.longitude, flight.latitude],
      },
      properties: {
        icao24: flight.icao24,
        callsign: flight.callsign,
        country: flight.country,
        altitude: flight.altitude,
        velocity: flight.velocity,
        heading: flight.heading ?? 0,
        onGround: flight.onGround,
      },
    })),
  };
}
