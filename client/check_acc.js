const { rpc } = require('@stellar/stellar-sdk');

async function checkAcc() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  try {
    const acc = await server.getAccount("GBPL5IDCHAMFPQDHCU2GA4CR33GW4X6IUNDG4C55YU44AMLFMJYUQ7UD");
    console.log("Account exists! Sequence:", acc.sequenceNumber());
  } catch(e) {
    console.log("Account does not exist!", e.message);
  }
}
checkAcc().catch(console.error);
