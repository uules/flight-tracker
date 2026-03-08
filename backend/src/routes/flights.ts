import { z } from 'zod'
import { router, publicProcedure } from '../config/trpc'

export const flightsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        country: z.string().optional(),
        minLat: z.number().optional(),
        maxLat: z.number().optional(),
        minLon: z.number().optional(),
        maxLon: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      console.log('getAll called with:', input)

      return {
        flights: [],
        total: 0,
        updatedAt: new Date().toISOString(),
      }
    }),
})

export type FlightsRouter = typeof flightsRouter