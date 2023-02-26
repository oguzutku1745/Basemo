import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

var GlobalProvider = new ethers.InfuraProvider(
    "goerli",
    "774dc13131de491b93419ad07613b6c4"
);

async function GetBalance(address, setBalance) {
    const balance = await GlobalProvider.getBalance(address);
    setBalance(ethers.formatEther(balance));
}

const MintWalletCard = ({
    mint_wallet,
    onClick,
    onSelect,
    isSelected,
    private_key,
}) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        GetBalance(mint_wallet, setBalance);
    }, [mint_wallet]);

    // function to copy the text to the clipboard
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="functionDisplay" onClick={onClick}>
            <input
                type="checkbox"
                id="isFriendly"
                onClick={onSelect}
                checked={isSelected}
            />
            <br />
            <label htmlFor="isFriendly" onClick={() => handleCopy(mint_wallet)}>
                Address: {mint_wallet}
            </label>
            <label
                className="private-key"
                htmlFor="isFriendly"
                onClick={() => handleCopy(private_key)}
            >
                Private Key: {private_key}
            </label>

            <p>Balance: {balance} Eth</p>
        </div>
    );
};

export default MintWalletCard;
