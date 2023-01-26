const Web3 = require("web3");
const mysql = require("mysql2");
const db = require("../eth_app/db");
const web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);
const ABI = require("./ABI");

db.connect();

// NFT contract address
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// ABI (Application Binary Interface) of the NFT contract
const contractABI = ABI.contractABI;

const contract = new web3.eth.Contract(contractABI, contractAddress);

let whitelistedAddresses = [];
const whitelistAddress = (address) => {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    whitelistedAddresses.push(address, expirationDate);
    console.log(whitelistedAddresses);
    console.log(address);
    const sql =
        "INSERT INTO basemotest(Wallet_address, expirydate) VALUES (?, ?)";
    const data = [address, expirationDate];
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows} row(s)`);
    });
};

contract.events
    .mintedBSM(
        {
            fromBlock: 0,
        },
        (error, event) => {
            if (error) {
                console.log(error);
            }
        }
    )
    .on("data", (event) => {
        console.log(event.returnValues[1]);
        const tokenId = event.returnValues.tokenId;
        const userAddress = event.returnValues[1];
        console.log(userAddress);
        whitelistAddress(userAddress);
    });
