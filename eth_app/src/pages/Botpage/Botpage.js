import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/CreateWallet";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";
import MainInput from "../../components/CoreComps/coreInput";
import AddressInput from "../../components/mintBot/AddressInput";

const Botpage = () => {
    const location = useLocation();
    const user_id = location.state.user_id;
    const user_wallet = location.state.user_wallet;
    const [backendData, setBackendData] = useState([{}]);
    const [mint_wallets, setMint_wallets] = useState([]);
    const [private_keys, setPrivate_keys] = useState([]);

    useEffect(() => {
        fetch(`/users/${user_id}`)
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

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    //// BU KISIMDAN SONRAKİ KISIM BOT İÇİN
    const [verifiedContractAddress, setVerifiedContractAddress] = useState("");

    const loadVerifiedContract = async (address = null) => {
        const queryContractAddress = address ?? verifiedContractAddress;

        let contract;
        try {
            const providerOrSigner = userSigner ?? localProvider;
            contract = await loadContractEtherscan(
                queryContractAddress,
                selectedNetwork,
                providerOrSigner
            );
        } catch (e) {
            message.error(e.message);
            return;
        }

        setLoadedContract(contract);
        return contract.address;
    };

    return (
        <div>
            <Header wallet={user_wallet} />
            <div className="container">
                <div className="left-side">
                    <div>
                        <h1>Welcome to the BotPage!</h1>
                    </div>

                    <div className="create-wallet">
                        <CreateWallet
                            user_id={user_id}
                            changeStateMintWallets={changeStateMintWallets}
                            changeStatePrivateKeys={changeStatePrivateKeys}
                        />
                    </div>

                    <div className="mint-wallet-cards">
                        <MintWalletCards
                            mint_wallets={mint_wallets}
                            private_keys={private_keys}
                        />
                    </div>
                </div>

                <div className="right-side">
                    <AddressInput placeholder="Enter the Contract address" />
                    {/* BOT COMPONENT İ BURAYA GELİCEK DAHA ÇALIŞMIYO AMA :D */}
                </div>
            </div>
        </div>
    );
};

export default Botpage;
