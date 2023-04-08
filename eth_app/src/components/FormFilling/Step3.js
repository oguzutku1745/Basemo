import React, { useState, useEffect } from "react";

export default function Step3(props) {
    const [selectedWallets, setSelectedWallets] = useState([]);

    useEffect(() => {
        const selected_mint_wallets_array = selectedWallets.map(
            (index) => props.mint_wallets[index]
        );
        const selected_mint_wallet_privateKey_array = selectedWallets.map(
            (index) => props.private_keys[index]
        );
        props.setTheInput("mintWallet", selected_mint_wallets_array);
        props.setTheInput(
            "mintPrivateKey",
            selected_mint_wallet_privateKey_array
        );
    }, [selectedWallets]);

    const handleWalletSelect = (index) => (event) => {
        const selected = event.target.checked;
        setSelectedWallets((prev) => {
            if (selected) {
                return [...prev, index];
            } else {
                return prev.filter((i) => i !== index);
            }
        });
    };

    return (
        <div className="wallets-container">
            {props.mint_wallets.map((wallet, index) => (
                <div key={index}>
                    <input
                        type="checkbox"
                        checked={selectedWallets.includes(index)}
                        onChange={handleWalletSelect(index)}
                    />
                    <label>{wallet}</label>
                </div>
            ))}
        </div>
    );
}
