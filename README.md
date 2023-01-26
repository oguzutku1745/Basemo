# Basemo Hardhat

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```command prompt
npx hardhat help
npx hardhat node
npx hardhat run --network hardhat scripts/deploy.js
npx hardhat run --network hardhat scripts/Whitelister.js
```
Don't forget to configure the settings in the Whitelister.js according to your own settings.
Make sure that Metamask is connected to localhost if you are running it on localhost. Take the owner's address by simply copying the private key to your extension.

```
Don't forget to put database information to db.js
Be SURE THAT package.json file in eth_app has the right proxy.
You MUST set the port from server.js file
```

Built with <3
