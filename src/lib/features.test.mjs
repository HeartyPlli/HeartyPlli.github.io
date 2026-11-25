import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBudget, toCentavos, totalCost } from './budget.js';
import { createGame, moveRabbit, stepGame } from './snackGame.js';

test('peso arithmetic stays exact, including quantities and overspending', () => {
  const budget = toCentavos('1000.00');
  const items = [{ price: toCentavos('12.35'), quantity: 3 }, { price: toCentavos('0.10'), quantity: 7 }];
  assert.equal(totalCost(items), 3775);
  assert.equal(budget - totalCost(items), 96225);
  assert.equal(toCentavos('20') - totalCost(items), -1775);
  assert.equal(toCentavos('0'), 0);
  assert.throws(() => totalCost(Array.from({ length: 500 }, () => ({ price: 100000000000, quantity: 9999 }))));
});

test('invalid prices and malformed saved records are rejected', () => {
  for (const price of ['-1', 'NaN', 'Infinity', '1.001', '', '1e7', '1000000001']) assert.throws(() => toCentavos(price));
  assert.deepEqual(parseBudget(null), { budget: 0, items: [] });
  assert.throws(() => parseBudget('{oops'));
  assert.throws(() => parseBudget(JSON.stringify({ budget: 100, items: [{ quantity: -1 }] })));
  const item = { id: 'a', name: 'Books', quantity: 2, price: 4500, kind: 'need', bought: false };
  const data = { budget: 100000, items: [item] };
  assert.deepEqual(parseBudget(JSON.stringify(data)), data);
  assert.throws(() => parseBudget(JSON.stringify({ ...data, items: [item, item] })));
});

test('food scores once, bombs remove a heart, misses cost nothing', () => {
  const game = { ...createGame(), status: 'playing', spawnIn: 100 };
  game.items = [{ type: 'strawberry', x: 160, y: 179 }, { type: 'candy', x: 160, y: 179 }];
  stepGame(game, 0.016);
  assert.equal(game.score, 2);
  assert.equal(game.items.length, 0);
  stepGame(game, 0.016);
  assert.equal(game.score, 2);
  game.items = [{ type: 'bomb', x: 160, y: 179 }, { type: 'strawberry', x: 20, y: 240 }];
  stepGame(game, 0.016);
  assert.equal(game.lives, 2);
  assert.equal(game.score, 2);
  assert.equal(game.items.length, 0);
});

test('game pauses, clamps movement, ends, and resets cleanly', () => {
  const game = { ...createGame(), status: 'paused' };
  stepGame(game, 0.05, 1);
  assert.equal(game.remaining, 30);
  assert.equal(game.rabbit, 160);
  moveRabbit(game, -999); assert.equal(game.rabbit, 22);
  moveRabbit(game, 999); assert.equal(game.rabbit, 298);
  game.status = 'playing'; game.remaining = 0.01;
  stepGame(game, 0.02);
  assert.equal(game.status, 'done');
  const lastHeart = { ...createGame(), status: 'playing', lives: 1, items: [{ type: 'bomb', x: 160, y: 180 }] };
  stepGame(lastHeart, 0.016);
  assert.equal(lastHeart.status, 'done');
  assert.equal(lastHeart.lives, 0);
  assert.equal(createGame().score, 0);
});

test('only the three requested types spawn', () => {
  for (const [roll, expected] of [[0, 'strawberry'], [0.5, 'candy'], [0.9, 'bomb']]) {
    const game = { ...createGame(), status: 'playing', spawnIn: 0 };
    stepGame(game, 0.01, 0, () => roll);
    assert.equal(game.items[0].type, expected);
  }
});
