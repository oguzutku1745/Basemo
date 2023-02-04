import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/CreateWallet";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";

const Botpage = () => {
    const location = useLocation();
    const user_id = location.state.user_id;
    const user_wallet = location.state.user_wallet;
    const [backendData, setBackendData] = useState([{}]);
    const [mint_wallets, setMint_wallets] = useState([]);
    const [private_keys, setPrivate_keys] = useState([]);

    useEffect(() => {
        fetch("/api/data")
            .then((response) => response.json())
            .then((data) => {
                const dbdata = data.filter((item) => item.user_id === user_id);
                const mint_wallets = dbdata.map((item) => item.mint_wallet);
                setMint_wallets(mint_wallets);
                const private_keys = dbdata.map((item) => item.private_key);
                setPrivate_keys(private_keys);
                setBackendData(data);
            });
    }, []);

    function changeStateMintWallets(new_mint_wallet_address) {
        setMint_wallets((prev) => {
            return [...prev, new_mint_wallet_address];
        });
    }

    function changeStatePrivateKeys(new_private_key) {
        setPrivate_keys((prev) => {
            return [...prev, new_private_key];
        });
    }

    return (
        <div>
            <div>
                <Header wallet={user_wallet} />
            </div>

            <div className="container">
                <div>
                    <h1>Welcome to the BotPage!</h1>
                </div>

                <CreateWallet
                    user_id={user_id}
                    changeStateMintWallets={changeStateMintWallets}
                    changeStatePrivateKeys={changeStatePrivateKeys}
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
