import { trpc } from '../api/trpc';

export const useFlights = (filters = {}) =>
  trpc.flights.getAll.useQuery(filters, { refetchInterval: 10_000 });
