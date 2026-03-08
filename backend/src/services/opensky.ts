import axios from 'axios';
import redis from '../config/redis';
import type { RawStateVector, Flight, OpenSkyResponse } from '../types/flights';

const OPENSKY_URL = 'https://opensky-network.org/api';
const CACHE_TTL = 10; // secs

interface FetchFlightsParams {
  minLat?: number;
  maxLat?: number;
  minLon?: number;
  maxLon?: number;
}

const mapStateToFlight = (state: RawStateVector): Flight | null => {
  const longitude = state[5] as number | null;
  const latitude = state[6] as number | null;

  if (longitude === null || latitude === null) return null;

  return {
    icao24: state[0] as string,
    callsign: state[1] ? (state[1] as string).trim() : null,
    country: state[2] as string,
    longitude,
    latitude,
    altitude: state[7] as number | null,
    velocity: state[9] as number | null,
    heading: state[10] as number | null,
    verticalRate: state[11] as number | null,
    onGround: state[8] as boolean,
  };
};

export const fetchFlights = async (
  params: FetchFlightsParams = {},
): Promise<Flight[]> => {
  const cacheKey = `flights:${JSON.stringify(params)}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('📦 Cache hit:', cacheKey);
    return JSON.parse(cached);
  }

  const { minLat, maxLat, minLon, maxLon } = params;
  const queryParams = new URLSearchParams();

  if (minLat !== undefined) queryParams.set('lamin', String(minLat));
  if (maxLat !== undefined) queryParams.set('lamax', String(maxLat));
  if (minLon !== undefined) queryParams.set('lomin', String(minLon));
  if (maxLon !== undefined) queryParams.set('lomax', String(maxLon));

  const url = `${OPENSKY_URL}/states/all?${queryParams.toString()}`;
  console.log('🌐 Fetching OpenSky:', url);

  const { data } = await axios.get<OpenSkyResponse>(url);

  const flights = (data.states ?? [])
    .map(mapStateToFlight)
    .filter((f): f is Flight => f !== null);

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(flights));

  return flights;
};
