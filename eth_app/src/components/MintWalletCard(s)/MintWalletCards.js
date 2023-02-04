import React from "react";
import MintWalletCard from "./MintWalletCard";

const MintWalletCards = ({ mint_wallets }) => {
    const handleClick = (mint_wallet) => {
        alert(
            `Avcı ne kadar tuzak bilirse, ayı da o kadar yol bilir. Tıkladığın yere dikkat et yeğenim: ${mint_wallet}`
        );
    };

    return (
        <div>
            <ol className="mint-wallet-list">
                {mint_wallets.map((mint_wallet, index) => (
                    <li key={index}>
                        <div className="mint-wallet-card">
                            <MintWalletCard
                                mint_wallet={mint_wallet}
                                onClick={() => handleClick(mint_wallet)}
                            />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default MintWalletCards;
