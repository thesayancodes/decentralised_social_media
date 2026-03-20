"use client";

import {
  Contract,
  Networks,
  TransactionBuilder,
  Keypair,
  xdr,
  Address,
  nativeToScVal,
  scValToNative,
  rpc,
} from "@stellar/stellar-sdk";
import {
  isConnected,
  getAddress,
  signTransaction,
  setAllowed,
  isAllowed,
  requestAccess,
} from "@stellar/freighter-api";

// ============================================================
// CONSTANTS — Update with your deployed contract
// ============================================================

/** Your deployed Soroban contract ID */
export const CONTRACT_ADDRESS =
  "CCRYYP6MXHKGAJRTUS75UBBT5WHNVOXSBJPYUWXAIT52AWVJI6OD3O2NC";

/** Network passphrase (testnet by default) */
export const NETWORK_PASSPHRASE = Networks.TESTNET;

/** Soroban RPC URL */
export const RPC_URL = "https://soroban-testnet.stellar.org";

/** Horizon URL */
export const HORIZON_URL = "https://horizon-testnet.stellar.org";

/** Network name for Freighter */
export const NETWORK = "TESTNET";

// ============================================================
// RPC Server Instance
// ============================================================

const server = new rpc.Server(RPC_URL);

// ============================================================
// Wallet Helpers
// ============================================================

export async function checkConnection(): Promise<boolean> {
  const result = await isConnected();
  return result.isConnected;
}

export async function connectWallet(): Promise<string> {
  const connResult = await isConnected();
  if (!connResult.isConnected) {
    throw new Error("Freighter extension is not installed or not available.");
  }

  const allowedResult = await isAllowed();
  if (!allowedResult.isAllowed) {
    await setAllowed();
    await requestAccess();
  }

  const { address } = await getAddress();
  if (!address) {
    throw new Error("Could not retrieve wallet address from Freighter.");
  }
  return address;
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const connResult = await isConnected();
    if (!connResult.isConnected) return null;

    const allowedResult = await isAllowed();
    if (!allowedResult.isAllowed) return null;

    const { address } = await getAddress();
    return address || null;
  } catch {
    return null;
  }
}

// ============================================================
// Contract Interaction Helpers
// ============================================================

export async function callContract(
  method: string,
  params: xdr.ScVal[] = [],
  caller: string,
  sign: boolean = true
) {
  const contract = new Contract(CONTRACT_ADDRESS);
  const account = await server.getAccount(caller);

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...params))
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(
      `Simulation failed: ${(simulated as rpc.Api.SimulateTransactionErrorResponse).error}`
    );
  }

  if (!sign) {
    return simulated;
  }

  const prepared = rpc.assembleTransaction(tx, simulated).build();

  const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const txToSubmit = TransactionBuilder.fromXDR(
    signedTxXdr,
    NETWORK_PASSPHRASE
  );

  const result = await server.sendTransaction(txToSubmit);

  if (result.status === "ERROR") {
    throw new Error(`Transaction submission failed: ${result.status}`);
  }

  let getResult = await server.getTransaction(result.hash);
  while (getResult.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getResult = await server.getTransaction(result.hash);
  }

  if (getResult.status === "FAILED") {
    throw new Error("Transaction failed on chain.");
  }

  return getResult;
}

/**
 * Read-only contract call (does not require signing).
 */
export async function readContract(
  method: string,
  params: xdr.ScVal[] = [],
  caller?: string
) {
  const account =
    caller || Keypair.random().publicKey();
  const sim = await callContract(method, params, account, false);
  if (
    rpc.Api.isSimulationSuccess(sim as rpc.Api.SimulateTransactionResponse) &&
    (sim as rpc.Api.SimulateTransactionSuccessResponse).result
  ) {
    return scValToNative(
      (sim as rpc.Api.SimulateTransactionSuccessResponse).result!.retval
    );
  }
  return null;
}

// ============================================================
// ScVal Conversion Helpers
// ============================================================

export function toScValString(value: string): xdr.ScVal {
  return nativeToScVal(value, { type: "string" });
}

export function toScValU32(value: number): xdr.ScVal {
  return nativeToScVal(value, { type: "u32" });
}

