import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getPublicWeddingContent } from '../scripts/public-content.mjs';
import { isAfterWeddingDay } from '../src/content/wedding.js';

const savedContent = JSON.parse(
  readFileSync(new URL('../src/content/wedding.json', import.meta.url), 'utf8'),
);

test('the snapshot contains only explicitly published contacts and accounts', () => {
  const publicAccount = {
    bank: '우리은행',
    holder: '홍길동',
    number: '123-456-789',
    confirmed: true,
    kakaoPayUrl: 'https://qr.kakaopay.com/example',
  };
  const content = getPublicWeddingContent({
    ...savedContent,
    internalNote: '초대장 외부용 메모',
    contacts: {
      groom: { number: '010-1234-5678', confirmed: false },
      bride: { number: '010-2345-6789', confirmed: true },
    },
    accounts: {
      groom: [
        { ...publicAccount, number: '987-654-321', confirmed: false },
        { ...publicAccount, number: '000-000-000', confirmed: true },
        { ...publicAccount, memo: '계좌 메모' },
      ],
      bride: { ...publicAccount, confirmed: 'false' },
    },
  });

  assert.equal('internalNote' in content, false);
  assert.deepEqual(content.contacts, {
    groom: { number: '', confirmed: false },
    bride: { number: '01023456789', confirmed: true },
  });
  assert.deepEqual(content.accounts, { groom: [publicAccount], bride: [] });
});

test('the archive opens at midnight the day after the ceremony in Korea', () => {
  assert.equal(isAfterWeddingDay('2027-02-14', new Date('2027-02-14T14:59:59Z')), false);
  assert.equal(isAfterWeddingDay('2027-02-14', new Date('2027-02-14T15:00:00Z')), true);
});
