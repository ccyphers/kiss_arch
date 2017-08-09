exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.text('password_digest');
      table.dateTime('password_changed').notNullable();
      table.boolean('locked').notNullable();
      table.integer('max_attempts');
      table.integer('failed_logins');
      table.dateTime('frozen_at');
      table.timestamps();
    });
}

exports.down = function(knex, Promise) {

};
