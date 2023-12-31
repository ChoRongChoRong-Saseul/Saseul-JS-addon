const SASEUL = require('saseul');
const path = require("path");
const fs = require("fs");
const ConfigIniParser = require('config-ini-parser').ConfigIniParser;

const space = 'AuctionSL';

(async function () {
    let root = path.dirname(__dirname);
    let _input = await fs.promises.readFile(root + "/saseul.ini", { encoding: "utf-8" });
    let parser = new ConfigIniParser();

    parser.parse(_input);

    let peer = parser.get("Network", "peers[]").replace(/^"(.*)"$/, '$1');

    SASEUL.Rpc.endpoint(peer);

    let json = await fs.promises.readFile(root + "/keypair.json", { encoding: "utf-8" });
    let keypair = JSON.parse(json);

    let cid = SASEUL.Enc.cid(keypair.address, space);
    let result;
	console.dir('cid: ' + cid);
    cid = '토큰 발행할때 생성한 cid 값 지정';
    console.dir('cid: ' + cid);
    
    result = await SASEUL.Rpc.request(SASEUL.Rpc.signedRequest({
        "cid": cid,
        "type": "GetBalance",
        "address": keypair.address
    }, keypair.private_key));

    console.dir('Current Balance: ' + result.data.balance);
    //console.dir('Current Balance: ' + result.data);
})();
