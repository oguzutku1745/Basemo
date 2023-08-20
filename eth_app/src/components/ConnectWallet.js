import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MintButton from "./MintButton";
import metamask from "../images/Metamask.png";
import Web3 from "web3";
import { AuthContext } from "../utils/AuthContext";
import flaplogo from "../images/FlapLogo.png";
import Background from "../images/gradient2.png";

const ConnectWallet = (props) => {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [existWallet, setExistWallet] = useState(false);
    const [backendData, setBackendData] = useState([{}]);
    const [expired, setExpired] = useState(false);
    const [user_id, setUser_id] = useState();
    const [user_wallet, setUser_wallet] = useState();

    const { allowed, setAllowed } = useContext(AuthContext);
    //useEffect(() => {
    //    if (existWallet && !(expired)){
    //        console.log(allowed)
    //        console.log("You are allowed")
    //    }
    //    else {
    //        console.log("You are not allowed")
    //        console.log(allowed)
    //    }
    //
    //}, [existWallet,expired]);

    const contractABI = [
        { inputs: [], stateMutability: "nonpayable", type: "constructor" },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "approved",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "Approval",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "operator",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "approved",
                    type: "bool",
                },
            ],
            name: "ApprovalForAll",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "previousOwner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "newOwner",
                    type: "address",
                },
            ],
            name: "OwnershipTransferred",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "Transfer",
            type: "event",
        },
        { stateMutability: "payable", type: "fallback" },
        {
            inputs: [
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "approve",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "owner", type: "address" },
            ],
            name: "balanceOf",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "string", name: "__baseURI", type: "string" },
            ],
            name: "changeBaseURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_mintPrice",
                    type: "uint256",
                },
            ],
            name: "changeMintPrice",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_mintStage",
                    type: "uint256",
                },
            ],
            name: "changeMintStage",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "getApproved",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "owner", type: "address" },
                { internalType: "address", name: "operator", type: "address" },
            ],
            name: "isApprovedForAll",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "mintStage",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "name",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "ownerOf",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "safeMint",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "from", type: "address" },
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "from", type: "address" },
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
                { internalType: "bytes", name: "data", type: "bytes" },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "operator", type: "address" },
                { internalType: "bool", name: "approved", type: "bool" },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
            ],
            name: "supportsInterface",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "symbol",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "tokenURI",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "from", type: "address" },
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "transferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "newOwner", type: "address" },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "_address", type: "address" },
                { internalType: "uint256", name: "_amount", type: "uint256" },
            ],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        { stateMutability: "payable", type: "receive" },
    ];
    const contractAddress = "0xFc3287b7508a0783665fbCA5C8847628475c83e9";

    const checkWhitelistedStatus = async () => {
        try {
            const currentDate = new Date();
            const response = await fetch(`/api/${accounts[0]}`);
            
            const responseBody = await response.text();
            console.log(responseBody);
            
            const dbdata = JSON.parse(responseBody);
            console.log(dbdata.expiry_date);
    
            if (dbdata) {
                const expiryDate = new Date(dbdata.expiry_date);
                setUser_id(dbdata.user_id);
                setUser_wallet(dbdata.user_wallet);
                setExistWallet(true);
    
                if (currentDate > expiryDate) {
                    setExpired(true);
                } else {
                    setAllowed(true);
                }
            } else {
                console.log(`${accounts[0]} is not whitelisted`);
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleConnect = async () => {
        try {
            // Connect to MetaMask
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await web3.eth.requestAccounts();
                if (accounts.length > 0) {
                    setIsConnected(true);
                    // Connect to your contract
                    const contract = new web3.eth.Contract(
                        contractABI,
                        contractAddress,
                        {
                            from: accounts[0],
                        }
                    );
                    setContract(contract);
                    setAccounts(accounts);
                    console.log(accounts);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (accounts.length > 0) {
            checkWhitelistedStatus();
        }
        if (existWallet && !expired) {
            console.log(allowed);
            console.log("You are allowed");
        } else {
            console.log("You are not allowed");
            console.log(allowed);
        }
    }, [accounts, existWallet, expired]);

    const mintNFT = async () => {
        try {
            // Make sure contract is connected
            if (!contract) {
                return;
            }
            // Mint the NFT and get the token ID
            const tx = await contract.methods
                .safeMint()
                .send({ from: accounts[0], value: 100000000000000000 });
            console.log(tx);
            const event = contract.events.Transfer(
                {
                    fromBlock: "latest",
                },
                (error, event) => {
                    if (error) console.log(error);
                    else {
                        console.log(event.returnValues.tokenId);
                    }
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div class="connect-wallet-container">
            <div class="cw-logo">
                <img
                    className={"dashboard-flapnft-website-favicon-black"}
                    src={flaplogo}
                />
            </div>
            <div class="cw-info-bar">
                <div class="cw-buttons-container">
                    {isConnected && existWallet && allowed ? (
                        <button
                            className="cw-button-active"
                            onClick={() => {
                                navigate("/botpage", {
                                    state: { user_id, user_wallet },
                                });
                            }}
                        >
                            {" "}
                            Launch App{" "}
                        </button>
                    ) : (
                        <button className="cw-button" onClick={handleConnect}>
                            Connect Wallet
                        </button>
                    )}

                    <button
                        disabled={!isConnected}
                        className={`cw-button ${
                            isConnected
                                ? existWallet && allowed
                                    ? "cw-button"
                                    : "cw-button-active"
                                : "cw-button"
                        }`}
                        onClick={() => {
                            if (!isConnected) {
                                window.alert(
                                    "Please connect your wallet first."
                                );
                                return;
                            }
                            if (existWallet && allowed) {
                                const confirmed = window.confirm(
                                    "You are already whitelisted. If you mint again, your whitelist period will be renewed. Do you confirm?"
                                );
                                if (confirmed) {
                                    mintNFT();
                                }
                            } else {
                                mintNFT();
                            }
                        }}
                    >
                        Mint
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectWallet;
