const express = require("express");
const app = express();
const db = require("../eth_app/src/db");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");
const { ethers } = require("ethers");
const BlocknativeSdk = require("bnc-sdk");
const WebSocket = require("ws");
const Web3 = require("web3");
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(
        "wss://eth-goerli.g.alchemy.com/v2/Znc3f3QZfwNR4cpKpwfa5JRPoEvEIpHg"
    )
);

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
var gasPriceNetwork;
/////////////////////////////////////////////////
// START OF THE EVENT LISTENERS
// Define an array to hold all the listening requests
let requests = [];
var provider = new ethers.providers.InfuraProvider(
    "goerli",
    "0fe302203e9f42fc9dffae2ccb1494c2"
);

app.post("/api/listen", (req, res) => {
    const {
        contractAddress,
        ABI,
        targetFunction,
        targetValue,
        FunctionToCall,
        FunctionToCallInput,
        SelectedUserGas,
        PrivateKeyTxn,
    } = req.body;
    console.log(req.body);
    var result;
    listenToVariable(
        contractAddress,
        ABI,
        targetFunction,
        targetValue,
        async () => {
            try {
                result = await sendWriteTxnRead(
                    FunctionToCall,
                    FunctionToCallInput,
                    SelectedUserGas,
                    PrivateKeyTxn,
                    ABI,
                    contractAddress
                );
                if (result.error) {
                    res.status(500).json({ error: result.error });
                } else {
                    res.status(200).json({
                        transaction: result.transactions,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    );
});

app.get("/getABI/:contractAddress", async (req, res) => {
    const { contractAddress } = req.params;
    const apiKey = "EY4HQCTINHG9CEVSNDFND3AKXNIU8KBZA4";
    const url = `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data.result;
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});

async function sendWriteTxnRead(
    FunctionToCall,
    FunctionToCallInput,
    SelectedUserGas,
    PrivateKeys,
    ABI,
    contractAddress
) {
    Interface_txn = new ethers.utils.Interface(ABI);
    transactions = [];

    const contract_txn = new ethers.Contract(
        contractAddress,
        Interface_txn,
        provider
    );

    const gasPriceToUse = SelectedUserGas
        ? ethers.utils.parseUnits(SelectedUserGas.toString(), "gwei")
        : ethers.utils.parseUnits(gasPriceNetwork.toString(), "gwei");

    const inputs = Array.isArray(FunctionToCallInput)
        ? FunctionToCallInput
        : FunctionToCallInput
        ? [FunctionToCallInput]
        : [];

    for (const privateKey of PrivateKeys) {
        try {
            const wallet = new ethers.Wallet(privateKey, provider);
            const signer = wallet.connect(provider);

            const transaction = await contract_txn
                .connect(signer)
                [FunctionToCall](...inputs, { gasPrice: gasPriceToUse });

            console.log(transaction);

            transactions.push(transaction); // Return true if the transaction was successful
        } catch (error) {
            console.log(error);
            return { error };
        }
    }
    return { transactions };
}

app.post("/api/listenFunction", async (req, res) => {
    const {
        contractAddress,
        ABI,
        targetFunction,
        targetValue,
        FunctionToCall,
        FunctionToCallInput,
        SelectedUserGas,
        PrivateKeyTxn,
        pendingStatus,
        user_id,
    } = req.body;
    userBlockKey = await getUserBlockNativeKey(user_id);
    const YOUR_API_KEY = userBlockKey
        ? userBlockKey
        : "6b3983a6-2d11-4316-93db-c701bf1d46f9";
    console.log(YOUR_API_KEY);
    const options = {
        dappId: YOUR_API_KEY,
        networkId: 5,
        ws: WebSocket,
        onerror: (error) => {
            console.log(error);
        }, //optional, use to catch errors
    };
    const blocknative = new BlocknativeSdk(options);
    const address = contractAddress;
    const abi = JSON.parse(ABI);
    const { emitter, details } = blocknative.account(address);
    var result;

    const functionObject = abi.find((func) => {
        return func.name === targetFunction;
    });

    const encodedFunctionCall = targetValue
        ? web3.eth.abi.encodeFunctionCall(functionObject, [targetValue])
        : web3.eth.abi.encodeFunctionSignature(functionObject);

    emitter.on("all", async (transaction) => {
        try {
            const input = transaction.input;
            // Check if the encoded function call matches the input data of the transaction
            if (
                transaction.to === contractAddress &&
                input === encodedFunctionCall
            ) {
                console.log(pendingStatus);
                if (pendingStatus) {
                    if (transaction.status === "pending") {
                        console.log("MATCH for pending");
                        emitter.off("all");
                        result = await sendWriteTxnRead(
                            FunctionToCall,
                            FunctionToCallInput,
                            SelectedUserGas,
                            PrivateKeyTxn,
                            ABI,
                            contractAddress
                        );
                        if (result.error) {
                            res.status(500).json({ error: result.error });
                        } else {
                            res.status(200).json({
                                transaction: result.transaction,
                            });
                        }
                    }
                } else {
                    if (transaction.status === "confirmed") {
                        console.log("MATCH for confirmed");
                        emitter.off("all");
                        result = await sendWriteTxnRead(
                            FunctionToCall,
                            FunctionToCallInput,
                            SelectedUserGas,
                            PrivateKeyTxn,
                            ABI,
                            contractAddress
                        );
                        if (result.error) {
                            res.status(500).json({ error: result.error });
                        } else {
                            res.status(200).json({
                                transaction: result.transactions,
                            });
                        }
                    }
                }
            } else {
                console.log("DID NOT MATCH");
            }
        } catch (error) {
            console.log(error);
        }
    });
});

// Function to start listening to a specific contract variable and target value
const listenToVariable = async (
    contractAddress,
    ABI,
    targetFunction,
    targetValue,
    callback
) => {
    const contract = new ethers.Contract(contractAddress, ABI, provider);

    const intervalId = setInterval(async () => {
        const newValue = await contract[targetFunction]();
        console.log(newValue);
        if (newValue.toString() === targetValue.toString()) {
            callback();
            clearInterval(intervalId); // stop listening after callback is called
        }
        currentValue = newValue;
    }, 1000); // poll every 1 second

    // Add the request to the array
    requests.push({
        contractAddress,
        ABI,
        targetFunction,
        targetValue,
        callback,
        intervalId, // store intervalId for later use
    });
    console.log(
        `Started listening for variable ${targetFunction} on contract ${contractAddress}`
    );
};

// Function to stop listening to a specific contract variable and target value
const stopListening = (contractAddress, targetFunction) => {
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Stop the interval by clearing the intervalId
    const request = requests.find(
        (req) =>
            req.contractAddress === contractAddress &&
            req.targetFunction === targetFunction
    );
    if (request) {
        clearInterval(request.intervalId);
        console.log(
            `Stopped listening for variable ${targetFunction} on contract ${contractAddress}`
        );
    } else {
        console.log(
            `No request found for variable ${targetFunction} on contract ${contractAddress}`
        );
    }

    // Remove the request from the array
    requests = requests.filter(
        (req) =>
            req.contractAddress !== contractAddress ||
            req.targetFunction !== targetFunction
    );
};

// Example API endpoint to handle a new listening request from the frontend

// Example API endpoint to handle stopping a listening request from the frontend
app.post("/api/stop", (req, res) => {
    const { contractAddress, targetFunction } = req.body;

    stopListening(contractAddress, targetFunction);

    res.status(200).json({
        message: `Stopped listening for variable ${targetFunction} on contract ${contractAddress}`,
    });
});
/// END OF EVENT LISTENERS
/////////////////////////////////////////////////////////////////////////////////////////

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

app.post("/api/setuserblocknativekey", (req, res) => {
    const sql = "UPDATE users SET blocknative_key = ? WHERE user_id = ?";
    const data = [req.body.userBlocknativeKey, req.body.user_id];
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows} row(s)`);
    });
});

app.get("/api/getuserblocknativekey", (req, res) => {
    const user_id = req.query.user_id; // use req.query instead of req.body
    const query = `SELECT blocknative_key FROM users WHERE user_id = '${user_id}'`;

    db.query(query, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(data);
        }
    });
});

const getUserBlockNativeKey = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT blocknative_key FROM users WHERE user_id = (?)`;
        const input = [user_id];
        db.query(query, input, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data.length === 0) {
                    // user not found in database
                    resolve(0);
                } else {
                    resolve(data[0].blocknative_key);
                }
            }
        });
    });
};

// Function to fetch data from Etherscan API every second and update database
const fetchDataAndUpdateDB = () => {
    axios
        .get(
            "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=EY4HQCTINHG9CEVSNDFND3AKXNIU8KBZA4"
        )
        .then((response) => {
            gasPriceNetwork = response.data.result.ProposeGasPrice;

            // Update database with new gas price value
            const sql = "UPDATE Etherscan_requests SET GasPrice = ?";
            const data = [gasPriceNetwork];
            db.query(sql, data, (err, results) => {
                if (err) throw err;
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

// Call the fetchDataAndUpdateDB function every second
setInterval(fetchDataAndUpdateDB, 1000);

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

app.get("/api/:account", (req, res) => {
    const account = req.params.account;
    const query = `SELECT * FROM users WHERE user_wallet = '${account}'`;

    db.query(query, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(data[0]);
        }
    });
});
