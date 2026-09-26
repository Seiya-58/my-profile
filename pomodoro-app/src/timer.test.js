import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DURATIONS, initialState, timerReducer as reduce } from './timer.js';

test('start, countdown, pause, and resume retain remaining time', () => {
  let state = reduce(initialState, { type: 'start', now: 1000 });
  state = reduce(state, { type: 'tick', now: 11000 });
  assert.equal(state.remaining, 1490);
  state = reduce(state, { type: 'pause', now: 12000 });
  assert.equal(state.remaining, 1489);
  assert.equal(state.running, false);
  assert.deepEqual(reduce(state, { type: 'tick', now: 9999999 }), state);
  state = reduce(state, { type: 'start', now: 20000 });
  assert.equal(state.deadline, 20000 + 1489 * 1000);
});

test('delayed completion switches once and waits; breaks do not count', () => {
  let state = reduce(initialState, { type: 'start', now: 0 });
  state = reduce(state, { type: 'tick', now: 2000000 });
  assert.equal(state.mode, 'break');
  assert.equal(state.remaining, DURATIONS.break);
  assert.equal(state.completed, 1);
  assert.equal(state.running, false);
  assert.ok(state.message);
  assert.deepEqual(reduce(state, { type: 'tick', now: 2000001 }), state);
  state = reduce(state, { type: 'start', now: 2000000 });
  state = reduce(state, { type: 'tick', now: 2300000 });
  assert.equal(state.mode, 'work');
  assert.equal(state.completed, 1);
  assert.equal(state.running, false);
});

test('reset and manual switching stop the timer without completing work', () => {
  let state = reduce(initialState, { type: 'start', now: 0 });
  state = reduce(state, { type: 'tick', now: 10000 });
  state = reduce(state, { type: 'reset' });
  assert.deepEqual(state, initialState);
  state = reduce(state, { type: 'start', now: 0 });
  state = reduce(state, { type: 'switch', mode: 'break' });
  assert.equal(state.running, false);
  assert.equal(state.remaining, 300);
  assert.equal(state.completed, 0);
});

test('pause at the deadline completes work and countdown never goes negative', () => {
  const running = reduce(initialState, { type: 'start', now: 0 });
  const state = reduce(running, { type: 'pause', now: 1500000 });
  assert.equal(state.completed, 1);
  assert.equal(state.mode, 'break');
  assert.equal(state.remaining, 300);
});
