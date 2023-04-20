import Web3 from "web3";
import React, { useState } from "react";
import axios from "axios";
const web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);

function ImportPopup(props) {
    const [privateKey, setPrivateKey] = useState("");

    function handleInputChange(event) {
        props.onChange(event.target.value);
    }

    function handleImport() {
        props.handleImport();
        setPrivateKey("");
    }

    return (
        <div className="popup">
            <label htmlFor="privateKey">Enter Private Key:</label>
            <input id="privateKey" type="text" onChange={handleInputChange} />
            <button onClick={handleImport}>Import</button>
            <button onClick={props.onClose}>Cancel</button>
        </div>
    );
}

const CreateWallet = ({
    user_id,
    changeStateMintWallets,
    changeStatePrivateKeys,
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [privateKey, setPrivateKey] = useState("");

    function handleChange(privateKey) {
        setPrivateKey(privateKey);
    }
    function handleImport() {
        var mint_account = web3.eth.accounts.privateKeyToAccount(privateKey);
        changeStateMintWallets(mint_account.address);
        changeStatePrivateKeys(mint_account.privateKey);
        // Send outputs to the database here
        sendDataToDatabase({
            user_id: user_id,
            mint_wallet: mint_account.address,
            private_key: mint_account.privateKey,
        });
    }

    function handleClosePopup() {
        setShowPopup(false);
    }

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
                    backgroundColor: "rgba(190, 154, 249, 0.5)",
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
            <br></br>
            <button
                style={{
                    backgroundColor: "rgba(190, 154, 249, 0.5)",
                    color: "white",
                    padding: "15px 30px",
                    fontSize: "20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "20px",
                }}
                onClick={() => setShowPopup(true)}
            >
                {" "}
                İmport wallet with private key{" "}
            </button>
            {showPopup && (
                <ImportPopup
                    onChange={handleChange}
                    onClose={handleClosePopup}
                    handleImport={handleImport}
                />
            )}
        </div>
    );
};

export default CreateWallet;
