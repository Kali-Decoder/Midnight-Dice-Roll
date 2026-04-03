import { test } from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';
import { generateSecret, rollDice } from '../diceroll-utils.js';

function chiSquaredDice(counts: number[]): number {
  const n = counts.reduce((sum, v) => sum + v, 0);
  const expected = n / counts.length;
  return counts.reduce((acc, v) => acc + Math.pow(v - expected, 2) / expected, 0);
}

// ─── Secret generation ──────────────────────────────────────────────────────

test('Secret: output is exactly 32 bytes', () => {
  for (let i = 0; i < 100; i++) {
    const s = generateSecret();
    assert.strictEqual(
      s.length, 32,
      `Expected 32 bytes, got ${s.length} on iteration ${i}`
    );
  }
});

test('Secret: is a Buffer (not string, not Uint8Array subclass tricks)', () => {
  const s = generateSecret();
  assert.ok(Buffer.isBuffer(s), 'generateSecret must return a Buffer');
});

test('Secret: no two outputs are equal (10 000 samples)', () => {
  const seen = new Set<string>();
  for (let i = 0; i < 10_000; i++) {
    const hex = generateSecret().toString('hex');
    assert.ok(!seen.has(hex), `Collision at iteration ${i}: ${hex}`);
    seen.add(hex);
  }
});

// ─── Dice roll derivation ───────────────────────────────────────────────────

test('Roll: die values are within 1-6 and total is 2-12', () => {
  for (let i = 0; i < 1000; i++) {
    const roll = rollDice(generateSecret());
    assert.ok(roll.dieOne >= 1 && roll.dieOne <= 6, `dieOne out of range: ${roll.dieOne}`);
    assert.ok(roll.dieTwo >= 1 && roll.dieTwo <= 6, `dieTwo out of range: ${roll.dieTwo}`);
    assert.ok(roll.total >= 2 && roll.total <= 12, `total out of range: ${roll.total}`);
    assert.strictEqual(roll.total, roll.dieOne + roll.dieTwo, 'total must equal dieOne + dieTwo');
  }
});

test('Roll: deterministic for the same secret', () => {
  const secret = crypto.randomBytes(32);
  const rollA = rollDice(secret);
  const rollB = rollDice(secret);
  assert.deepStrictEqual(rollA, rollB, 'Rolls from the same secret should match');
});

test('Roll: distribution sanity check (chi-squared)', () => {
  const countsOne = new Array(6).fill(0);
  const countsTwo = new Array(6).fill(0);
  const N = 6000;

  for (let i = 0; i < N; i++) {
    const roll = rollDice(generateSecret());
    countsOne[roll.dieOne - 1] += 1;
    countsTwo[roll.dieTwo - 1] += 1;
  }

  const chiOne = chiSquaredDice(countsOne);
  const chiTwo = chiSquaredDice(countsTwo);

  // 5 degrees of freedom: chi^2 < ~20 is a loose sanity bound
  assert.ok(chiOne < 20, `Die one distribution looks off (chi^2=${chiOne.toFixed(2)})`);
  assert.ok(chiTwo < 20, `Die two distribution looks off (chi^2=${chiTwo.toFixed(2)})`);
});
