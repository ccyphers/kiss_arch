const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const _ = {};
_.get = require('lodash/get');
const User = require('./models/user');

const kong = require('tokyo_ape')('http://services_kong_1:8001');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', (req, res) => {
  const username = _.get(req, 'body.username', false);
  const password = _.get(req, 'body.password', false);
  User.signIn(username, password)
    .then(() => {
      kong.token.jwt(username)
        .then((token) => {
          res.send(token);
        })
        .catch((e) => {
          console.log(e);
          res.status(401).send('');
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).send('');
    });
});


app.listen(9000);
