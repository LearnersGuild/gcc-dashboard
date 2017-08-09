require('dotenv').config();
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 1,
    max: 2
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'db/migrations'
  },
  // Use this option to log raw queries to terminal
  // debug: true
};


