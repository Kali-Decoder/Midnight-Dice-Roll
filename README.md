# Midnight Dice Roll

[![Generic badge](https://img.shields.io/badge/Compact%20Toolchain-0.30.0-1abc9c.svg)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/midnight--js-4.0.2-blueviolet.svg)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/wallet--sdk--facade-3.0.0-blue.svg)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/Tests%20Cases%20Passed-30-green.svg)](https://shields.io/)

> A DiceRoll contract demo that records every roll on Midnight. This project is built on the Midnight Network.

This project demonstrates how to derive dice outcomes from entropy, call the contract, and present a clean UI that reflects on-chain state in real time.

---

<img width="1284" height="1031" alt="Screenshot 2026-04-03 at 4 28 19 PM" src="https://github.com/user-attachments/assets/b58d9d53-9ef2-44dc-968c-dfc77f8405ee" />



## What this demonstrates

This project focuses on **verifiable on-chain roll history**:

* A 32-byte secret is generated per roll
* Two dice values are derived deterministically
* The DiceRoll contract stores the outcomes and increments roll count
* The UI displays the latest roll and recent history

---

## Features

* **DiceRoll Contract Integration**
  Records two dice values and totals on-chain

* **Deterministic Roll Derivation**
  Dice values are derived from a fresh secret each roll

* **CLI Experience**
  Simple terminal flow for on-chain rolls

* **Web UI (Next.js)**
  Real-time dice visualization and roll history

---

## Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Start the proof server

Make sure Docker is running:

```bash
docker run -p 6300:6300 midnightntwrk/proof-server:8.0.3 -- midnight-proof-server -v
```

---

### 3. Compile contract

```bash
npm run compile
```

---

### 4. Deploy contract

```bash
export PRIVATE_STATE_PASSWORD='your-strong-password'
npm run deploy
```

**Notes:**

* You’ll be prompted for a seed if not set
* Ensure wallet has at least **1,000,000 DUST**

---

## 🎲 Roll Dice (CLI)

```bash
npm run roll
```

Verbose mode:

```bash
npm run roll:verbose
```

---

## 🌐 Web UI (Next.js)

The project includes a DiceRoll web frontend.

1. **Start the House Server**
   ```bash
   export PRIVATE_STATE_PASSWORD='your-strong-password'
   npx tsx src/server.ts
   ```

2. **Launch the UI**
   ```bash
   cd ui
   npm run dev
   ```

3. Open `http://localhost:3000` to roll dice and view roll history.

---

## Example Flow

```text
🎲 Roll initiated
→ Dice values derived from entropy
→ roll_dice called on-chain

🎯 Result: 4 + 2 = 6
✅ Recorded on Midnight
```

---

## Tests

Run tests:

```bash
npm test
```

Covers:

* dice value range validation
* deterministic roll derivation
* distribution sanity checks

---

## Built on Midnight

Showcasing privacy-preserving computation and verifiable execution.

---

## Author

[Kali-Decoder](https://github.com/Kali-Decoder)
