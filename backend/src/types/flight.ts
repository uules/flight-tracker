export interface Flight {
  icao24: string;
  callsign: string | null;
  country: string;
  longitude: number;
  latitude: number;
  altitude: number | null;
  velocity: number | null;
  heading: number | null;
  verticalRate: number | null;
  onGround: boolean;
}
