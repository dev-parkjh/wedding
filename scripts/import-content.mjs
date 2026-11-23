import { randomUUID } from 'node:crypto';
import { readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { getPublicWeddingContent } from './public-content.mjs';

const statePath = process.argv[2];
if (!statePath) {
  throw new Error('사용법: npm run content:import -- <관리자 state.json 경로>');
}

const state = JSON.parse(await readFile(statePath, 'utf8'));
if (!state?.content) throw new Error('관리자 저장 파일에 예식 정보가 없습니다.');

const content = getPublicWeddingContent(state.content);
const output = new URL('../src/content/wedding.json', import.meta.url);
const temporary = new URL(`.wedding-${randomUUID()}.tmp`, output);
try {
  await writeFile(temporary, JSON.stringify(content, null, 2) + '\n', { flag: 'wx' });
  await rename(temporary, output);
} finally {
  await unlink(temporary).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}
console.log('공개용 예식 설정을 갱신했습니다.');
