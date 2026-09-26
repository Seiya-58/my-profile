import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDarkTime, parseTasks, mergeTasks } from './preferences.js';

test('local time switches at 17:00 and resets at midnight', () => {
  assert.equal(isDarkTime(new Date(2026, 8, 23, 16, 59, 59)), false);
  assert.equal(isDarkTime(new Date(2026, 8, 23, 17)), true);
  assert.equal(isDarkTime(new Date(2026, 8, 23, 23, 59, 59)), true);
  assert.equal(isDarkTime(new Date(2026, 8, 24, 0)), false);
});

test('task import validates data and merges without losing existing tasks', () => {
  const current = [{ id: 1, text: '既存', done: false }];
  const imported = parseTasks('[{"id":"1","text":"重複","done":true},{"id":2,"text":"追加","done":false}]');
  assert.deepEqual(mergeTasks(current, imported), [...current, imported[1]]);
  assert.equal(current.length, 1);
  assert.deepEqual(parseTasks(null), []);
  for (const invalid of ['{}', 'null', '[null]', '[{"id":1}]', 'invalid']) {
    assert.throws(() => parseTasks(invalid));
  }
});
