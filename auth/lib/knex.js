const conf = require('../knexfile.js');

const env = process.env.NODE_ENV || 'development';
const knex = require('knex')(conf[env]);

module.exports = knex;
