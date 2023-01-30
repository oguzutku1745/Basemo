const express = require("express");
const app = express();
const db = require("/root/basemov2/Basemo/server/db.js");
const passport = require("passport");
const bodyParser = require("body-parser");

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
