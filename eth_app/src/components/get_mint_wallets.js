import Web3 from "web3";
import React, { useState, useEffect } from "react";
import axios from "axios";
const web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);

const CreateWallet = ({ location }) => {
    const [mint_wallet, setMint_wallet] = useState();
    const [private_key, setPrivate_key] = useState();
    const [child_user_id, setChild_user_id] = useState();

    useEffect(() => {
        if (location && location.state && location.state.user_id) {
            setChild_user_id(location.state.user_id);
        }
    }, [location]);

    const handleSubmit = () => {
        myFunction();
        // Send outputs to the database here
        sendDataToDatabase({
            user_id: child_user_id,
            mint_wallet: mint_wallet,
            private_key: private_key,
        });
    };

    const myFunction = () => {
        var mint_account = web3.eth.accounts.create();
        var mint_wallet_address = mint_account.address;
        var mint_wallet_private_key = mint_account.privateKey;
        setMint_wallet(mint_wallet_address);
        setPrivate_key(mint_wallet_private_key);
    };

    const sendDataToDatabase = (data) => {
        axios
            .post("http://localhost:3002/api/data", data)
            .then((response) => console.log("Success:", response))
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div>
            <button onClick={handleSubmit}> Create mint wallet </button>
        </div>
    );
};

export default CreateWallet;
