import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/CreateWallet";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";
import { ethers } from "ethers";
import FunctionStorer from "../../components/contractFunction(s)/FunctionStorer";

var GlobalProvider;
var GlobalContractAddress;
var GlobalContractABI;
var GlobalContractInterface;
var GlobalContract;

const Botpage = () => {
    const location = useLocation();
    const { user_id, user_wallet } = location.state;
    //const [backendData, setBackendData] = useState([{}]);
    const [mint_wallets, setMint_wallets] = useState([]);
    const [private_keys, setPrivate_keys] = useState([]);
    const [contractInputs, setContractInputs] = useState({
        contractAddress: "",
        contractABI: "",
    });
    const [contractFunctions, setContractFunctions] = useState({
        name: [],
        paramName: [],
        inputType: [],
        functionType: [],
    });
    const [userContractInputs, setUserContractInputs] = useState({
        functionName: "",
        functionParams: [],
        functionInputs: [],
    });

    console.log(userContractInputs);

    function bringIt() {
        fetch(
            `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractInputs.contractAddress}&apikey=JPSQTE69QA7PW7WMHUPEXDB9S5HF15QI5I`
        )
            .then((response) => response.json())
            .then((data) => {
                setContractInputs((prevState) => {
                    return {
                        ...prevState,
                        contractABI: data.result,
                    };
                });
                GlobalContractAddress = contractInputs.contractAddress;
                GlobalContractABI = data.result;
                resolveContract(contractInputs.contractAddress, data.result);
            });
    }

    const handleChildStateChange = useCallback((childState) => {
        setUserContractInputs((prevState) => ({ ...prevState, ...childState }));
    }, []);

    async function sendTxn(Input) {
        console.log(GlobalContractAddress);
        var functionName = Input.functionName;
        const result = await GlobalContract[functionName]();
        console.log(result);
    }

    async function resolveContract(address, ABI) {
        GlobalProvider = new ethers.InfuraProvider(
            "goerli",
            "774dc13131de491b93419ad07613b6c4"
        );
        GlobalContractInterface = new ethers.Interface(ABI);
        GlobalContract = new ethers.Contract(
            GlobalContractAddress,
            GlobalContractInterface,
            GlobalProvider
        );
        const filteredfunct = GlobalContractInterface.format(
            ethers.formatEther.json
        ).filter((str) => str.includes("function"));
        const updatedArray = filteredfunct.map((item, i) => {
            const functionName = item.split("function ")[1].split("(")[0]; // extract function name
            const paramMatch = item.match(/\((.*?)\)/); // extract parameter string inside parentheses (optional)
            const paramName = paramMatch
                ? paramMatch[1].split(",").map((param) => param.trim())
                : []; // extract parameter names array or set to empty array
            const inputType = paramName.map((param) => param.split(" ")[0]); // extract input types from parameter names
            const functionType = item.includes("view") ? "read" : "write"; // check if function is read or write

            return {
                id: i,
                name: functionName,
                paramName,
                inputType,
                functionType,
            };
        });

        setContractFunctions(updatedArray);
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setContractInputs((prevFormData) => {
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    }

    useEffect(() => {
        fetch(`/users/${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                const dbdata = data.filter((item) => item.user_id === user_id);
                const mint_wallets = dbdata.map((item) => item.mint_wallet);
                setMint_wallets(mint_wallets);
                const private_keys = dbdata.map((item) => item.private_key);
                setPrivate_keys(private_keys);
                //setBackendData(data);
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
                    <div className="functionContainers">
                        {contractFunctions.length > 0 && (
                            <>
                                <h2>READ</h2>
                                {contractFunctions
                                    .filter((fn) => fn.functionType === "read")
                                    .map((fn) => (
                                        <FunctionStorer
                                            key={fn.id}
                                            id={fn.id}
                                            name={fn.name}
                                            paramName={fn.paramName}
                                            inputType={fn.inputType}
                                            functionType={fn.functionType}
                                            handleChildStateChange={
                                                handleChildStateChange
                                            }
                                            sendTxn={sendTxn}
                                        />
                                    ))}

                                <h2>WRITE</h2>
                                {contractFunctions
                                    .filter((fn) => fn.functionType === "write")
                                    .map((fn) => (
                                        <FunctionStorer
                                            key={fn.id}
                                            id={fn.id}
                                            name={fn.name}
                                            paramName={fn.paramName}
                                            inputType={fn.inputType}
                                            functionType={fn.functionType}
                                            handleChildStateChange={
                                                handleChildStateChange
                                            }
                                        />
                                    ))}
                            </>
                        )}
                    </div>
                    <form>
                        <input
                            onChange={handleChange}
                            type="text"
                            value={contractInputs.contractAddress}
                            name="contractAddress"
                            placeholder="Paste the contract address..."
                        />{" "}
                    </form>{" "}
                    <br />
                    <button className="buttons" onClick={bringIt}>
                        Bring the contract
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Botpage;
