const { Contract, rpc, nativeToScVal, scValToNative, Networks, TransactionBuilder } = require('@stellar/stellar-sdk');

async function checkComments() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  const contract = new Contract("CAMGKSC52O33WPITPYHIMD5V5IUL5AVXGRSKNMYWHHYFTZNRUJHZZZ36");
  const userPubKey = "GBPL5IDCHAMFPQDHCU2GA4CR33GW4X6IUNDG4C55YU44AMLFMJYUQ7UD";

  let tx = await server.simulateTransaction(
    new TransactionBuilder(await server.getAccount(userPubKey), { fee: "100", networkPassphrase: Networks.TESTNET })
      .addOperation(contract.call("get_comments", nativeToScVal(2, {type: "u64"}), nativeToScVal(0, {type: "u32"}), nativeToScVal(50, {type: "u32"})))
      .setTimeout(30)
      .build()
  );

  if (rpc.Api.isSimulationSuccess(tx)) {
      const comments = scValToNative(tx.result.retval);
      console.log("Comments:", JSON.stringify(comments, null, 2));
  } else {
      console.log("Simulation failed:", tx.error);
  }
}
checkComments().catch(console.error);
