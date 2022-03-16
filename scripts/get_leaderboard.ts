var fs = require("fs");

/* Connect to ethereum node */
const etherUrl = "https://evm.wasp.sc.iota-defi.com/";
const { abi } = require("../artifacts/contracts/PIXELBOTS.sol/PIXELBOTS.json");
var Contract = require("web3-eth-contract");

Contract.setProvider(etherUrl);

var contract = new Contract(abi, "0x1926d2067b91272275d3EA629e0A7199ae6Aa710");

async function main() {
  for (var i = 1; i <= 500; i++) {
    await contract.methods
      .winCount(i)
      .call(
        { from: "0x8863ae48646c493efF8cd54f9Ffb8Be89669E62A" },
        function (error, result) {
          var line = i + ":" + result + "\n";
          fs.appendFile("leaderboard.txt", line, function (err) {
            if (err) {
              // append failed
            } else {
              // done
            }
          });
        }
      );
  }
}

main();
