import type { FlightFilters } from '../types/filters';
import { COUNTRIES } from '../utils/countries';

interface Props {
  filters: FlightFilters;
  onChange: (patch: Partial<FlightFilters>) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  return (
    <div className="absolute top-4 left-4 z-1 bg-black text-white rounded-xl p-4 flex flex-col gap-3 w-60">
      <h2 className="text-sm font-semibold uppercase tracking-wider">
        Filters
      </h2>

      <label className="flex flex-col gap-1 text-xs">
        Country
        <select
          className="bg-neutral-800 rounded px-2 py-1 outline-none"
          value={filters.country ?? ''}
          onChange={(e) => onChange({ country: e.target.value || undefined })}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs">
        Min. height
        <input
          type="number"
          className="bg-neutral-800 rounded px-2 py-1 outline-none"
          value={filters.minAltitude ?? ''}
          onChange={(e) =>
            onChange({
              minAltitude: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </label>

      <label className="flex flex-col gap-1 text-xs">
        Max. height
        <input
          type="number"
          className="bg-neutral-800 rounded px-2 py-1 outline-none"
          value={filters.maxAltitude ?? ''}
          onChange={(e) =>
            onChange({
              maxAltitude: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </label>

      <label className="flex items-center gap-2 text-xs cursor-pointer">
        <input
          type="checkbox"
          checked={filters.onGround ?? false}
          onChange={(e) =>
            onChange({ onGround: e.target.checked || undefined })
          }
        />
        On ground
      </label>

      <button
        onClick={onReset}
        className="text-xs text-neutral-500 hover:text-white transition-colors text-left"
      >
        Reset filters
      </button>
    </div>
  );
}
