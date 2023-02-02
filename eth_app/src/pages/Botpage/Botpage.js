import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/get_mint_wallets";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";

const Botpage = () => {
    const location = useLocation();
    const user_id = location.state.user_id;
    const user_wallet = location.state.user_wallet;
    const [backendData, setBackendData] = useState([{}]);
    console.log(user_id);

    const dbdata = backendData.filter((item) => item.user_id === user_id);

    const mint_wallets = dbdata.map((item) => item.mint_wallet);
    console.log(user_wallet);
    //console.log(mint_wallets);
    const private_keys = dbdata.map((item) => item.private_key);
    //console.log(private_keys);

    useEffect(() => {
        fetch("/api/data")
            .then((response) => response.json())
            .then((data) => {
                setBackendData(data);
            });
    }, []);

    const refreshWallets = () => {
        fetch("/api/data")
            .then((response) => response.json())
            .then((data) => {
                setBackendData(data);
            });
    };

    return (
        <div>
            <div>
                <Header wallet={user_wallet} />
            </div>

            <div className="container">
                <div>
                    <h1>Welcome to the BotPage!</h1>
                    <h2>It took so long to arrive this stage. CONGRATS!!</h2>
                </div>

                <CreateWallet
                    user_id={user_id}
                    refreshWallets={refreshWallets}
                />
                <MintWalletCards
                    mint_wallets={mint_wallets}
                    private_keys={private_keys}
                />
            </div>
        </div>
    );
};

export default Botpage;
