import { Flight, RawStateVector } from "../types";

export const stateToFlight = (state: RawStateVector): Flight | null => {
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