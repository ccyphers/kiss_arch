const knex = require('../lib/knex');
const bookshelf = require('bookshelf')(knex);
const securePassword = require('bookshelf-secure-password');

bookshelf.plugin(securePassword);

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasSecurePassword: true,
  hasTimestamps: true,
  knex,
});

User.signIn = (username, password) => User.forge({ username })
  .fetch()
  .then(user => user.authenticate(password));

User.updatePassword = (username, oldPassword, newPassword) => User.signIn(username, oldPassword)
  .then((user) => {
    user.set('password', newPassword);
    return user.save();
  });

User.create = (attrs) => {
  const u = new User(attrs);
  return u.save();
};

module.exports = User;
