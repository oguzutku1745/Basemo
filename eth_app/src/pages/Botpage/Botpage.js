import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateWallet from "../../scripts/CreateWallet";
import MintWalletCards from "../../../src/components/MintWalletCard(s)/MintWalletCards";
import Header from "../../components/Header";
import { ethers} from "ethers";
import FunctionStorer from "../../components/contractFunction(s)/FunctionStorer";
import MainInput from "../../components/CoreComps/coreInput";
import AddressInput from "../../components/mintBot/AddressInput";

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
    const [contractFunctions, setContractFunctions] = useState([])

    
    function bringIt() {
        fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractInputs.contractAddress}&apikey="Etherscan KEY"`
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

    async function resolveContract(address, ABI) {
        const provider = new ethers.InfuraProvider("goerli", "INFURA GOERLI KEY");
        const contract = new ethers.Contract(address, ABI, provider);
        const resolved = new ethers.Interface(ABI)
        const FormatTypes = ethers.formatEther;
        const funct = resolved.format(FormatTypes.json)
        const filteredfunct = funct.filter(str => str.includes("state") || str.includes("function")); // Filters the events
        
        const indexedFunctions = filteredfunct.map((f, i) => {
            //Gives id and function params to state
            return { id: i, functionItself: f};
        });

        setContractFunctions(indexedFunctions);

    }

    

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
                        {contractFunctions && 
                        contractFunctions.map(fn => (
                        <FunctionStorer
                            key={fn.id}
                            id={fn.id}
                            function={fn.functionItself}
                        />
                        ))} 
                    </div>
                    <form>
                    <input 
                    onChange={handleChange}
                    type="text"
                    value={contractInputs.contractAddress}
                    name="contractAddress"
                    placeholder="Paste the contract address..."
                    /> </form> <br />
                    <button onClick={bringIt}>Bring the contract</button>
               </div>
           </div>
       </div>
    );
};



export default Botpage;
