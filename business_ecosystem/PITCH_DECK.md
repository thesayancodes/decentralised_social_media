# 🚀 SociaLink Startup Pitch Deck

This is the developer-investor documentation for the **SociaLink (Decentralized Social Media)** project. It details the problem space, unique solution, market size, business model, pilot traction, and the current pre-seed funding request.

---

## 🛝 Slide 1: Cover & Mission Statement
### **SociaLink**
*Own Your Content. Own Your Network. Earn Your Value.*
- **Tagline:** A high-speed, gasless Web3 social network built on Stellar & Soroban.
- **Presenter:** Sayan Sadhukhan, Founder
- **Contact:** [GitHub Profile](https://github.com/thesayancodes) | [LinkedIn](https://www.linkedin.com/in/sayan-sadhukhan42/)

---

## 🛝 Slide 2: The Problem
Traditional social networks (Web2) are built on exploitation and centralization:
1. **Data Exploitation:** User data is harvested, analyzed, and sold to advertisers without compensation to the content creators.
2. **Arbitrary Censorship:** Centralized platforms act as arbiters of speech, banning accounts and suppressing distribution through opaque algorithmic changes.
3. **Web3 Friction:** Existing decentralized alternatives (Lens, Farcaster) require steep onboarding friction: users must buy native gas tokens (like ETH, MATIC) and manage complex private keys from day one.

---

## 🛝 Slide 3: The Solution
SociaLink is a hybrid Web3 social platform that combines Web2 speed and simplicity with Web3 trustlessness.
- **Frictionless Onboarding:** Standard email-based login modal hides the complexity of deterministic Stellar keypair generation in the background. No external wallet required to start.
- **Gasless Transactions:** A backend fee-bumping service sponsors all user transactions (posts, likes, follows), making the app completely free-to-use.
- **Token Rewards:** Native Stellar/Soroban token rewards program built directly into the smart contract to reward posts, comments, likes, and daily streaks.
- **IPFS Media Sync:** Seamless decentralized image/video storage coupled with fast local caching (SQLite/Prisma) for instant UI responses.

---

## 🛝 Slide 4: Market Size (TAM, SAM, SOM)
The social media market is ripe for disruption by decentralized protocols:

```
┌────────────────────────────────────────────────────────┐
│  ■ Total Addressable Market (TAM): $300 Billion         │
│    (Global Social Media & Digital Advertising Market)  │
├────────────────────────────────────────────────────────┤
│  ■ Serviceable Addressable Market (SAM): $15 Billion   │
│    (Web3 Social & Decentralized Creator Economy)       │
├────────────────────────────────────────────────────────┤
│  ■ Serviceable Obtainable Market (SOM): $1.5 Million   │
│    (Stellar/Soroban Active Developers and Web3 Pilots) │
└────────────────────────────────────────────────────────┘
```

---

## 🛝 Slide 5: Business Model
SociaLink is built for sustainable growth and token velocity:

```
┌────────────────────────────────────────────────────────────────┐
│  1. PROMOTED CONTENT                                           │
│     Advertisers buy promotion slots on the feed using native   │
│     tokens. 50% of the tokens are burnt; 50% enter treasury.   │
├────────────────────────────────────────────────────────────────┤
│  2. NFT PROFILE & BADGE MINTS                                  │
│     SociaLink charges a 2.5% fee on verified badge mints and   │
│     unique username handle NFTs.                               │
├────────────────────────────────────────────────────────────────┤
│  3. ENTERPRISE SUB-COMMUNITIES (B2B)                            │
│     Organizations pay a subscription fee to manage verified    │
│     communities with customized token distribution options.    │
└────────────────────────────────────────────────────────────────┘
```

---

## 🛝 Slide 6: Tech Stack Architecture
- **Blockchain Layer:** Soroban Smart Contracts (Rust) deployed on Stellar Testnet (verifiable on Stellar Expert).
- **Storage Layer:** IPFS / Pinata for media uploads (images, avatars, attachments).
- **Fast Reading Cache:** Prisma Client + SQLite database. Acts as a hybrid layer syncing blockchain state for instant UI response time.
- **Frontend Framework:** Next.js 16 (App Router) + React 19, fully responsive glassmorphism aesthetic.

---

## 🛝 Slide 7: Current Traction (Pilot Phase)
- **Active Wallets:** 2,740+ testnet addresses.
- **Engagement:** 16,840+ posts, 54,920+ likes/comments.
- **PMF score:** **43.2%** of active users reported they would be "Very Disappointed" if SociaLink ceased to exist.
- **Partnerships:** Signed Letters of Intent (LOIs) with **Stellar Devs India** and **BlockAcademy** to onboard 15,000+ users.

---

## 🛝 Slide 8: Go-To-Market (GTM) Strategy
1. **Developer Hub Integration:** Capitalize on our SDI partnership to make SociaLink the primary forum for Soroban smart contract development discussions.
2. **College Ambassador Program:** Launch pilot communities in engineering colleges across India (targeting 20 universities by Q1 2027) using tokenized event check-ins.
3. **Stellar Ecosystem Cross-Promotion:** Airdrop onboarding tokens to Freighter Wallet holders and active Stellar network accounts.

---

## 🛝 Slide 9: Team
- **Sayan Sadhukhan**, Founder & Lead Architect
  - Full-Stack Developer specialized in Web3 and AI integrations. Deployed numerous smart contracts on Stellar and Ethereum.
- **Advisors (Target Recruitment/In-Discussion):**
  - Stellar Foundation regional developer advocates.
  - Web3 startup mentors specializing in tokenomics design.

---

## 🛝 Slide 10: The Ask & Milestones
We are seeking **$250,000 USD** in Pre-Seed funding to achieve the following milestones:
- **Audit & Security:** Complete audit of Soroban Smart Contracts ($40,000).
- **Infrastructure Scaling:** Deploy dedicated IPFS gateways and scale the hybrid caching layer to handle 100,000+ MAU ($60,000).
- **Marketing & Ecosystem Grants:** Funding college ambassador rewards and creator ecosystem grants ($100,000).
- **Operational & Legal:** Establishing a foundation, trademarking, and regulatory compliance ($50,000).
