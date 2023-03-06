import React, {useContext} from "react";
import { userInputs } from "../../pages/Botpage/Botpage";

export default function DashboardCards() {
    const { sharedState } = useContext(userInputs);
    console.log("shared State is: ",sharedState)
    return(
        <div className="dashboard-Container" >
            <div className="dashboard-Card">
                <h3 className="taskNameColor">{sharedState.taskName}</h3>
                <h4>{sharedState.taskContract}</h4>
                <hr />
                <div className="dashboard-Taskinputs">
                Mint Wallet: {sharedState.mintWallet} <br />
                State Change Type: null <br />
                Targeted Function To Listen: {sharedState.eventListenerFunction} <br />
                Targeted Input To Listen: {sharedState.eventListenerInput} <br />
                Function Tx Will Send: {sharedState.taskContractFunction} <br />
                Input For The Tx: {sharedState.taskContractFunctionInput} <br />
                Setted Gas: {sharedState.selectedGasPrice}
                </div>
            </div>
            
        </div>
    )
}