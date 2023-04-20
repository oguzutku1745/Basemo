const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const Bottleneck = require("bottleneck");

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Create the rate limiter in the master process
    const fetchDataAndUpdateDBLimiter = new Bottleneck({
        minTime: 2000, // 1 request every 2 seconds
    });

    const listenToBlockNumberLimiter = new Bottleneck({
        minTime: 2000, // Minimum time between tasks in milliseconds (2 seconds)
    });

    // Fork worker processes for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log("Forking a new worker");
        cluster.fork();
    });

    // Listen to messages from worker processes
    cluster.on("message", (worker, message) => {
        if (message.type === "requestRateLimit") {
            const taskId = message.taskId;
            const targetValue = message.targetValue;
            if (taskId === "fetchDataAndUpdateDBTask") {
                fetchDataAndUpdateDBLimiter.schedule(() => {
                    worker.send({ type: "rateLimitResponse", taskId });
                });
            } else {
                listenToBlockNumberLimiter.schedule(() => {
                    worker.send({
                        type: "rateLimitResponse",
                        taskId,
                        targetValue,
                    });
                });
            }
        }
    });

    cluster.on("error", (worker, error) => {
        console.error(
            `Worker ${worker.process.pid} encountered an error:`,
            error
        );
        // Handle the error, e.g., log it, restart the worker, etc.
    });
} else {
    const express = require("express");
    const app = express();
    const { check, body, validationResult } = require("express-validator");
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
            "wss://eth-mainnet.g.alchemy.com/v2/04sBQAgtEQL0-ixJE6Kc2lQ-8kaiYVS0"
        )
    );

    // Send a message to the master process to request rate limiting
    const requestRateLimit = (taskId, targetValue) => {
        process.send({
            type: "requestRateLimit",
            taskId,
            targetValue,
        });
    };

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
    var provider = new ethers.providers.InfuraProvider(
        "goerli",
        "0fe302203e9f42fc9dffae2ccb1494c2"
    );

    const validateRequestBody = [
        check("contractAddress").isEthereumAddress(),
        check("ABI").isArray(),
        check("targetFunction").notEmpty(),
        check("targetValue").isNumeric(),
        check("FunctionToCall").notEmpty(),
        check("SelectedUserGas").isNumeric(),
        check("PrivateKeyTxn").notEmpty(),
        check("taskID").notEmpty(),
    ];

    app.post("/api/listen", validateRequestBody, (req, res) => {
        const {
            contractAddress,
            ABI,
            targetFunction,
            targetValue,
            FunctionToCall,
            FunctionToCallInput,
            SelectedUserGas,
            PrivateKeyTxn,
            taskID,
            mintPrice,
        } = req.body;
        console.log(req.body);
        var result;
        listenToVariable(
            contractAddress,
            ABI,
            taskID,
            targetFunction,
            targetValue,
            mintPrice,
            async () => {
                try {
                    result = await sendWriteTxnRead(
                        FunctionToCall,
                        FunctionToCallInput,
                        SelectedUserGas,
                        PrivateKeyTxn,
                        ABI,
                        contractAddress,
                        mintPrice
                    );
                    if (result.error) {
                        res.status(500).json({ error: result.error });
                    } else {
                        // Update status in the database
                        const sql =
                            "UPDATE mint_tasks SET status = 'Completed' WHERE taskID = ?";
                        const data = [taskID];
                        db.query(sql, data, (err, results) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${results.affectedRows} row(s)`
                            );
                        });
                        res.status(200).json({
                            transaction: result.transactions,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            () => {
                // Update status in the database
                const sql =
                    "UPDATE mint_tasks SET status = 'Failed' WHERE taskID = ?";
                const data = [taskID];
                db.query(sql, data, (err, results) => {
                    if (err) throw err;
                    console.log(`Updated ${results.affectedRows} row(s)`);
                });
            }
        );
    });

    const validateListenBlockNumberBody = [
        check("contractAddress").isEthereumAddress(),
        check("ABI").isArray(),
        check("targetValue").isNumeric(),
        check("FunctionToCall").notEmpty(),
        body("FunctionToCallInput")
            .if(body("FunctionToCallInput").exists())
            .notEmpty(),
        check("SelectedUserGas").isNumeric(),
        check("PrivateKeyTxn").notEmpty(),
        check("taskID").notEmpty(),
    ];

    app.post(
        "/api/listenBlockNumber",
        validateListenBlockNumberBody,
        (req, res) => {
            const {
                contractAddress,
                ABI,
                targetValue,
                FunctionToCall,
                FunctionToCallInput,
                SelectedUserGas,
                PrivateKeyTxn,
                taskID,
                mintPrice,
            } = req.body;
            console.log(req.body);

            const startBlockListening = async (
                taskId,
                targetValue,
                callback
            ) => {
                listenToBlockNumber(targetValue, taskId, callback);
            };

            startBlockListening(taskID, targetValue, async () => {
                try {
                    const result = await sendWriteTxnRead(
                        FunctionToCall,
                        FunctionToCallInput,
                        SelectedUserGas,
                        PrivateKeyTxn,
                        ABI,
                        contractAddress,
                        mintPrice
                    );
                    if (result.error) {
                        const sql =
                            "UPDATE mint_tasks SET status = 'Error' WHERE taskID = ?";
                        const data = [taskID];
                        db.query(sql, data, (err, results) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${results.affectedRows} row(s)`
                            );
                        });
                        res.status(500).json({ error: result.error });
                    } else {
                        const sql =
                            "UPDATE mint_tasks SET status = 'Completed' WHERE taskID = ?";
                        const data = [taskID];
                        db.query(sql, data, (err, results) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${results.affectedRows} row(s)`
                            );
                        });
                        res.status(200).json({
                            transaction: result.transactions,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    );

    // Function to start listening to a specific contract variable and target value
    const listenToVariable = async (
        contractAddress,
        ABI,
        taskID,
        targetFunction,
        targetValue,
        mintPrice,
        callback
    ) => {
        const contract = new ethers.Contract(contractAddress, ABI, provider);

        const intervalId = setInterval(async () => {
            const newValue = await contract[targetFunction]();
            console.log(newValue);
            if (newValue.toString() === targetValue.toString()) {
                callback();
                clearInterval(intervalId); // stop listening after callback is called
                emitterMap.delete(taskID);
            }
            currentValue = newValue;
        }, 1000); // poll every 1 second
        emitterMap.set(taskID, intervalId);

        console.log(
            `Started listening for variable ${targetFunction} on contract ${contractAddress}`
        );
    };

    const listenToBlockNumber = async (targetValue, taskID, callback) => {
        const currentBlockNumber = await provider.getBlockNumber();
        console.log(currentBlockNumber);

        if (currentBlockNumber >= targetValue) {
            // No need to request rate limiting again since the task is done
            console.log(`Reached block number ${targetValue}`);
            callback();
        } else {
            setTimeout(
                () => listenToBlockNumber(targetValue, taskID, callback),
                2000
            ); // Poll every 2 seconds
        }

        console.log(`Started listening for block number ${targetValue}`);
    };

    process.on("message", (message) => {
        if (message.type === "rateLimitResponse") {
            const taskId = message.taskId;

            // Call the corresponding callback function
            if (taskId === "fetchDataAndUpdateDBTask") {
                fetchDataAndUpdateDB();
            } else {
                const targetBlockValue = message.targetValue;
                listenToBlockNumber(targetBlockValue, taskId);
            }
        }
    });

    app.post("/api/stopListeningRead", async (req, res) => {
        const { taskID } = req.body;

        // Generate the composite key

        // Retrieve the emitter object from the map using the composite key
        const task = emitterMap.get(taskID);
        console.log(task);
        console.log(taskID);
        if (task) {
            // Stop listening for events
            clearInterval(emitterMap.get(taskID)); // clear the interval using the user ID
            emitterMap.delete(taskID); // remove the interval ID from the map

            res.status(200).json({ message: "Stopped listening" });
            console.log("stopped");
        } else {
            res.status(404).json({ error: "Task not found" });
            console.log("Task not found");
        }
    });

    const validateContractAddress = [
        check("contractAddress").isEthereumAddress(),
    ];

    app.get(
        "/getABI/:contractAddress",
        validateContractAddress,
        async (req, res) => {
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
        }
    );

    async function sendWriteTxnRead(
        FunctionToCall,
        FunctionToCallInput,
        SelectedUserGas,
        PrivateKeys,
        ABI,
        contractAddress,
        mintPrice
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
        console.log(mintPrice);
        const mintpricetouse = ethers.utils.parseEther(mintPrice.toString());
        console.log(mintpricetouse);

        for (const privateKey of PrivateKeys) {
            try {
                const wallet = new ethers.Wallet(privateKey, provider);
                const signer = wallet.connect(provider);

                const transaction = await contract_txn
                    .connect(signer)
                    [FunctionToCall](...inputs, {
                        value: mintpricetouse,
                        gasPrice: gasPriceToUse,
                    });

                console.log(transaction);

                transactions.push(transaction); // Return true if the transaction was successful
            } catch (error) {
                console.log(error);
                return { error };
            }
        }
        return { transactions };
    }

    const validateListenFunctionBody = [
        check("contractAddress").isEthereumAddress(),
        check("ABI").isArray(),
        check("targetFunction").notEmpty(),
        check("FunctionToCall").notEmpty(),
        check("SelectedUserGas").isNumeric(),
        check("PrivateKeyTxn").notEmpty(),
        check("pendingStatus").isBoolean(),
        check("user_id").notEmpty(),
        check("taskID").notEmpty(),
    ];

    const emitterMap = new Map();
    app.post(
        "/api/listenFunction",
        validateListenFunctionBody,
        async (req, res) => {
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
                taskID,
                mintPrice,
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

            emitterMap.set(taskID, blocknative.account(address).emitter);
            console.log(emitterMap);

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
                                emitterMap.delete(taskID);

                                result = await sendWriteTxnRead(
                                    FunctionToCall,
                                    FunctionToCallInput,
                                    SelectedUserGas,
                                    PrivateKeyTxn,
                                    ABI,
                                    contractAddress,
                                    mintPrice
                                );
                                if (result.error) {
                                    const sql =
                                        "UPDATE mint_tasks SET status = 'Error' WHERE taskID = ?";
                                    const data = [taskID];
                                    db.query(sql, data, (err, results) => {
                                        if (err) throw err;
                                        console.log(
                                            `Updated ${results.affectedRows} row(s)`
                                        );
                                    });
                                    res.status(500).json({
                                        error: result.error,
                                    });
                                } else {
                                    const sql =
                                        "UPDATE mint_tasks SET status = 'Completed' WHERE taskID = ?";
                                    const data = [taskID];
                                    db.query(sql, data, (err, results) => {
                                        if (err) throw err;
                                        console.log(
                                            `Updated ${results.affectedRows} row(s)`
                                        );
                                    });
                                    res.status(200).json({
                                        transaction: result.transaction,
                                    });
                                }
                            }
                        } else {
                            if (transaction.status === "confirmed") {
                                console.log("MATCH for confirmed");
                                emitter.off("all");
                                emitterMap.delete(taskID);

                                result = await sendWriteTxnRead(
                                    FunctionToCall,
                                    FunctionToCallInput,
                                    SelectedUserGas,
                                    PrivateKeyTxn,
                                    ABI,
                                    contractAddress,
                                    mintPrice
                                );
                                if (result.error) {
                                    const sql =
                                        "UPDATE mint_tasks SET status = 'Error' WHERE taskID = ?";
                                    const data = [taskID];
                                    db.query(sql, data, (err, results) => {
                                        if (err) throw err;
                                        console.log(
                                            `Updated ${results.affectedRows} row(s)`
                                        );
                                    });
                                    res.status(500).json({
                                        error: result.error,
                                    });
                                } else {
                                    const sql =
                                        "UPDATE mint_tasks SET status = 'Completed' WHERE taskID = ?";
                                    const data = [taskID];
                                    db.query(sql, data, (err, results) => {
                                        if (err) throw err;
                                        console.log(
                                            `Updated ${results.affectedRows} row(s)`
                                        );
                                    });
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
        }
    );

    app.post("/api/stopListeningFunction", async (req, res) => {
        const { taskID } = req.body;

        // Generate the composite key

        // Retrieve the emitter object from the map using the composite key
        const task = emitterMap.get(taskID);
        console.log(task);
        console.log(taskID);
        if (task) {
            // Stop listening for events
            task.off("all");

            // Remove the task from the map
            emitterMap.delete(taskID);

            res.status(200).json({ message: "Stopped listening" });
            console.log("stopped");
        } else {
            res.status(404).json({ error: "Task not found" });
            console.log("Task not found");
        }
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
        const data = [
            req.body.user_id,
            req.body.mint_wallet,
            req.body.private_key,
        ];
        db.query(sql, data, (err, results) => {
            if (err) throw err;
            console.log(`Inserted ${results.affectedRows} row(s)`);
        });
    });

    app.post("/api/tasks", (req, res) => {
        const sql =
            "INSERT INTO mint_tasks(user_id, eventListener, eventListenerInput, eventListenerFunction, eventListenerPending, mintPrice, mintPrivateKey, mintWallet, gasPrice, taskContract, taskContractABI, taskContractFunction, taskContractFunctionInput, taskID, taskName, status) VALUES(?, ?, ?, ? , ?, ?, ?, ? , ?, ?, ?, ? , ?, ?, ?, ?)";
        const data = [
            req.body.user_id,
            req.body.eventListener,
            req.body.eventListenerInput,
            req.body.eventListenerFunction,
            req.body.eventListenerPending,
            req.body.mintPrice,
            req.body.mintPrivateKey,
            req.body.mintWallet,
            req.body.gasPrice,
            req.body.taskContract,
            req.body.taskContractABI,
            req.body.taskContractFunction,
            req.body.taskContractFunctionInput,
            req.body.taskId,
            req.body.taskName,
            "Active",
        ];
        db.query(sql, data, (err, results) => {
            console.log(data);
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

    const fetchDataAndUpdateDB = async () => {
        try {
            const gasPriceInWei = await web3.eth.getGasPrice();
            const gasPriceInGwei = web3.utils.fromWei(gasPriceInWei, "gwei");
            // Update database with new gas price value
            const sql = "UPDATE Etherscan_requests SET GasPrice = ?";
            const data = [gasPriceInGwei];
            db.query(sql, data, (err, results) => {
                if (err) throw err;
            });
        } catch (error) {
            console.error("Error fetching gas price:", error);
        }
        // Schedule the next rate limit request
        scheduleNextRateLimitRequest("fetchDataAndUpdateDBTask", 2000);
    };

    const scheduleNextRateLimitRequest = (taskId, interval) => {
        setTimeout(() => {
            requestRateLimit(taskId);
        }, interval);
    };

    const startDataFetching = async (taskId, interval) => {
        scheduleNextRateLimitRequest(taskId, interval);
    };

    // Start data fetching
    startDataFetching("fetchDataAndUpdateDBTask", 2000);

    // Call the fetchDataAndUpdateDB function every second
    //setInterval(fetchDataAndUpdateDB);

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

    app.get("/api/getTasks/:user_id", (req, res) => {
        const user_id = req.params.user_id;
        const query = `SELECT * FROM mint_tasks WHERE user_id = '${user_id}'`;

        db.query(query, (err, data) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.json(data);
            }
        });
    });
}
