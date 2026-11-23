export const GIFT_ACCOUNT_SIDES = { groom: '신랑측', bride: '신부측' };
export const EMPTY_GIFT_ACCOUNT = { bank: '', holder: '', number: '', confirmed: false };

export function getKakaoPaySendUrl(value) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  return /^https:\/\/qr\.kakaopay\.com\/[a-z0-9_-]+\/?$/i.test(url) ? url : null;
}

// Publication is an explicit editorial choice, never inferred from sample data.
export function getPublishedAccount(account) {
  if (account?.confirmed !== true) return null;
  const { bank, holder, number } = account;
  if (![bank, holder, number].every((value) => typeof value === 'string' && value.trim()))
    return null;
  if (/○|임시|샘플|테스트|예시|placeholder|sample/i.test(`${bank} ${holder} ${number}`))
    return null;
  if (!/^[\d\s-]+$/.test(number)) return null;
  const digits = number.replace(/\D/g, '');
  if (digits.length < 6 || /^(\d)\1+$/.test(digits)) return null;
  const kakaoPayUrl = getKakaoPaySendUrl(account.kakaoPayUrl);
  return {
    bank: bank.trim(),
    holder: holder.trim(),
    number: number.trim(),
    ...(kakaoPayUrl && { kakaoPayUrl }),
  };
}

export function getPublishedAccounts(accounts) {
  const entries = Array.isArray(accounts) ? accounts : [accounts];
  return entries.filter(getPublishedAccount);
}

export function hasPublishedAccounts(accounts) {
  return Object.keys(GIFT_ACCOUNT_SIDES).some(
    (side) => getPublishedAccounts(accounts?.[side]).length > 0,
  );
}

export async function copyGiftAccount(account, clipboard = globalThis.navigator?.clipboard) {
  const published = getPublishedAccount(account);
  if (!published) return '';
  try {
    await clipboard.writeText(published.number);
    return '계좌번호를 복사했습니다.';
  } catch {
    return '복사하지 못했습니다. 계좌번호를 길게 누르거나 선택해서 복사해 주세요.';
  }
}
