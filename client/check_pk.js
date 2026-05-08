const { Keypair } = require('@stellar/stellar-sdk');

try {
  const kp = Keypair.fromPublicKey("GBPL5IDCHAMFPQDHOU2GA4CR33GW4X6IUNDG4C55YU44AMLFMJYUQ7UD");
  console.log("Valid");
} catch (e) {
  console.error("Invalid:", e);
}
