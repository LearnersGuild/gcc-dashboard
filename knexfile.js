require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    ssl: true
  },
  pool: {
    min: 1,
    max: 2
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'src/db/migrations'
  },
  // Use this option to log raw queries to terminal
  // debug: true
}
