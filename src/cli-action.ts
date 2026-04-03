import * as fs from 'node:fs';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { createWallet, createProviders, compiledContract, generateSecret, rollDice } from './diceroll-utils.js';

// Read arguments
const command = process.argv[2];

// Use a fixed system "house" wallet for testing
const SEED = "57bb166cb6bbf3a6cb5e93a26043e3e2d3c830b63b85286fe97619456a2a23f2";

async function run() {
  try {
    const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    const walletCtx = await createWallet(SEED);
    await walletCtx.wallet.waitForSyncedState();
    const providers = await createProviders(walletCtx);
    const contract = await findDeployedContract(providers, {
      contractAddress: deployment.contractAddress,
      compiledContract,
    });

    if (command === 'roll') {
      const secret = generateSecret();
      const roll = rollDice(secret);
      
      const rollTx = await contract.callTx.roll_dice(roll.dieOne, roll.dieTwo);
      
      console.log(JSON.stringify({ 
        dieOne: roll.dieOne,
        dieTwo: roll.dieTwo,
        total: roll.total,
        txId: rollTx.public.txId
      }));
    } else {
      console.error(JSON.stringify({ error: `Unknown command: ${command}` }));
      process.exit(1);
    }
  } catch(e: any) {
    console.error(JSON.stringify({ error: e.message || String(e) }));
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
