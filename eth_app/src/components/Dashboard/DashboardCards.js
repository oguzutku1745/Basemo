import React, {useContext, Button} from "react";
import { userInputs } from "../../pages/Botpage/Botpage";

export default function DashboardCards() {
    const { sharedState } = useContext(userInputs);
    console.log("shared State is: ",sharedState)

    function handleClick() {
        if (sharedState.eventListener === "Read") {
            sendRequestToBackend(
                sharedState.taskContract,
                sharedState.taskContractABI,
                sharedState.eventListenerFunction,
                sharedState.eventListenerInput,
                sharedState.taskContractFunction,
                sharedState.taskContractFunctionInput,
                sharedState.selectedGasPrice,
                sharedState.mintPrivateKey
            );
        } else {
            sendRequestToBackendFunction(
                sharedState.taskContract,
                sharedState.taskContractABI,
                sharedState.eventListenerFunction,
                sharedState.eventListenerInput,
                sharedState.taskContractFunction,
                sharedState.taskContractFunctionInput,
                sharedState.selectedGasPrice,
                sharedState.mintPrivateKey,
                sharedState.eventListenerPending
            );
        }
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
        pendingStatus
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
            pendingStatus
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
                console.log(data);
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
        PrivateKeyTxn
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
                console.log(data);
            });
    }

    return(
        <div className="body" >
            {sharedState.taskName ?(
            <div className="dashboard-Card">
                <h3 className="taskNameColor">{sharedState.taskName}</h3>
                <h4>{sharedState.taskContract}</h4>
                <hr />
                <div className="dashboard-Taskinputs">
                Mint Wallet: {sharedState.mintWallet} <br />
                State Change Type: {sharedState.eventListener} <br />
                Targeted Function To Listen: {sharedState.eventListenerFunction} <br />
                Targeted Input To Listen: {sharedState.eventListenerInput} <br />
                Function Tx Will Send: {sharedState.taskContractFunction} <br />
                Input For The Tx: {sharedState.taskContractFunctionInput} <br />
                Setted Gas: {sharedState.selectedGasPrice}
                </div>
                <button className="buttons" onClick={handleClick}> FIRE </button>
            </div>
            ):(
            <div className="nothingness">
                Nothing to see here
            </div>
            )
            }
        </div>
    )
}