// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'lezzotask',
      user: 'root',
      password: '123456'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
