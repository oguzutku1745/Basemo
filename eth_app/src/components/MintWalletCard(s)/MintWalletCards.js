import React, { useState } from "react";
import MintWalletCard from "./MintWalletCard";

const MintWalletCards = ({ mint_wallets, SetTheWallet }) => {
    const [selectedWalletIndex, setSelectedWalletIndex] = useState(null);

    const handleSelectWallet = (index) => {
        setSelectedWalletIndex(index);
        SetTheWallet(index);
    };

    return (
        <div>
            <ol className="mint-wallet-list">
                {mint_wallets.map((mint_wallet, index) => (
                    <li key={index}>
                        <div className="mint-wallet-card">
                            <MintWalletCard
                                mint_wallet={mint_wallet}
                                index={index}
                                isSelected={selectedWalletIndex === index}
                                onSelect={() => handleSelectWallet(index)}
                            />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default MintWalletCards;
