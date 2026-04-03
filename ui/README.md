# Midnight Dice UI

A Next.js frontend for the DiceRoll contract.

## Getting Started

```bash
npm install
npm run dev
```

The UI expects the local house server to be running:

```bash
export PRIVATE_STATE_PASSWORD='your-strong-password'
cd ..
npx tsx src/server.ts
```

Open `http://localhost:3000` to roll dice and see the results update instantly.
