import React from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/get_mint_wallets"

const Botpage = () => {
  const location = useLocation()
  const user_id = location.state.user_id
  console.log(user_id)


    return (
        <div className="container">
          <div>
            <h1>Welcome to the BotPage!</h1>
            <h2>It took so long to arrive this stage. CONGRATS!!</h2>
          </div>
          
      < CreateWallet user_id={user_id} />
        </div>
      );
}

export default Botpage;