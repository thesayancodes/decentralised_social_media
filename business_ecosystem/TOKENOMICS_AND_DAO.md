# 🪙 Tokenomics and DAO Governance Model

This document outlines the token utility, emission curves, distribution schedules, and DAO governance rules designed to secure long-term value, high velocity, and robust community participation within the **SociaLink** network.

---

## 💎 Native Token Utility (Ticker: $LINK)

The platform token, `$LINK` (custom token deployed on Soroban), acts as the primary medium of exchange, governance vote, and value driver.

```
                  ┌─────────────────────────────────┐
                  │       $LINK TOKEN UTILITY       │
                  └────────────────┬────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   GOVERNANCE    │       │     UTILITY     │       │    REWARDS      │
│  Staking & Voting│      │ Promoted Feed   │      │ Content Creation│
│  DAO Moderation │       │ Creator Tipping │       │ Streak Bonuses  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **Platform Utility:**
   - **Creator Tipping:** Send micropayments to content creators.
   - **Community Unlock:** Certain premium sub-communities require staking a minimum amount of `$LINK` to access or post.
   - **Promoted Feed slots:** Users and advertisers burn `$LINK` to boost post visibility.
2. **DAO Governance:**
   - **Proposal Voting:** Staked tokens grant voting rights on network parameters (reward distribution rates, new topics, contract upgrades).
   - **Moderation Staking:** Users stake tokens to submit moderation appeals or flag malicious actors. Staked tokens of bad actors are slashed.
3. **Incentive Alignment:**
   - **Engagement Mining:** Tokens are distributed directly by the contract for positive actions: creating posts (+10), receiving likes (+5), maintaining daily streaks (+20).

---

## 📊 Token Supply & Distribution

- **Total Cap:** `100,000,000 $LINK` (Fixed Supply)
- **Token Type:** Soroban Native Asset Wrapper (Standard CAP-46-compatible)

### Allocation Breakdown:

```
┌────────────────────────────────────────────────────────┐
│  ■ Community & Creator Rewards (Engagement) (40.0%)     │
├────────────────────────────────────────────────────────┤
│  ■ Ecosystem Foundation & Treasury (20.0%)              │
├────────────────────────────────────────────────────────┤
│  ■ Core Team & Early Advisors (15.0%) (3-year vesting)  │
├────────────────────────────────────────────────────────┤
│  ■ Strategic Funding & Token Sale (15.0%)               │
├────────────────────────────────────────────────────────┤
│  ■ Liquidity Pool Bootstrapping (10.0%)                 │
└────────────────────────────────────────────────────────┘
```

---

## ⏳ Vesting & Lock-up Schedules

To demonstrate serious long-term commitment and prevent market dumping:

- **Core Team (15%):** 6-month cliff, followed by linear monthly vesting over 36 months.
- **Strategics & Seed Investors (15%):** 10% unlocked at Token Generation Event (TGE), followed by 12-month linear vesting.
- **Ecosystem Treasury (20%):** Deployed under multi-sig control, limited to a maximum release of 5% per annum for community grant programs.

---

## 🏛️ DAO Governance Framework

SociaLink operates a progressive decentralization model. Once the network reaches **50,000 active wallets**, governance transitions to the on-chain DAO.

### 🗳️ Voting Mechanism: Quadratic Voting (QV)
To prevent whale dominance (large token holders dictating all community decisions), SociaLink implements **Quadratic Voting**.
- The voting power of an account is calculated as the **square root** of the staked token balance:
  $$\text{Voting Power} = \sqrt{\text{Staked Tokens}}$$
- This prioritizes the quantity of individual community members over the size of individual wallet holdings.

### 🛡️ Decentralized Moderation (DecMod)
- Users flag inappropriate posts or spam by staking `50 $LINK`.
- A random panel of 11 verified users is selected by the contract to review the post.
- If the majority agrees the post violates community guidelines, the post is hidden, the reporter gets their stake back plus a portion of the bad actor’s staked rewards, and the author is penalized.
- If the report is malicious/frivolous, the reporter’s stake is burnt.
