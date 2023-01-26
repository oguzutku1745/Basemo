const express = require('express');
const app = express();
const db = require('../eth_app/db');
const passport = require('passport');

//const whitelistRouter = require('./routes/whitelist');

app.use(express.json());
app.use(passport.initialize());
app.listen(3002, () => console.log('Server running on port 3001'));
//app.get('/', whitelistRouter);

app.get('/api', (req, res) => {
  const query = 'SELECT * FROM basemotest';

  db.query(query, (err, data) => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      res.json(data);
    }
  });
});