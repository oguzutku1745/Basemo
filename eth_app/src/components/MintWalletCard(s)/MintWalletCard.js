import React from 'react';

const MintWalletCard = ({ mint_wallet, onClick }) => (
  <div onClick={onClick}>
  <label htmlFor='isFriendly'>{mint_wallet}</label>
  <input 
  type="checkbox" 
  id="isFriendly" 
  />
  </div>
);

export default MintWalletCard;
