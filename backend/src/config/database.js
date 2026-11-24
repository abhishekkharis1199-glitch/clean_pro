import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg
const schema = process.env.DB_SCHEMA || 'cleanpro'

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'cleanpro',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  options: `-c search_path=${schema},public`,
  max: 10,
  idleTimeoutMillis: 30_000,
})

pool.on('connect', (client) => {
  client.query(`SET search_path TO "${schema.replaceAll('"', '""')}", public`)
})

export async function checkDatabase() {
  await pool.query(`SET search_path TO "${schema.replaceAll('"', '""')}", public`)
  const result = await pool.query('SELECT 1 AS ok')
  return result.rows[0].ok === 1
}

export async function withSchema(query, params) {
  return pool.query(query.replaceAll('"{SCHEMA}"', `"${schema.replaceAll('"', '""')}"`), params)
}
