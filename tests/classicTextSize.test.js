import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createClassicInviteUrl,
  getClassicTextSizeFromSearch,
  readClassicTextSizePreference,
  resolveClassicTextSize,
} from '../src/app/classicTextSize.js';

test('a valid URL setting wins over storage and the large route default', () => {
  assert.equal(resolveClassicTextSize({ search: '?text=xlarge', storedValue: 'normal' }), 'xlarge');
  assert.equal(resolveClassicTextSize({ search: '?text=large', storedValue: 'normal' }), 'large');
});

test('invalid URL and storage settings fall through safely', () => {
  assert.equal(resolveClassicTextSize({ search: '?text=huge', storedValue: 'normal' }), 'normal');
  assert.equal(resolveClassicTextSize({ search: '?text=huge', storedValue: 'tiny' }), 'large');
  assert.equal(getClassicTextSizeFromSearch('?text=huge'), null);
});

test('a shared invitation URL preserves the Pages path and the selected text size', () => {
  assert.equal(
    createClassicInviteUrl(
      'https://example.github.io/wedding-invitation-standard/?source=family#classic-location',
      'xlarge',
    ),
    'https://example.github.io/wedding-invitation-standard/?source=family&text=xlarge',
  );
});

test('blocked storage is ignored without preventing URL or default resolution', () => {
  const blockedStorage = {
    getItem() {
      throw new DOMException('Blocked', 'SecurityError');
    },
  };
  assert.equal(readClassicTextSizePreference(blockedStorage), null);
  assert.equal(
    resolveClassicTextSize({
      search: '?text=xlarge',
      storedValue: readClassicTextSizePreference(blockedStorage),
    }),
    'xlarge',
  );
});
