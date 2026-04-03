import { Command } from 'commander';
import kleur from 'kleur';
import * as fs from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';

import { 
  createWallet, 
  createProviders, 
  compiledContract, 
  generateSecret,
  rollDice
} from './diceroll-utils.js';

const program = new Command();

program
  .name('mn-diceroll')
  .description('On-chain dice rolls on Midnight');

program
  .command('roll')
  .description('Roll a pair of dice')
  .option('-v, --verbose', 'Show raw secret and roll derivation details')
  .action(async (options) => {
    console.log(kleur.magenta('\n🎲 Midnight Dice Roll\n'));

    if (!fs.existsSync('deployment.json')) {
      console.error(kleur.red('❌ No deployment.json found! Run `npm run deploy` first.\n'));
      process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    const rl = createInterface({ input: stdin, output: stdout });

    try {
      const seed = await rl.question(kleur.cyan('  Enter your wallet seed: '));
      console.log(kleur.yellow('\n  Connecting to Midnight Preprod...'));
      const walletCtx = await createWallet(seed.trim());
      
      console.log(kleur.yellow('  Syncing wallet...'));
      await walletCtx.wallet.waitForSyncedState();
      
      const providers = await createProviders(walletCtx);
      const contract = await findDeployedContract(providers, {
        contractAddress: deployment.contractAddress,
        compiledContract,
      });

      console.log(kleur.green('  Connected! Ready to roll.\n'));

      let rollAgain = true;
      while (rollAgain) {
        console.log(kleur.cyan('🎲 Rolling dice...'));
        const secret = generateSecret();
        const roll = rollDice(secret);
        
        if (options.verbose) {
          console.log(kleur.gray(`   Secret: 0x${secret.toString('hex')}`));
          console.log(kleur.gray(`   Die One: ${roll.dieOne}`));
          console.log(kleur.gray(`   Die Two: ${roll.dieTwo}`));
        }

        const rollTx = await contract.callTx.roll_dice(roll.dieOne, roll.dieTwo);
        console.log(kleur.green('  ✅ Roll recorded on-chain.'));
        if (options.verbose) console.log(kleur.gray(`     Tx: ${rollTx.public.txId}`));

        console.log(kleur.magenta('\n─────────────────────────────────────────────────────────────────'));
        console.log(`🎯 Result: ${kleur.bold(`${roll.dieOne} + ${roll.dieTwo} = ${roll.total}`)}`);
        console.log(kleur.magenta('─────────────────────────────────────────────────────────────────'));

        const replayInput = await rl.question(kleur.yellow('\nRoll again? (y/n) \n> '));
        rollAgain = replayInput.toLowerCase().startsWith('y');
        if (rollAgain) {
          console.log(kleur.magenta('\n─────────────────────────────────────────────────────────────────\n'));
        }
      }

    } catch (e) {
      console.error(kleur.red(`\n❌ Error: ${e instanceof Error ? e.message : e}\n`));
    } finally {
      console.log(kleur.magenta('\nThanks for rolling! 👋\n'));
      rl.close();
      process.exit(0);
    }
  });

program.parse();
