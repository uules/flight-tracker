/*
    OpenSky REST API
    https://openskynetwork.github.io/opensky-api/rest.html#all-state-vectors
*/

// prettier-ignore
export type RawStateVector = [
  string,                        // 0  icao24
  string | null,                 // 1  callsign
  string,                        // 2  origin_country
  number | null,                 // 3  time_position
  number,                        // 4  last_contact
  number | null,                 // 5  longitude
  number | null,                 // 6  latitude
  number | null,                 // 7  baro_altitude
  boolean,                       // 8  on_ground
  number | null,                 // 9  velocity
  number | null,                 // 10 true_track
  number | null,                 // 11 vertical_rate
  number[] | null,               // 12 sensors
  number | null,                 // 13 geo_altitude
  string | null,                 // 14 squawk
  boolean,                       // 15 spi
  0 | 1 | 2 | 3,                 // 16 position_source
  number | null,                 // 17 category
]

export interface OpenSkyResponse {
  time: number;
  states: RawStateVector[] | null;
}
