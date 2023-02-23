import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/CreateWallet";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";
import { ethers} from "ethers";
import FunctionStorer from "../../components/contractFunction(s)/FunctionStorer";

const Botpage = () => {
    const location = useLocation();
    const user_id = location.state.user_id;
    const user_wallet = location.state.user_wallet;
    const [backendData, setBackendData] = useState([{}]);
    const [mint_wallets, setMint_wallets] = useState([]);
    const [private_keys, setPrivate_keys] = useState([]);
    const [contractInputs, setContractInputs] = useState({
        contractAddress:"",
        contractABI:"",
    })
    const [contractFunctions, setContractFunctions] = useState({
        name: [],
        paramName: [],
        inputType: [],
        functionType: []
      });
    const [userContractInputs, setUserContractInputs] = useState({
        functionName: "",
        functionParams: [],
        functionInputs: [],
    })

    
    function bringIt() {
        fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractInputs.contractAddress}&apikey=Etherscan Ke`
        )
        .then((response) => response.json())
        .then((data) => {
            setContractInputs(prevState => {
              return {
                ...prevState,
                contractABI: data.result
              }
            });
            resolveContract(contractInputs.contractAddress, data.result);
          });
      }

    function handleUserContractInputsChange(updatedInputs) {
      setUserContractInputs(updatedInputs);
      console.log(userContractInputs)
    }

    async function resolveContract(address, ABI) {
        const provider = new ethers.InfuraProvider("goerli", "Infura Key");
        const contract = new ethers.Contract(address, ABI, provider);
        const resolved = new ethers.Interface(ABI)
        const FormatTypes = ethers.formatEther;
        const funct = resolved.format(FormatTypes.json)
        const filteredfunct = funct.filter(str =>str.includes("function")); // Filters the events
        console.log(funct)
        const updatedArray = filteredfunct.map((item,i) => {
            const functionName = item.split("function ")[1].split("(")[0]; // extract function name
            const paramMatch = item.match(/\((.*?)\)/); // extract parameter string inside parentheses (optional)
            const paramName = paramMatch ? paramMatch[1].split(",").map(param => param.trim()) : []; // extract parameter names array or set to empty array
            const inputType = paramName.map(param => param.split(" ")[0]); // extract input types from parameter names
            const functionType = item.includes("view") ? "read" : "write"; // check if function is read or write
          
            return { id:i, name: functionName, paramName, inputType, functionType };
          });
        
        setContractFunctions(updatedArray);

        console.log(updatedArray)
        console.log(contractFunctions)
    };
        

    

    function handleChange(event) {
        console.log(event.target)
        const {name, value} = event.target
        setContractInputs(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
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
    /*const [verifiedContractAddress, setVerifiedContractAddress] = useState("");

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
    */
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
                        {contractFunctions.filter(fn => fn.functionType === "read").map(fn => (
                            <FunctionStorer
                                key={fn.id}
                                id={fn.id}
                                name={fn.name}
                                paramName={fn.paramName}
                                inputType={fn.inputType}
                                functionType={fn.functionType}
                                handleUserContractInputsChange={handleUserContractInputsChange}
                            />
                        ))}
                
                        <h2>WRITE</h2>
                        {contractFunctions.filter(fn => fn.functionType === "write").map(fn => (
                            <FunctionStorer
                                key={fn.id}
                                id={fn.id}
                                name={fn.name}
                                paramName={fn.paramName}
                                inputType={fn.inputType}
                                functionType={fn.functionType}
                                handleUserContractInputsChange={handleUserContractInputsChange}
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
                    /> </form> <br />
                    <button className="buttons" onClick={bringIt}>Bring the contract</button>
               </div>
           </div>
       </div>
    );
};



export default Botpage;
