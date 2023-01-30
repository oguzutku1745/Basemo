const express = require('express');
const app = express();
const db = require('../eth_app/src/db');
const passport = require('passport');
const bodyParser = require("body-parser");

//const whitelistRouter = require('./routes/whitelist');

app.use(express.json());
app.use(passport.initialize());
app.listen(3002, () => console.log('Server running on port 3001'));
//app.get('/', whitelistRouter);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/api/data", (req, res) => {
    console.log(req.body);});

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