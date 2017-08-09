module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'services_postgres_1',
      user: 'postgres',
      database: 'auth_prod',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: 'services_postgres_1',
      user: 'postgres',
      database: 'auth_prod',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
