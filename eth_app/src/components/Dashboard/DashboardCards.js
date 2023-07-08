import React, { useContext, useState, memo, useEffect } from "react";
import { userInputs } from "../../pages/Botpage/Botpage";
import axios from "axios";

const DashboardCards = ({
    task,
    user_id,
    deleteTask,
    index,
    Increment_active_task_count,
    Decrement_active_task_count,
}) => {
    const [Status, setStatus] = useState(task.taskstatus || "Steady");
    const [DisplayGas, setDisplayGas] = useState(task.selectedGasPrice);
    const [GasButtonLastClicked, setGasButtonLastClicked] = useState(0);

    const [UserNewGas, setUserNewGas] = useState(0);
    console.log(Status);

    const sharedState = task;
    useEffect(() => {
        if (Status === "Completed" || Status === "Error")
            Decrement_active_task_count();
    }, [Status]);

    function handleClick() {
        setStatus("Active");
        Increment_active_task_count();
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
                task.taskID,
                task.mintPrice,
                user_id
            );
            sendDataToDatabase({
                user_id: user_id,
                mintWallet: sharedState.mintWallet,
                mintPrivateKey: sharedState.mintPrivateKey,
                eventListener: sharedState.eventListener,
                eventListenerFunction: sharedState.eventListenerFunction,
                eventListenerInput: sharedState.eventListenerInput,
                taskContract: sharedState.taskContract,
                taskContractABI: sharedState.taskContractABI,
                taskContractFunction: sharedState.taskContractFunction,
                taskContractFunctionInput:
                    sharedState.taskContractFunctionInput,
                gasPrice: sharedState.selectedGasPrice,
                taskName: sharedState.taskName,
                taskId: task.taskID,
                mintPrice: task.mintPrice,
                status: Status,
            });
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
                task.taskID,
                task.mintPrice
            );
            sendDataToDatabase({
                user_id: user_id,
                mintWallet: sharedState.mintWallet,
                mintPrivateKey: sharedState.mintPrivateKey,
                eventListener: sharedState.eventListener,
                eventListenerFunction: sharedState.eventListenerFunction,
                eventListenerInput: sharedState.eventListenerInput,
                taskContract: sharedState.taskContract,
                taskContractABI: sharedState.taskContractABI,
                taskContractFunction: sharedState.taskContractFunction,
                taskContractFunctionInput:
                    sharedState.taskContractFunctionInput,
                gasPrice: sharedState.selectedGasPrice,
                taskName: sharedState.taskName,
                taskId: task.taskID,
                mintPrice: task.mintPrice,
                status: Status,
                eventListenerPending: sharedState.eventListenerPending,
            });
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
                task.taskID,
                task.mintPrice
            );
            sendDataToDatabase({
                user_id: user_id,
                mintWallet: sharedState.mintWallet,
                mintPrivateKey: sharedState.mintPrivateKey,
                eventListener: sharedState.eventListener,
                eventListenerFunction: sharedState.eventListenerFunction,
                eventListenerInput: sharedState.eventListenerInput,
                taskContract: sharedState.taskContract,
                taskContractABI: sharedState.taskContractABI,
                taskContractFunction: sharedState.taskContractFunction,
                taskContractFunctionInput:
                    sharedState.taskContractFunctionInput,
                gasPrice: sharedState.selectedGasPrice,
                taskName: sharedState.taskName,
                taskId: task.taskID,
                mintPrice: task.mintPrice,
                status: Status,
            });
        }
    }

    const sendDataToDatabase = (data) => {
        console.log(data);
        axios
            .post("http://localhost:3002/api/tasks", data)
            .then((response) => console.log("Success:", response))
            .catch((error) => console.error("Error:", error));
    };

    function handleClickChangeGas() {
        if (GasButtonLastClicked + 5000 > new Date().getTime()) {
            return;
        }
        setGasButtonLastClicked(new Date().getTime());
        handleClickStop(0);
        setDisplayGas(UserNewGas);
        task.selectedGasPrice = UserNewGas;
        handleClick();
    }

    function handleClickStop(Isdelete) {
        Decrement_active_task_count();
        const taskID = task.taskID;

        const requestData = {
            taskID,
        };

        if (
            sharedState.eventListener === "Read" ||
            sharedState.eventListener === "blockNumber"
        ) {
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
        if (Isdelete) {
            deleteTask(task);
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
        taskID,
        mintPrice
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
            mintPrice,
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
        taskID,
        mintPrice
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
            mintPrice,
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

    function handleChange(event) {
        setUserNewGas(event.target.value);
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
        taskID,
        mintPrice,
        user_id
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
            mintPrice,
            user_id,
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
                    style={{
                        border:
                            Status === "Active"
                                ? "4px solid yellow"
                                : Status === "Completed"
                                ? "4px solid green"
                                : Status === "Error"
                                ? "4px solid red"
                                : "4px solid #ffffff",
                    }}
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
                        Setted Gas: {DisplayGas}
                        <br />
                        {Status === "Active" ? (
                            <div>
                                <input
                                    type="text"
                                    value={UserNewGas}
                                    onChange={handleChange}
                                    placeholder="Enter new gas price"
                                    style={{ width: `210px` }} // set the width using the style prop
                                />
                                <button
                                    className="buttons"
                                    onClick={() => handleClickChangeGas()}
                                >
                                    {" "}
                                    Change the Gas{" "}
                                </button>
                            </div>
                        ) : (
                            ""
                        )}
                        <br />
                        <br />
                    </div>
                    <div className="Statu">
                        {Status === "Steady" ? (
                            <button className="buttons" onClick={handleClick}>
                                {" "}
                                FIRE{" "}
                            </button>
                        ) : Status === "Active" ? (
                            <div className="dashboard-Taskinputs">
                                Status: Active
                            </div>
                        ) : Status === "Completed" ? (
                            <div className="dashboard-Taskinputs">
                                {" "}
                                Status: Completed{" "}
                            </div>
                        ) : (
                            Status === "Error" && (
                                <div className="dashboard-Taskinputs">
                                    {" "}
                                    Status: False{" "}
                                </div>
                            )
                        )}
                        <div>
                            {Status === "Active" ? (
                                <button
                                    className="buttons"
                                    onClick={() => handleClickStop(1)}
                                >
                                    {" "}
                                    Delete The Task{" "}
                                </button>
                            ) : (
                                ""
                            )}
                            {Status === "Steady" ? (
                                <button
                                    className="buttons"
                                    onClick={() => deleteTask(task)}
                                >
                                    {" "}
                                    Delete The Task{" "}
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
};
export default DashboardCards;
