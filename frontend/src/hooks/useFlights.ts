import { trpc } from '../api/trpc';
import { FlightFilters } from '../types/filters';

export const useFlights = (filters: FlightFilters = {}) =>
  trpc.flights.getAll.useQuery(filters, { refetchInterval: 10_000 });
