import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import type { H3Event } from 'h3'

export type Sql = NeonQueryFunction<false, false>

/** Neon Postgres client via DATABASE_URL / NUXT_DATABASE_URL. */
export function useDb(event?: H3Event): Sql {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const url
    = String(config.databaseUrl || '').trim()
      || String(process.env.DATABASE_URL || '').trim()
      || String(process.env.NUXT_DATABASE_URL || '').trim()

  if (!url) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database unavailable',
      message: 'DATABASE_URL / NUXT_DATABASE_URL is not configured.',
    })
  }

  return neon(url)
}
