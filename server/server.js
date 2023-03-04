const express = require("express");
const app = express();
const db = require("../eth_app/src/db");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");
const { ethers } = require("ethers");

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
    listenToVariable(contractAddress, ABI, targetFunction, targetValue, () => {
        sendWriteTxnRead(
            FunctionToCall,
            FunctionToCallInput,
            SelectedUserGas,
            PrivateKeyTxn,
            ABI,
            contractAddress
        );
        console.log(
            `Target value ${targetValue} reached for variable ${targetFunction} on contract ${contractAddress}`
        );
    });

    res.status(200).json({
        message: `Started listening for variable ${targetFunction} on contract ${contractAddress}`,
    });
});

async function sendWriteTxnRead(
    FunctionToCall,
    FunctionToCallInput,
    SelectedUserGas,
    PrivateKeyTxn,
    ABI,
    contractAddress
) {
    const wallet = new ethers.Wallet(PrivateKeyTxn, provider);
    const signer = wallet.connect(provider);
    const NetworkGasPrice = 80;
    Interface_txn = new ethers.utils.Interface(ABI);

    const contract_txn = new ethers.Contract(
        contractAddress,
        Interface_txn,
        provider
    );

    const gasPriceToUse = SelectedUserGas
        ? ethers.utils.parseUnits(SelectedUserGas.toString(), "gwei")
        : ethers.utils.parseUnits(NetworkGasPrice.toString(), "gwei");

    const inputs = Array.isArray(FunctionToCallInput)
        ? FunctionToCallInput
        : [FunctionToCallInput];

    const transaction = await contract_txn
        .connect(signer)
        [FunctionToCall](...inputs, { gasPrice: gasPriceToUse });

    console.log(transaction);
}

app.post("/api/listenFunction", (req, res) => {
    console.log(req.body);
    const { contractAddress, ABI, targetFunction, inputs } = req.body;
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const functionSignature = "incrementByValue(uint)";
    const filter = {
        address: contractAddress,
        topics: [ethers.utils.id(functionSignature)],
    };
    contract.on(filter, (log) => {
        console.log("Function called on contract:", log.transactionHash);
    });

    res.status(200).json({
        message: `Started listening for function ${targetFunction} on contract ${contractAddress}`,
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

    let currentValue = await contract[targetFunction]();
    const intervalId = setInterval(async () => {
        const newValue = await contract[targetFunction]();
        console.log(newValue);
        if (
            newValue.toString() !== currentValue.toString() &&
            newValue.toString() === targetValue.toString()
        ) {
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
            const sql = "UPDATE Etherscan_requests SET GasPrice = ?";
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
