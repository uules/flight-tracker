import { router } from '../config/trpc';
import { flightsRouter } from './flights';

export const appRouter = router({
  flights: flightsRouter,
});

export type AppRouter = typeof appRouter;
