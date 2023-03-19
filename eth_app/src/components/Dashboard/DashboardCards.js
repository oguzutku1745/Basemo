import React, { useContext, useState } from "react";
import { userInputs } from "../../pages/Botpage/Botpage";

export default function DashboardCards({ task, user_id }) {
    const [Status, setStatus] = useState("Steady");
    const sharedState = task;

    const [fireButtonLastClicked, setFireButtonLastClicked] = useState(0);
    const [stopButtonLastClicked, setStopButtonLastClicked] = useState(0);

    console.log("shared State is: ", sharedState);

    function handleClick() {
        if (stopButtonLastClicked + 4000 > new Date().getTime()) {
            return;
        }
        setStopButtonLastClicked(new Date().getTime());

        setStatus("Active");
        if (sharedState.eventListener === "Read") {
            sendRequestToBackend(
                sharedState.taskContract,
                sharedState.taskContractABI,
                sharedState.eventListenerFunction,
                sharedState.eventListenerInput,
                sharedState.taskContractFunction,
                sharedState.taskContractFunctionInput,
                sharedState.selectedGasPrice,
                sharedState.mintPrivateKey,
                task.taskID
            );
        } else if (sharedState.eventListener === "Mempool") {
            sendRequestToBackendFunction(
                sharedState.taskContract,
                sharedState.taskContractABI,
                sharedState.eventListenerFunction,
                sharedState.eventListenerInput,
                sharedState.taskContractFunction,
                sharedState.taskContractFunctionInput,
                sharedState.selectedGasPrice,
                sharedState.mintPrivateKey,
                sharedState.eventListenerPending,
                user_id,
                task.taskID
            );
        } else if (sharedState.eventListener === "blockNumber") {
            sendRequestbyBlockNumber(
                sharedState.taskContract,
                sharedState.taskContractABI,
                sharedState.eventListenerInput,
                sharedState.taskContractFunction,
                sharedState.taskContractFunctionInput,
                sharedState.selectedGasPrice,
                sharedState.mintPrivateKey,
                sharedState.eventListenerPending,
                user_id,
                task.taskID
            );
        }
    }

    function handleClickStop() {
        if (stopButtonLastClicked + 4000 > new Date().getTime()) {
            return;
        }
        setStopButtonLastClicked(new Date().getTime());

        setStatus("Steady");

        const taskID = task.taskID;

        const requestData = {
            taskID,
        };
        if (sharedState.eventListener === "Read") {
            fetch("/api/stopListeningRead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        console.log(data.message);
                    } else {
                        console.log(data.error);
                    }
                });
        } else {
            fetch("/api/stopListeningFunction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        console.log(data.message);
                    } else {
                        console.log(data.error);
                    }
                });
        }
    }

    function sendRequestbyBlockNumber(        
        contractAddress,
        ABI,
        targetValue,
        FunctionToCall,
        FunctionToCallInput,
        SelectedUserGas,
        PrivateKeyTxn,
        pendingStatus,
        user_id,
        taskID
    ) {
        const requestData = {
            contractAddress, // value of contractAddress,
            ABI,
            targetValue, // value of targetValue
            FunctionToCall,
            FunctionToCallInput,
            SelectedUserGas,
            PrivateKeyTxn,
            pendingStatus,
            user_id,
            taskID,
        };
        fetch("/api/listenBlockNumber", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setStatus("Error");
                } else {
                    console.log(data.transaction);
                    setStatus("Completed");
                    // handle successful transaction
                }
            });
    }

    function sendRequestToBackendFunction(
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
        taskID
    ) {
        const requestData = {
            contractAddress, // value of contractAddress,
            ABI,
            targetFunction, // value of targetFunction,
            targetValue, // value of targetValue
            FunctionToCall,
            FunctionToCallInput,
            SelectedUserGas,
            PrivateKeyTxn,
            pendingStatus,
            user_id,
            taskID,
        };
        fetch("/api/listenFunction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setStatus("Error");
                } else {
                    console.log(data.transaction);
                    setStatus("Completed");
                    // handle successful transaction
                }
            });
    }

    function sendRequestToBackend(
        contractAddress,
        ABI,
        targetFunction,
        targetValue,
        FunctionToCall,
        FunctionToCallInput,
        SelectedUserGas,
        PrivateKeyTxn,
        taskID
    ) {
        const requestData = {
            contractAddress, // value of contractAddress,
            ABI, // value of ABI,
            targetFunction, // value of targetFunction,
            targetValue, // value of targetValue
            FunctionToCall,
            FunctionToCallInput,
            SelectedUserGas,
            PrivateKeyTxn,
            taskID,
        };
        fetch("/api/listen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    setStatus("Error");
                } else {
                    console.log(data.transaction);
                    setStatus("Completed");
                    // handle successful transaction
                }
            });
    }
    const statusColors = {
        Steady: "gray",
        Active: "yellow",
        Completed: "green",
        Error: "red",
    };

    return (
        <div className="body">
            {sharedState.taskName ? (
                <div
                    className="dashboard-Card"
                    style={{ backgroundColor: statusColors[Status] }}
                >
                    <h3 className="taskNameColor">{sharedState.taskName}</h3>
                    <h4>{sharedState.taskContract}</h4>
                    <hr />
                    <div className="dashboard-Taskinputs">
                        Mint Wallet(s):
                        {sharedState.mintWallet.map((mint_wallet) => (
                            <div>
                                {" "}
                                {mint_wallet} <br></br>
                            </div>
                        ))}{" "}
                        <br />
                        State Change Type: {sharedState.eventListener} <br />
                        Targeted Function To Listen:{" "}
                        {sharedState.eventListenerFunction} <br />
                        Targeted Input To Listen:{" "}
                        {sharedState.eventListenerInput} <br />
                        Function Tx Will Send:{" "}
                        {sharedState.taskContractFunction} <br />
                        Input For The Tx:{" "}
                        {sharedState.taskContractFunctionInput} <br />
                        Setted Gas: {sharedState.selectedGasPrice}
                    </div>
                    <div className="Statu">
                        {Status === "Steady" ? (
                            <button className="buttons" onClick={handleClick}>
                                {" "}
                                FIRE{" "}
                            </button>
                        ) : Status === "Active" ? (
                            <div>Status: Active</div>
                        ) : Status === "Completed" ? (
                            <div> Status: Completed </div>
                        ) : (
                            Status === "Error" && <div> Status: False </div>
                        )}
                        <div>
                            {Status === "Active" ? (
                                <button
                                    className="buttons"
                                    onClick={() => handleClickStop()}
                                >
                                    {" "}
                                    STOP{" "}
                                </button>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="nothingness">Nothing to see here</div>
            )}
        </div>
    );
}
