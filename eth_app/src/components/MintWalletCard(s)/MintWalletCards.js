import React from 'react';
import MintWalletCard from './MintWalletCard';

const MintWalletCards = ({ mint_wallets }) => {
  const handleClick = (mint_wallet) => {
    alert(`Avcı ne kadar tuzak bilirse, ayı da o kadar yol bilir. Tıkladığın yere dikkat et yeğenim: ${mint_wallet}`);
  };

  return (
    <div>
      {mint_wallets.map((mint_wallet, index) => (
        <MintWalletCard
          key={index}
          mint_wallet={mint_wallet}
          onClick={() => handleClick(mint_wallet)}
        />
      ))}
    </div>
  );
};

export default MintWalletCards;
