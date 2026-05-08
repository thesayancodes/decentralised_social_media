const { Contract, rpc, nativeToScVal, scValToNative, Keypair, TransactionBuilder, Networks } = require('@stellar/stellar-sdk');

async function checkState() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  const contract = new Contract("CAMGKSC52O33WPITPYHIMD5V5IUL5AVXGRSKNMYWHHYFTZNRUJHZZZ36");
  const kp = Keypair.random();

  try {
      await server.requestAirdrop(kp.publicKey());
      await new Promise(r => setTimeout(r, 5000));
  } catch(e) {}

  let tx = await server.simulateTransaction(
    new TransactionBuilder(await server.getAccount(kp.publicKey()), { fee: "100", networkPassphrase: Networks.TESTNET })
      .addOperation(contract.call("get_post_count"))
      .setTimeout(30)
      .build()
  );
  if (rpc.Api.isSimulationSuccess(tx)) {
    const count = scValToNative(tx.result.retval);
    console.log("Post count:", count);
    
    for (let i = 1; i <= Number(count) + 1; i++) {
        try {
            let postTx = await server.simulateTransaction(
                new TransactionBuilder(await server.getAccount(kp.publicKey()), { fee: "100", networkPassphrase: Networks.TESTNET })
                .addOperation(contract.call("get_post", nativeToScVal(i, {type: "u64"})))
                .setTimeout(30)
                .build()
            );
            if (rpc.Api.isSimulationSuccess(postTx)) {
                console.log(`Post ${i} exists!`);
            } else {
                console.log(`Post ${i} simulation failed:`, postTx.error || "no error object");
                // Check if events show panic
                if (postTx.events && postTx.events.length > 0) {
                    console.log("Events:", JSON.stringify(postTx.events));
                }
            }
        } catch(e) {
            console.log(`Post ${i} threw error:`, e.message);
        }
    }
  } else {
    console.log("Failed to get post count", tx.error);
  }
}
checkState().catch(console.error);
