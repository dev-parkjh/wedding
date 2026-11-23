export const CLASSIC_TEXT_SIZE_STORAGE_KEY = 'wedding-classic-text-size-v1';
export const DEFAULT_CLASSIC_TEXT_SIZE = 'large';

export const CLASSIC_TEXT_SIZE_OPTIONS = Object.freeze([
  Object.freeze({ value: 'normal', label: '작게' }),
  Object.freeze({ value: 'large', label: '보통' }),
  Object.freeze({ value: 'xlarge', label: '크게' }),
]);

const CLASSIC_TEXT_SIZES = new Set(CLASSIC_TEXT_SIZE_OPTIONS.map(({ value }) => value));

export function isClassicTextSize(value) {
  return CLASSIC_TEXT_SIZES.has(value);
}

export function getClassicTextSizeFromSearch(search = '') {
  const value = new URLSearchParams(search).get('text');
  return isClassicTextSize(value) ? value : null;
}

export function readClassicTextSizePreference(storage) {
  try {
    const source = storage === undefined ? globalThis.localStorage : storage;
    return source?.getItem(CLASSIC_TEXT_SIZE_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function resolveClassicTextSize({
  search = '',
  storedValue = null,
  defaultValue = DEFAULT_CLASSIC_TEXT_SIZE,
} = {}) {
  return (
    getClassicTextSizeFromSearch(search) ||
    (isClassicTextSize(storedValue) ? storedValue : null) ||
    (isClassicTextSize(defaultValue) ? defaultValue : DEFAULT_CLASSIC_TEXT_SIZE)
  );
}

export function createClassicInviteUrl(href, textSize) {
  const url = new URL(href);
  url.searchParams.set('text', isClassicTextSize(textSize) ? textSize : DEFAULT_CLASSIC_TEXT_SIZE);
  url.hash = '';
  return url.href;
}
