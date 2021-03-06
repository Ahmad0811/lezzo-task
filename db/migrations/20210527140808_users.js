exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id');
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
