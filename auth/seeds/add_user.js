const User = require('../models/user');

user = new User({username: 'demo', password: 'somepassword', password_changed: new Date(), locked: false })

exports.seed = function(knex, Promise) {
  return knex('users').where({username: 'demo'}).del()
    .then(() => user.save())
};