export function toScValU64(value: bigint): xdr.ScVal {
  return nativeToScVal(value, { type: "u64" });
}

export function toScValI128(value: bigint): xdr.ScVal {
  return nativeToScVal(value, { type: "i128" });
}

export function toScValAddress(address: string): xdr.ScVal {
  return new Address(address).toScVal();
}

export function toScValBool(value: boolean): xdr.ScVal {
  return nativeToScVal(value, { type: "bool" });
}

// ============================================================
// Social Media Dapp — Contract Methods (all permissionless)
// ============================================================

// ─── Posts ───────────────────────────────────────────────────

export async function createPost(caller: string, content: string) {
  return callContract(
    "create_post",
    [toScValAddress(caller), toScValString(content)],
    caller,
    true
  );
}

export async function getPost(postId: number, caller?: string) {
  return readContract(
    "get_post",
    [toScValU64(BigInt(postId))],
    caller
  );
}

export async function getPostCount(caller?: string) {
  return readContract("get_post_count", [], caller);
}

export async function getRecentPosts(offset: number, limit: number, caller?: string) {
  return readContract(
    "get_recent_posts",
    [toScValU32(offset), toScValU32(limit)],
    caller
  );
}

// ─── Comments ────────────────────────────────────────────────

export async function addComment(
  postId: number,
  commenter: string,
  content: string
) {
  return callContract(
    "add_comment",
    [toScValU64(BigInt(postId)), toScValAddress(commenter), toScValString(content)],
    commenter,
    true
  );
}

export async function getComments(
  postId: number,
  offset: number,
  limit: number,
  caller?: string
) {
  return readContract(
    "get_comments",
    [toScValU64(BigInt(postId)), toScValU32(offset), toScValU32(limit)],
    caller
  );
}

// ─── Likes ───────────────────────────────────────────────────

export async function likePost(postId: number, liker: string) {
  return callContract(
    "like_post",
    [toScValU64(BigInt(postId)), toScValAddress(liker)],
    liker,
    true
  );
}

export async function unlikePost(postId: number, liker: string) {
  return callContract(
    "unlike_post",
    [toScValU64(BigInt(postId)), toScValAddress(liker)],
    liker,
    true
  );
}

export async function getLikeCount(postId: number, caller?: string) {
  return readContract(
    "get_like_count",
    [toScValU64(BigInt(postId))],
    caller
  );
}

export async function hasLiked(postId: number, address: string, caller?: string) {
  return readContract(
    "has_liked",
    [toScValU64(BigInt(postId)), toScValAddress(address)],
    caller
  );
}

// ─── Follow System ───────────────────────────────────────────

export async function followUser(follower: string, target: string) {
  return callContract(
    "follow",
    [toScValAddress(follower), toScValAddress(target)],
    follower,
    true
  );
}

export async function unfollowUser(follower: string, target: string) {
  return callContract(
    "unfollow",
    [toScValAddress(follower), toScValAddress(target)],
    follower,
    true
  );
}

export async function getFollowerCount(address: string, caller?: string) {
  return readContract(
    "get_follower_count",
    [toScValAddress(address)],
    caller
  );
}

export async function getFollowingCount(address: string, caller?: string) {
  return readContract(
    "get_following_count",
    [toScValAddress(address)],
    caller
  );
}

export async function isFollowing(follower: string, target: string, caller?: string) {
  return readContract(
    "is_following",
    [toScValAddress(follower), toScValAddress(target)],
    caller
  );
}

export async function getFollowers(
  address: string,
  offset: number,
  limit: number,
  caller?: string
) {
  return readContract(
    "get_followers",
    [toScValAddress(address), toScValU32(offset), toScValU32(limit)],
    caller
  );
}

export async function getFollowing(
  address: string,
  offset: number,
  limit: number,
  caller?: string
) {
  return readContract(
    "get_following",
    [toScValAddress(address), toScValU32(offset), toScValU32(limit)],
    caller
  );
}

export async function getFollowedFeed(
  viewer: string,
  offset: number,
  limit: number,
  caller?: string
) {
  return readContract(
    "get_followed_feed",
    [toScValAddress(viewer), toScValU32(offset), toScValU32(limit)],
    caller
  );
}

export { nativeToScVal, scValToNative, Address, xdr };
