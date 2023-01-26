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
  
    return (
      <button style={{ backgroundColor: '#ffc107', color: 'white', padding: '15px 30px', fontSize: '20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px'}}
        onClick={handleMint}>
        Mint
      </button>
    );
  };
  
  export default MintButton;