const express = require("express");
const app = express();
const db = require("../eth_app/src/db");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//const whitelistRouter = require('./routes/whitelist');

db.connect();
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.json());
app.listen(3002, () => console.log("Server running on port 3002"));
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


/*app.post("/api/data", (req, res) => {
    console.log(req.body);
});*/

app.get("/api", (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(data);
        }
    });
});


app.get("/users/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    const query = "SELECT * FROM mint_wallet WHERE user_id = (?)";
    input = [user_id];
    db.query(query, input, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(data);
        }
    });
});

app.use(bodyParser.json());

app.post("/api/data", (req, res) => {
    const sql =
        "INSERT INTO mint_wallet(user_id, mint_wallet, private_key) VALUES (?, ?, ?)";
    const data = [req.body.user_id, req.body.mint_wallet, req.body.private_key];
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows} row(s)`);
    });
});

// Function to fetch data from Etherscan API every second and update database
const fetchDataAndUpdateDB = () => {
  axios
    .get(
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=EY4HQCTINHG9CEVSNDFND3AKXNIU8KBZA4"
    )
    .then((response) => {
      const gasPrice = response.data.result.ProposeGasPrice;

      // Update database with new gas price value
      const sql = "UPDATE Etherscan_requests SET GasPrice = ?"
      const data = [gasPrice];
      db.query(sql, data, (err, results) => {
        if (err) throw err;
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Call the fetchDataAndUpdateDB function every second
setInterval(fetchDataAndUpdateDB, 2000);

app.get("/api/gasprice", (req, res) => {
    const query = "SELECT GasPrice FROM Etherscan_requests";

    db.query(query, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(data);
        }
    });
});