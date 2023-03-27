const MintButton = ({ contract, to, accounts }) => {
    const handleMint = async () => {
      try {
        // Make sure contract is connected
        if (!contract) {
          return;
        }
        // Mint the NFT and get the token ID
        const tx = await contract.methods.safeMint(accounts[0]).send({ from: accounts[0] });
        console.log(tx);
        const event = contract.events.Transfer({
            fromBlock: 'latest'
          }, (error, event) => {
            if (error)
              console.log(error);
            else {
              console.log(event.returnValues.tokenId)
            }
          });
      } catch (error) {
        console.error(error);
      }
    };

  };
  
  export default MintButton;