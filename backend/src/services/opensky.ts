import axios from 'axios';
import redis from '../config/redis';
import type { OpenSkyToken, Flight, OpenSkyResponse } from '../types';
import { stateToFlight } from '../utils/stateToFlight';

async function getToken(): Promise<string> {
  const cacheKey = 'opensky:token';

  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const res = await axios.post<OpenSkyToken>(
    'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.OPENSKY_CLIENT_ID!,
      client_secret: process.env.OPENSKY_CLIENT_SECRET!,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const { access_token, expires_in } = res.data;

  await redis.setex(cacheKey, expires_in - 30, access_token);

  return access_token;
}

export const fetchFlights = async (
  params: {
    minLat?: number;
    maxLat?: number;
    minLon?: number;
    maxLon?: number;
  } = {},
): Promise<Flight[]> => {
  try {
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

    console.log('🌐 Fetching OpenSky:');

    const token = await getToken();

    const { data } = await axios.get<OpenSkyResponse>(
      `https://opensky-network.org/api/states/all?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const flights = (data.states ?? [])
      .map(stateToFlight)
      .filter((f): f is Flight => f !== null);

    await redis.setex(cacheKey, 10, JSON.stringify(flights));

    return flights;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('❌ OpenSky status:', err.response?.status);
      console.error('❌ OpenSky data:', err.response?.data);
    } else {
      console.error('❌ Unknown error:', err);
    }
    return [];
  }
};
