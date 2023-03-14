import React from "react";

export default function Step6(props) {
    return (
        <div className="dashboard-Container">
            {props.mintSectionInputs ? (
                <div className="dashboard-Card">
                    <h3 className="taskNameColor">
                        {props.mintSectionInputs.taskName}
                    </h3>
                    <h4>{props.mintSectionInputs.taskContract}</h4>
                    <hr />
                    <div className="dashboard-Taskinputs">
                        Mint Wallet(s):{" "}
                        {props.mintSectionInputs.mintWallet.map(
                            (mint_wallet) => (
                                <div>
                                    {" "}
                                    {mint_wallet} <br></br>
                                </div>
                            )
                        )}{" "}
                        <br />
                        State Change Type: {props.mintSectionInputs.eventListener} <br />
                        Targeted Function To Listen:{" "}
                        {props.mintSectionInputs.eventListenerFunction} <br />
                        Targeted Input To Listen:{" "}
                        {props.mintSectionInputs.eventListenerInput} <br />
                        Function Tx Will Send:{" "}
                        {props.mintSectionInputs.taskContractFunction} <br />
                        Input For The Tx:{" "}
                        {props.mintSectionInputs.taskContractFunctionInput}{" "}
                        <br />
                        Setted Gas: {props.mintSectionInputs.selectedGasPrice}
                    </div>
                    <p className="dashboardInformer">
                        You can start your mint task from Dashboard
                    </p>
                </div>
            ) : (
                <div className="nothingness">Nothing to see here</div>
            )}
        </div>
    );
}
