import { defineConfig } from 'vite';
import { getPublicWeddingContent } from './scripts/public-content.mjs';
import { createWedding } from './src/content/wedding.js';
import savedContent from './src/content/wedding.json';

const content = getPublicWeddingContent(savedContent);
const wedding = createWedding(content);
const title = `${wedding.groom} · ${wedding.bride}, 결혼합니다`;
const when = `${wedding.dateText} ${wedding.timeText}`;
const where = `${wedding.venue} ${wedding.floor} ${wedding.hall}`;
const escapeText = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

export default defineConfig({
  base: './',
  define: {
    __WEDDING_CONTENT__: JSON.stringify(content),
  },
  plugins: [
    {
      name: 'invitation-metadata',
      transformIndexHtml(html) {
        return {
          html: html.replace('<title>청첩장</title>', () => `<title>${escapeText(title)}</title>`),
          tags: [
            {
              tag: 'meta',
              attrs: {
                name: 'description',
                content: escapeText(`${title}. ${when}, ${where}. 소중한 날, 함께해 주세요.`),
              },
            },
            { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
            { tag: 'meta', attrs: { property: 'og:locale', content: 'ko_KR' } },
            { tag: 'meta', attrs: { property: 'og:title', content: escapeText(title) } },
            {
              tag: 'meta',
              attrs: {
                property: 'og:description',
                content: escapeText(`${when} · ${where}. 저희의 새로운 시작에 초대합니다.`),
              },
            },
          ],
        };
      },
    },
  ],
});
