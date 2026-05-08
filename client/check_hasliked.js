const { Contract, rpc, nativeToScVal, scValToNative, Networks } = require('@stellar/stellar-sdk');

async function checkState() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  const contract = new Contract("CAMGKSC52O33WPITPYHIMD5V5IUL5AVXGRSKNMYWHHYFTZNRUJHZZZ36");
  const userPubKey = "GBPL5IDCHAMFPQDHCU2GA4CR33GW4X6IUNDG4C55YU44AMLFMJYUQ7UD";

  let tx = await server.simulateTransaction(
    new rpc.TransactionBuilder(await server.getAccount(userPubKey).catch(() => ({ id: () => userPubKey, sequenceNumber: () => "0" })), { fee: "100", networkPassphrase: Networks.TESTNET })
      .addOperation(contract.call("has_liked", nativeToScVal(2, {type: "u64"}), nativeToScVal(userPubKey, {type: "address"})))
      .setTimeout(30)
      .build()
  );
  if (rpc.Api.isSimulationSuccess(tx)) {
    const hasLiked = scValToNative(tx.result.retval);
    console.log("hasLiked:", hasLiked);
  } else {
    console.log("hasLiked failed", tx.error);
  }
}
checkState().catch(console.error);
