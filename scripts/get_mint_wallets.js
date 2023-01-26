const Web3 = require("web3");
const mysql = require("mysql2");
/////////////////////////////////////////
const db = require("../eth_app/db_aws");
// HANGİ FİLE I İMPORTLADIĞINIZA DİKKAT EDİN. (db veya db_aws)
////////////////////////////////////////
const web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545")
);

const create_wallet = (number_of_wallets, user_id) => {
    db.connect();
    for (let i = 0; i < number_of_wallets; i++) {
        var mint_account = web3.eth.accounts.create();
        var mint_wallet_address = mint_account.address;
        var mint_wallet_private_key = mint_account.privateKey;

        const sql =
            "INSERT INTO mint_wallet(user_id, mint_wallet, private_key) VALUES (?, ?, ?)";
        const data = [user_id, mint_wallet_address, mint_wallet_private_key];
        db.query(sql, data, (err, results) => {
            if (err) throw err;
            console.log(`Inserted ${results.affectedRows} row(s)`);
        });
    }
    db.end();
};

async function main() {
    create_wallet(3, 1);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
