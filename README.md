<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,50:8B5CF6,100:00C9A7&height=240&section=header&text=Decentralized%20Social%20Media&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Own%20Your%20Content%20•%20No%20Censorship%20•%20Powered%20by%20Web3&descAlignY=58&descSize=18&descFontColor=c9d1f5" />

<br/>

[![GitHub repo size](https://img.shields.io/github/repo-size/thesayancodes/decentralised_social_media?style=for-the-badge&color=6C63FF&logo=github)](https://github.com/thesayancodes/decentralised_social_media)
[![GitHub stars](https://img.shields.io/github/stars/thesayancodes/decentralised_social_media?style=for-the-badge&color=F59E0B&logo=github)](https://github.com/thesayancodes/decentralised_social_media/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thesayancodes/decentralised_social_media?style=for-the-badge&color=00C9A7&logo=github)](https://github.com/thesayancodes/decentralised_social_media/network/members)
[![GitHub issues](https://img.shields.io/github/issues/thesayancodes/decentralised_social_media?style=for-the-badge&color=EF4444&logo=github)](https://github.com/thesayancodes/decentralised_social_media/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-00C9A7?style=for-the-badge&logo=git&logoColor=white)](CONTRIBUTING.md)

<br/>

> **A next-generation Web3 social platform where your data belongs to you — forever.**

[🌐 Live Demo](#) · [📜 Smart Contract on Stellar Expert](https://stellar.expert/explorer/testnet/tx/6867794440237056#6867794440237057) · [🐛 Report Bug](https://github.com/thesayancodes/decentralised_social_media/issues) · [💡 Request Feature](https://github.com/thesayancodes/decentralised_social_media/issues)

</div>

---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Why Decentralized?](#-why-decentralized)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Smart Contract Overview](#-smart-contract-overview)
- [🔭 Live on Stellar Expert](#-live-on-stellar-expert)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🌍 About The Project

**Decentralized Social Media** is a cutting-edge Web3 platform that puts the power of social networking back into the hands of users. Built on blockchain technology with AI integration, it eliminates centralized control, data harvesting, and arbitrary censorship — creating a truly open, transparent, and user-owned social experience.

Every post is immutable. Every interaction is trustless. Every user is sovereign.

---

## ❓ Why Decentralized?

<table>
<tr>
<th>❌ Traditional Platforms</th>
<th>✅ This Platform</th>
</tr>
<tr>
<td>Your data is sold to advertisers</td>
<td>You own 100% of your data</td>
</tr>
<tr>
<td>Algorithms control your reach</td>
<td>Transparent, on-chain feed logic</td>
</tr>
<tr>
<td>Accounts can be banned arbitrarily</td>
<td>Censorship-resistant by design</td>
</tr>
<tr>
<td>Centralized single point of failure</td>
<td>Distributed, always-available network</td>
</tr>
<tr>
<td>No compensation for content creation</td>
<td>Token rewards for quality content</td>
</tr>
<tr>
<td>Opaque moderation policies</td>
<td>DAO-governed community rules</td>
</tr>
</table>

---

## ✨ Features

### 🔥 Core Features
| Feature | Description |
|--------|-------------|
| 📝 **Post & Share** | Create text, image, and media posts stored permanently on-chain |
| ❤️ **Interact** | Like, comment, and engage — all interactions are blockchain-verified |
| 👛 **Wallet Auth** | Sign in with Freighter — no passwords, no email, just your Stellar wallet |
| 🔗 **On-Chain Storage** | Posts and interactions live on Ethereum smart contracts |
| 🌐 **Fully Decentralized** | No servers, no company — just code and community |

### ⚡ Advanced Features
| Feature | Description |
|--------|-------------|
| 🧠 **AI Fake News Detection** | Machine learning model flags potentially misleading content |
| 📦 **IPFS Media Storage** | Large files stored on IPFS; only content hashes go on-chain |
| 💰 **Token Reward System** | Earn platform tokens for quality posts and engagement |
| 🌙 **Dark Mode UI** | Sleek, eye-friendly dark interface with seamless toggle |
| 📊 **Real-Time Feed** | Live updates powered by blockchain event listeners |
| 🔐 **End-to-End Privacy** | User identity tied only to cryptographic keys |

---

## 🧠 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                                                             │
│   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐  │
│   │  React UI   │◄──►│  Stellar SDK /│◄──►│  Freighter  │  │
│   │  Frontend   │    │  soroban-sdk  │    │   Wallet    │  │
│   └──────┬──────┘    └──────────────┘    └─────────────┘  │
│          │                                                   │
└──────────┼───────────────────────────────────────────────────┘
           │
     ┌─────▼──────┐          ┌───────────────────────┐
     │   IPFS     │          │    Stellar Blockchain  │
     │  Network   │◄────────►│    (Soroban / Testnet) │
     │            │  content │  ┌──────────────────┐  │
     │ Media/Files│  hashes  │  │  Smart Contracts  │  │
     └────────────┘          │  │                  │  │
                             │  │  • PostStorage   │  │
     ┌────────────┐          │  │  • UserRegistry  │  │
     │  AI Layer  │          │  │  • TokenRewards  │  │
     │            │          │  │  • Governance    │  │
     │  Fake News │          │  └──────────────────┘  │
     │  Detector  │          └───────────────────────┘
     └────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Blockchain & Web3
![Stellar](https://img.shields.io/badge/Stellar-090B0C?style=for-the-badge&logo=stellar&logoColor=white)
![Soroban](https://img.shields.io/badge/Soroban-7C3AED?style=for-the-badge&logo=stellar&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![Freighter](https://img.shields.io/badge/Freighter_Wallet-6C63FF?style=for-the-badge&logo=stellar&logoColor=white)
![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)

### Backend & Tools
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Stellar CLI](https://img.shields.io/badge/Stellar_CLI-090B0C?style=for-the-badge&logo=stellar&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

</div>

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node  >= 16.0.0
npm   >= 8.0.0
```

Also install globally:

```bash
npm install -g truffle
npm install -g stellar-cli
```

> 🚀 You'll also need the **[Freighter browser extension](https://www.freighter.app/)** — the Stellar wallet — to interact with the platform.

---

### ⚙️ Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/thesayancodes/decentralised_social_media.git
cd decentralised_social_media
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Set Up Stellar Testnet

```bash
# Configure Stellar CLI for testnet
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate a testnet keypair and fund it
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet
```

#### 4️⃣ Deploy Smart Contracts

```bash
# Build the Soroban contract
stellar contract build

# Deploy to Stellar testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/social_media.wasm \
  --source my-key \
  --network testnet

# (Optional) Run contract tests
cargo test
```

#### 5️⃣ Configure Freighter Wallet

1. Install the **[Freighter extension](https://www.freighter.app/)**
2. Create or import your Stellar account
3. Switch network to **Testnet** in Freighter settings
4. Fund your testnet account via [Stellar Friendbot](https://friendbot.stellar.org/)

#### 6️⃣ Start the Frontend

```bash
npm start
```

> 🌐 The app will be running at `http://localhost:3000`

---

## 📜 Smart Contract Overview

### 🔑 Contract ID

```
CA7IJHQW4JPCIDTJA45BZXXQLJ4RGPFU5PZQJJXKYS6S4DYXYHOFLDI7
```
### Screenshot of Smart Contract:

<img width="1895" height="892" alt="Screenshot 2026-03-19 152417" src="https://github.com/user-attachments/assets/a7e750de-5a6b-4f9a-be37-125c5f527ea9" />


> 🔭 **[View live on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/6867794440237056#6867794440237057)**

### Stellar Lab Screenshot: 
<img width="1896" height="900" alt="image" src="https://github.com/user-attachments/assets/71cb9420-a39a-467c-aa7c-dc3fa991bebc" />

### UI Screenshot:
<img width="1919" height="975" alt="image" src="https://github.com/user-attachments/assets/77365a25-642f-4cbb-b552-ebb61cc601fe" />



---

### Contract Code (Soroban / Rust)

```rust
// Core contract structure (simplified)

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

#[contracttype]
pub struct Post {
    pub id: u64,
    pub author: Address,
    pub content_hash: String,   // IPFS CID
    pub timestamp: u64,
    pub likes: u64,
    pub flagged_by_ai: bool,
}

#[contract]
pub struct SocialMediaContract;

#[contractimpl]
impl SocialMediaContract {
    pub fn create_post(env: Env, author: Address, content_hash: String) -> u64 { ... }
    pub fn like_post(env: Env, caller: Address, post_id: u64) { ... }
    pub fn get_post(env: Env, post_id: u64) -> Post { ... }
    pub fn get_user_posts(env: Env, user: Address) -> Vec<u64> { ... }
}
```

> 📌 View the full contract source in [`/contracts/src/lib.rs`](./contracts/src/lib.rs)

---

## 🔭 Live on Stellar Expert

The smart contract is deployed and verifiable on the **Stellar Testnet** via Stellar Expert — the leading Stellar blockchain explorer.

<div align="center">

| Detail | Value |
|--------|-------|
| 🌐 **Network** | Stellar Testnet |
| 📋 **Contract ID** | `73360b21191057097b9300b2f7b720d59ca6fa1d949e95efeb4fb9fdf4880f00` |
| 🔗 **Explorer Link** | [stellar.expert → View Transaction](https://stellar.expert/explorer/testnet/tx/6867794440237056#6867794440237057) |
| ✅ **Status** | Deployed & Active |

</div>

### Stellar Expert transaction Screenshot:
<img width="1919" height="921" alt="Screenshot 2026-03-20 145355" src="https://github.com/user-attachments/assets/73afc08f-b313-4dde-8e79-5a71e8e37b8b" />


[![View on Stellar Expert](https://img.shields.io/badge/View%20on%20Stellar%20Expert-090B0C?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet/tx/6867794440237056#6867794440237057)

---

## 🔄 How It Works

```
  User                   Frontend              Stellar                 IPFS
   │                        │                      │                    │
   │─── Connect Wallet ────►│                      │                    │
   │                        │─── Request Sign ────►│                    │
   │◄── Authenticated ──────│◄── Verified ─────────│                    │
   │    (via Freighter)      │                      │                    │
   │─── Create Post ───────►│                      │                    │
   │                        │─── Upload Media ─────│───────────────────►│
   │                        │◄── IPFS Hash ─────────────────────────────│
   │                        │─── Invoke Contract ──►│                    │
   │                        │◄── Tx Confirmed ──────│                    │
   │◄── Post Published ─────│                      │                    │
   │                        │                      │                    │
   │─── Like Post ─────────►│                      │                    │
   │                        │─── On-chain Tx ──────►│                    │
   │◄── Interaction Saved ──│◄── Event Emitted ─────│                    │
```

---

## 📁 Project Structure

```
decentralised_social_media/
│
├── 📁 contracts/               # Soroban smart contracts (Rust)
│   ├── src/
│   │   └── lib.rs              # Core post & interaction logic
│   └── Cargo.toml
│
├── 📁 src/                     # React frontend
│   ├── 📁 components/          # Reusable UI components
│   │   ├── Feed.jsx
│   │   ├── PostCard.jsx
│   │   ├── CreatePost.jsx
│   │   └── Navbar.jsx
│   ├── 📁 utils/               # Stellar SDK, IPFS helpers
│   │   ├── stellar.js
│   │   └── ipfs.js
│   ├── App.jsx
│   └── index.js
│
├── 📁 assets/                  # Screenshots & media
│   └── stellar-expert-screenshot.png
│
├── 📁 test/                    # Contract tests
│   └── social_media_test.rs
│
├── package.json
└── README.md
```

---

## 🗺️ Roadmap

- [x] 🔗 Stellar smart contract integration (Soroban)
- [x] 👛 Freighter wallet authentication
- [x] 📝 On-chain post creation & likes
- [x] 📦 IPFS media storage
- [x] 🧠 AI fake news detection module
- [x] 🌙 Dark mode UI
- [ ] 🗳️ DAO governance module
- [ ] 📱 Mobile app (React Native)
- [ ] 🌐 Multi-chain support (Polygon, BSC)
- [ ] 💬 Encrypted Web3 messaging (XMTP)
- [ ] 🧾 NFT-based user profiles
- [ ] 💰 Full token economy & staking
- [ ] 🔍 On-chain search & discovery

---

## 🤝 Contributing

Contributions are what make open source amazing! Any contribution you make is **greatly appreciated**.

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat: add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

> 💡 Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for full guidelines.

---

## 📊 GitHub Stats

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=thesayancodes&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6C63FF&icon_color=00C9A7)
![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=thesayancodes&theme=tokyonight&hide_border=true&background=0D1117&ring=6C63FF&fire=00C9A7&currStreakLabel=8B5CF6)

</div>

---

## 🧑‍💻 Author

<div align="center">

<img src="https://avatars.githubusercontent.com/thesayancodes" width="100px" style="border-radius:50%" alt="Sayan Sadhukhan"/>

### Sayan Sadhukhan

**Web3 & AI Developer**

[![GitHub](https://img.shields.io/badge/GitHub-thesayancodes-181717?style=for-the-badge&logo=github)](https://github.com/thesayancodes)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/thesayancodes)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/thesayancodes)

*Building the decentralized future, one block at a time.*

</div>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

**If you found this project helpful, please give it a ⭐ — it means a lot!**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C9A7,100:6C63FF&height=120&section=footer" />

</div>
