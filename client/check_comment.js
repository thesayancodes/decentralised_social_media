const { Contract, rpc, nativeToScVal, Keypair, TransactionBuilder, Networks } = require('@stellar/stellar-sdk');

async function checkComment() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  const contract = new Contract("CAMGKSC52O33WPITPYHIMD5V5IUL5AVXGRSKNMYWHHYFTZNRUJHZZZ36");
  
  const userPubKey = "GBPL5IDCHAMFPQDHCU2GA4CR33GW4X6IUNDG4C55YU44AMLFMJYUQ7UD";

  console.log("Simulating add_comment for post 2 from", userPubKey);

  let tx = await server.simulateTransaction(
    new TransactionBuilder(await server.getAccount(userPubKey), { fee: "100", networkPassphrase: Networks.TESTNET })
      .addOperation(contract.call("add_comment", nativeToScVal(2, {type: "u64"}), nativeToScVal(userPubKey, {type: "address"}), nativeToScVal("test comment", {type: "string"})))
      .setTimeout(30)
      .build()
  );

  if (rpc.Api.isSimulationSuccess(tx)) {
      console.log("Simulation succeeded!");
  } else {
      console.log("Simulation failed:", tx.error);
  }
}
checkComment().catch(console.error);
