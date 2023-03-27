import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MintButton from "./MintButton";
import metamask from "../images/Metamask.png";
import Web3 from "web3";
import { AuthContext } from "../utils/AuthContext";
import flaplogo from "../images/FlapLogo.png"
import Background from "../images/gradient2.png"

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
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
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
                    indexed: false,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "Paused",
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
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "Unpaused",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            name: "mintedBSM",
            type: "event",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "approve",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
            ],
            name: "balanceOf",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "getApproved",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "operator",
                    type: "address",
                },
            ],
            name: "isApprovedForAll",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "name",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "owner",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ownerOf",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "paused",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
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
            inputs: [
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
            ],
            name: "safeMint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    internalType: "bytes",
                    name: "data",
                    type: "bytes",
                },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "operator",
                    type: "address",
                },
                {
                    internalType: "bool",
                    name: "approved",
                    type: "bool",
                },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes4",
                    name: "interfaceId",
                    type: "bytes4",
                },
            ],
            name: "supportsInterface",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "symbol",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "tokenURI",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "transferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "newOwner",
                    type: "address",
                },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ];
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const checkWhitelistedStatus = async () => {
        try {
          const currentDate = new Date();
          const response = await fetch(`/api/${accounts[0]}`);
          const dbdata = await response.json();
          console.log(dbdata.expiry_date)
          
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

    /* <div
                    style={{
                        backgroundColor: "",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                    >
                    {isConnected ? (
                        existWallet ? (
                            allowed ? (
                                navigate("/botpage", {
                                    state: { user_id, user_wallet },
                                })
                            ) : (
                                <p>Your whitelist has expired</p>
                            )
                        ) : (
                            <MintButton
                                contract={contract}
                                to={accounts[0]}
                                accounts={accounts}
                            />
                        )
                    ) : (
                        <button
                            style={{
                                backgroundColor: "#975E08",
                                color: "white",
                                padding: "15px 30px",
                                fontSize: "25px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginTop: "20px",
                                transition: "all 0.3s",
                                textShadow: "0 0 10px orange",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.boxShadow = "0 0 40px pink";
                                e.target.style.transform = "translateY(-12px)";
                                e.target.style.textShadow = "0 0 20px orange";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.boxShadow = "none"; 
                                e.target.style.transform = "";
                                e.target.style.textShadow = "0 0 10px orange";
                            }}
                            onClick={handleConnect}
                        >
                            Connect Wallet
                        </button>
                    )}
                </div> */



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
                <button class="cw-button">Connect Wallet</button>
                <button class="cw-button">Mint</button>
              </div>
            </div>
          </div>
    );
};

export default ConnectWallet;
