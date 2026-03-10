import FilterPanel from './components/FilterPanel';
import MapView from './components/MapView';
import { useFilters } from './hooks/useFilters';

export default function App() {
  const { filters, update, reset } = useFilters();

  return (
    <div className="w-screen h-screen bg-black">
      <MapView filters={filters} />
      <FilterPanel filters={filters} onChange={update} onReset={reset} />
    </div>
  );
}
