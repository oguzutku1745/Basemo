const Web3 = require("web3");
const mysql = require("mysql2");
const db = require("../eth_app/src/db");
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(
        "wss://eth-goerli.g.alchemy.com/v2/Znc3f3QZfwNR4cpKpwfa5JRPoEvEIpHg"
    )
);
const ABI = require("./ABI");

// NFT contract address
const contractAddress = "0xFc3287b7508a0783665fbCA5C8847628475c83e9";

// ABI (Application Binary Interface) of the NFT contract
const contractABI = ABI.contractABI;

const contract = new web3.eth.Contract(contractABI, contractAddress);

const getUserExpirydate = (user_wallet) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT expiry_date FROM users WHERE user_wallet = (?)";
        const input = [user_wallet];
        db.query(query, input, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data.length === 0) {
                    // user not found in database
                    resolve(0);
                } else {
                    resolve(data[0].expiry_date);
                }
            }
        });
    });
};

let whitelistedAddresses = [];
const whitelistAddress = async (address) => {
    var current_expirydate;
    try {
        current_expirydate = await getUserExpirydate(address);
    } catch (err) {
        current_expirydate = 0;
    }
    console.log(current_expirydate);
    const expirationDate = new Date();
    const currentExpiryDateObj = current_expirydate
        ? new Date(Date.parse(current_expirydate))
        : expirationDate;
    console.log(currentExpiryDateObj);

    let laterDate;
    if (currentExpiryDateObj > expirationDate) {
        laterDate = currentExpiryDateObj;
    } else {
        laterDate = expirationDate;
    }
    const laterDateObj = new Date(Date.parse(laterDate));
    laterDateObj.setMonth(laterDateObj.getMonth() + 1);
    whitelistedAddresses.push(address, laterDateObj);
    var sql;
    if (current_expirydate === 0) {
        sql = "INSERT INTO users(user_wallet, expiry_date) VALUES (?, ?)";
    } else {
        sql = `UPDATE users SET expiry_date = ? WHERE user_wallet= ?`;
    }

    const data = current_expirydate
        ? [laterDateObj, address]
        : [address, laterDateObj];
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows} row(s)`);
    });
};

// open connection to database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to database: " + err.stack);
        return;
    }
    console.log("Connected to database");
});

contract.events
    .Transfer((error, event) => {
        if (error) {
            console.log(error);
        }
    })
    .on("data", (event) => {
        const tokenId = event.returnValues.tokenId;
        const userAddress = event.returnValues[1];
        console.log(userAddress);
        whitelistAddress(userAddress);
    });
