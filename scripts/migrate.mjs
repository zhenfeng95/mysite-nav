/**
 * Apply Postgres migrations against DATABASE_URL / NUXT_DATABASE_URL.
 * Usage: DATABASE_URL=postgres://... npm run db:migrate
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const url = (process.env.DATABASE_URL || process.env.NUXT_DATABASE_URL || '').trim()
if (!url) {
  console.error('Missing DATABASE_URL or NUXT_DATABASE_URL')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(root, 'migrations')
const files = readdirSync(migrationsDir)
  .filter(name => name.endsWith('.sql'))
  .sort()

if (!files.length) {
  console.error('No .sql files in migrations/')
  process.exit(1)
}

const sql = neon(url)

for (const file of files) {
  const full = join(migrationsDir, file)
  const body = readFileSync(full, 'utf8')
  // Strip line comments; run as one multi-statement query via neon's query API.
  const statements = body
    .split(';')
    .map(part => part.replace(/--[^\n]*/g, '').trim())
    .filter(Boolean)

  console.log(`→ ${file} (${statements.length} statements)`)
  for (const statement of statements) {
    await sql.query(statement)
  }
}

console.log('Migrations applied.')
