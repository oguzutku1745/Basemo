import Web3 from "web3";
import React, { useState, useEffect } from "react";
import axios from "axios";
const web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);

const CreateWallet = ({
    user_id,
    changeStateMintWallets,
    changeStatePrivateKeys,
}) => {
    const handleSubmit = () => {
        var mint_account = web3.eth.accounts.create();
        changeStateMintWallets(mint_account.address);
        changeStatePrivateKeys(mint_account.privateKey);
        // Send outputs to the database here
        sendDataToDatabase({
            user_id: user_id,
            mint_wallet: mint_account.address,
            private_key: mint_account.privateKey,
        });
    };

    const sendDataToDatabase = (data) => {
        axios
            .post("http://localhost:3002/api/data", data)
            .then((response) => console.log("Success:", response))
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div>
            <button
                style={{
                    backgroundColor: "#82bde4",
                    color: "white",
                    padding: "15px 30px",
                    fontSize: "20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "20px",
                }}
                onClick={handleSubmit}
            >
                {" "}
                Create mint wallet{" "}
            </button>
        </div>
    );
};

export default CreateWallet;
