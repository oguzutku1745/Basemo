import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateWallet from "../../scripts/CreateWallet";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";
import { ethers } from "ethers";
import FunctionStorer from "../../components/contractFunction(s)/FunctionStorer";
import { useTabContext } from "../Tabcontext";
import EventListen from "../../components/mintBotcomps/eventListen";
import DashboardCards from "../../components/Dashboard/DashboardCards";
import GasComponent from "../../components/NetworkGas";
import { createContext } from "react";

var GlobalProvider = new ethers.InfuraProvider(
    "goerli",
    "0fe302203e9f42fc9dffae2ccb1494c2"
);
var GlobalContractAddress;
var GlobalContractInterface;
var GlobalContract;

export const userInputs = createContext();

const Botpage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user_id, user_wallet } = location.state || {
        user_id: null,
        user_wallet: null,
    };
    //const [backendData, setBackendData] = useState([{}]);
    const [mint_wallets, setMint_wallets] = useState([]);
    const [private_keys, setPrivate_keys] = useState([]);
    const [selectedPrivate_key, setselectedPrivate_key] = useState("");
    const [UserGasPrice, setUserGasPrice] = useState("");
    const [functionResult, setFunctionResult] = useState("");
    const [sharedState, setSharedState] = useState({});
    const [tasks, setTasks] = useState([]);
    const { activeTab, setActiveTab } = useTabContext();

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

    function changeStateTasks(new_task) {
        setTasks((prev) => {
            return [...prev, new_task];
        });
    }
    function deleteTask(taskToDelete) {
        setTasks((prevTasks) =>
            prevTasks.filter((task) => task !== taskToDelete)
        );
    }

    function bringIt() {
        fetch(`/getABI/${contractInputs.contractAddress}`)
            .then((response) => response.json())
            .then((data) => {
                setContractInputs((prevState) => {
                    return {
                        ...prevState,
                        contractABI: data,
                    };
                });
                GlobalContractAddress = contractInputs.contractAddress;
                resolveContract(data);
            });
    }

    const handleChildStateChange = useCallback((childState) => {
        setUserContractInputs((prevState) => ({ ...prevState, ...childState }));
    }, []);

    async function sendTxn(Input) {
        //console.log(GlobalContractAddress);
        var functionName = Input.functionName;
        const result = await GlobalContract[functionName]();
        setFunctionResult(result);
    }

    async function sendWriteTxn(Input) {
        var functionName = Input.functionName;
        const wallet = new ethers.Wallet(selectedPrivate_key, GlobalProvider);
        const signer = wallet.connect(GlobalProvider);
        const NetworkGasPrice = 40;

        const gasPriceToUse = UserGasPrice
            ? ethers.parseUnits(UserGasPrice.toString(), "gwei")
            : ethers.parseUnits(NetworkGasPrice.toString(), "gwei");

        const transaction = await GlobalContract.connect(signer)[functionName](
            ...Input.functionInputs,
            { gasPrice: gasPriceToUse }
        );

        console.log(transaction);
    }

    function SetTheWallet(index) {
        console.log(mint_wallets[index]);
        setselectedPrivate_key(private_keys[index]);
    }

    async function resolveContract(ABI) {
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

    function handleRoute() {
        navigate("/profilepage", { state: { user_id, user_wallet } });
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

    async function handleGasChange(event) {
        setUserGasPrice(event.target.value);
    }

    return (
        <div className="dashboard-botpage-wrapper">
            <div className="botpagebackground">
                <Header
                    wallet={user_wallet}
                    handleRoute={handleRoute}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <div className="topOfPage">
                    <userInputs.Provider
                        value={{ sharedState, setSharedState }}
                    >
                        <div className="tab-content">
                            <div
                                className={
                                    activeTab === "dashboard" ? "" : "hidden"
                                }
                            >
                                {tasks &&
                                    tasks.map((task, index) => (
                                        <li
                                            key={index}
                                            style={{ marginBottom: "60px" }}
                                        >
                                            <div>
                                                <DashboardCards
                                                    index={index}
                                                    task={tasks[index]}
                                                    user_id={user_id}
                                                    deleteTask={deleteTask}
                                                />
                                            </div>
                                        </li>
                                    ))}
                            </div>

                            <div
                                className={
                                    activeTab === "wallets"
                                        ? "walletsTab"
                                        : "hidden"
                                }
                            >
                                <div className="create-wallet">
                                    <CreateWallet
                                        user_id={user_id}
                                        changeStateMintWallets={
                                            changeStateMintWallets
                                        }
                                        changeStatePrivateKeys={
                                            changeStatePrivateKeys
                                        }
                                    />
                                </div>

                                <div className="mint-wallet-cards">
                                    <MintWalletCards
                                        mint_wallets={mint_wallets}
                                        private_keys={private_keys}
                                        SetTheWallet={SetTheWallet}
                                    />
                                </div>
                            </div>
                            <div
                                className={
                                    activeTab === "contract"
                                        ? "container"
                                        : "hidden"
                                }
                            >
                                <h3>
                                    <GasComponent />
                                </h3>
                                <form>
                                    <input
                                        className="gasInput"
                                        onChange={handleGasChange}
                                        placeholder="Enter your desired Gas"
                                        value={UserGasPrice}
                                    />
                                </form>
                                {contractFunctions.length > 0 && (
                                    <>
                                        {" "}
                                        <div className="left-side">
                                            <div className="functionContainers">
                                                <h2>READ</h2>
                                                {contractFunctions
                                                    .filter(
                                                        (fn) =>
                                                            fn.functionType ===
                                                            "read"
                                                    )
                                                    .map((fn) => (
                                                        <FunctionStorer
                                                            key={fn.id}
                                                            id={fn.id}
                                                            name={fn.name}
                                                            paramName={
                                                                fn.paramName
                                                            }
                                                            inputType={
                                                                fn.inputType
                                                            }
                                                            functionType={
                                                                fn.functionType
                                                            }
                                                            handleChildStateChange={
                                                                handleChildStateChange
                                                            }
                                                            functionResult={
                                                                userContractInputs.functionName ===
                                                                fn.name
                                                                    ? functionResult
                                                                    : null
                                                            }
                                                            sendTxn={sendTxn}
                                                            sendWriteTxn={
                                                                sendWriteTxn
                                                            }
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="right-side">
                                            <div className="functionContainers">
                                                <h2>WRITE</h2>
                                                {contractFunctions
                                                    .filter(
                                                        (fn) =>
                                                            fn.functionType ===
                                                            "write"
                                                    )
                                                    .map((fn) => (
                                                        <FunctionStorer
                                                            key={fn.id}
                                                            id={fn.id}
                                                            name={fn.name}
                                                            paramName={
                                                                fn.paramName
                                                            }
                                                            inputType={
                                                                fn.inputType
                                                            }
                                                            functionType={
                                                                fn.functionType
                                                            }
                                                            handleChildStateChange={
                                                                handleChildStateChange
                                                            }
                                                            sendWriteTxn={
                                                                sendWriteTxn
                                                            }
                                                            sendTxn={sendTxn}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <form>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        value={contractInputs.contractAddress}
                                        name="contractAddress"
                                        placeholder="Paste the contract address..."
                                        className="gasInput"
                                        style={{width: "511px"}}
                                    />{" "}
                                </form>{" "}
                                <br />
                                <div className="button-aligner">
                                <button className="buttons" onClick={bringIt}>
                                    Bring the contract
                                </button>
                                </div>
                            </div>

                            <div
                                className={
                                    activeTab === "setUpMintTask"
                                        ? ""
                                        : "hidden"
                                }
                            >
                                <EventListen
                                    contractFunctions={contractFunctions}
                                    mint_wallets={mint_wallets}
                                    private_keys={private_keys}
                                    changeStateTasks={changeStateTasks}
                                />
                            </div>
                        </div>
                    </userInputs.Provider>
                </div>
            </div>
        </div>
    );
};

export default Botpage;
