import Web3 from "web3";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);

const CreateWallet = ({
    user_id,
    mint_wallets,
    private_keys,
    changeStateMintWallets,
    changeStatePrivateKeys,
}) => {
    const location = useLocation();
    //console.log(location.state.user_id);

    const [child_user_id, setChild_user_id] = useState(user_id);
    console.log(child_user_id);

    const handleSubmit = () => {
        var mint_account = web3.eth.accounts.create();
        var mint_wallet_address = mint_account.address;
        var mint_wallet_private_key = mint_account.privateKey;
        changeStateMintWallets(mint_wallet_address);
        changeStatePrivateKeys(mint_wallet_private_key);
        // Send outputs to the database here
        sendDataToDatabase({
            user_id: child_user_id,
            mint_wallet: mint_wallet_address,
            private_key: mint_wallet_private_key,
        });
    };

    /*const myFunction = () => {
        var mint_account = web3.eth.accounts.create();
        var mint_wallet_address = mint_account.address;
        var mint_wallet_private_key = mint_account.privateKey;
    };*/

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
                    backgroundColor: "black",
                    color: "#D80606",
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
