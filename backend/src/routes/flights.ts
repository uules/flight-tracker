import { z } from 'zod'
import { router, publicProcedure } from '../config/trpc'
import { fetchFlights } from '../services/opensky'

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
      const { country, ...bboxParams } = input

      let flights = await fetchFlights(bboxParams)

      if (country) {
        flights = flights.filter(f =>
          f.country.toLowerCase() === country.toLowerCase()
        )
      }

      return {
        flights,
        total: flights.length,
        updatedAt: new Date().toISOString(),
      }
    }),
})

export type FlightsRouter = typeof flightsRouter