const express = require('express');
const app = express();
const request = require('request');
const google = require('google');


app.get('/api/search', function(req, res){
  results = [];
  req.query = req.query || {};
  req.query.term = req.query.term || 'nodejs';
  google(req.query.term, function (err, googleRes) {
      if(err) {
        res.status(500).json({})
        return;
      }
      res.json(googleRes.links.filter((link) => {
          if (link.title) {
              return {title: link.title, description: link.description}
          }
      }))
  })

});

app.listen(8888);
