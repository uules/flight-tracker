import { useState } from 'react';
import { FlightFilters } from '../types/filters';

export function useFilters() {
  const [filters, setFilters] = useState<FlightFilters>({});

  const update = (patch: Partial<FlightFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const reset = () => setFilters({});

  return { filters, update, reset };
}
