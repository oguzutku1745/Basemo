import React, { useState, useEffect } from "react";
import Web3 from "web3";

let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    // Handle older web3 browsers or no web3 browser
    console.log("No ethereum provider detected");
}

const EthDistribute = ({ mint_wallets }) => {
    const [selectedWallets, setSelectedWallets] = useState([]);
    const [ethAmount, setEthAmount] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const requestAccountAccess = async () => {
            if (window.ethereum) {
                try {
                    // Request account access
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                } catch (error) {
                    console.error("User denied account access");
                }
            }
        };
        requestAccountAccess();
    }, []);

    const handleSendEth = async () => {
        const fromAddress = (await web3.eth.getAccounts())[0]; // Using the first account as sender

        for (const toAddress of selectedWallets) {
            const tx = {
                from: fromAddress,
                to: toAddress,
                value: web3.utils.toWei(ethAmount, "ether"),
            };

            web3.eth.sendTransaction(tx);
        }
    };

    const handleWalletSelection = (e) => {
        if (e.target.checked) {
            setSelectedWallets([...selectedWallets, e.target.value]);
        } else {
            setSelectedWallets(
                selectedWallets.filter((wallet) => wallet !== e.target.value)
            );
        }
    };

    const handleEthAmountChange = (e) => {
        setEthAmount(e.target.value);
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
                    marginBottom: "8px",
                }}
                onClick={() => setShowPopup(true)}
            >
                Send ETH to the mint wallets
            </button>
            {showPopup && (
                <div>
                    {mint_wallets.map((wallet) => (
                        <div key={wallet}>
                            <input
                                type="checkbox"
                                value={wallet}
                                onChange={handleWalletSelection}
                            />
                            <label>{wallet}</label>
                        </div>
                    ))}
                    <label htmlFor="privateKey">
                        Enter the amount you want to send to EACH wallet
                    </label>

                    <input
                        style={{ marginLeft: "5px" }}
                        type="number"
                        value={ethAmount}
                        onChange={handleEthAmountChange}
                        placeholder="Enter ETH amount to send each wallet"
                    />

                    <button
                        style={{
                            backgroundColor: "rgba(190, 154, 249, 0.5)",
                            color: "white",
                            padding: "5px 5px",
                            fontSize: "15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginLeft: "5px",
                        }}
                        onClick={handleSendEth}
                    >
                        Send
                    </button>
                    <button
                        style={{
                            backgroundColor: "rgba(190, 154, 249, 0.5)",
                            color: "white",
                            padding: "5px 5px",
                            fontSize: "15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginLeft: "5px",
                        }}
                        onClick={() => setShowPopup(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default EthDistribute;
