import { trpc } from './api/trpc';

export default function App() {
  const query = trpc.flights.getAll.useQuery({
    country: 'Russian Federation',
  });

  if (query.isPending) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-2xl">✈️ Flights: {query.data?.total}</h1>
    </div>
  );
}
