import { getPublishedAccount } from '../src/features/details/accounts.js';
import { getPublishedPhone } from '../src/features/details/contacts.js';

function cleanText(value, label, maximum, { multiline = false } = {}) {
  if (typeof value !== 'string') throw new Error(`${label}을(를) 확인해 주세요.`);
  const clean = value.trim();
  const controls = multiline
    ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/
    : /[\u0000-\u001f\u007f]/;
  if (!clean || Array.from(clean).length > maximum || controls.test(clean)) {
    throw new Error(`${label}은(는) ${maximum}자 이내로 입력해 주세요.`);
  }
  return clean;
}

function cleanUrl(value, label) {
  const clean = cleanText(value, label, 500);
  let url;
  try {
    url = new URL(clean);
  } catch {
    throw new Error(`${label}은(는) https://로 시작하는 주소로 입력해 주세요.`);
  }
  if (url.protocol !== 'https:') throw new Error(`${label}은(는) https://로 시작해야 합니다.`);
  return url.href;
}

function cleanDate(value) {
  const clean = cleanText(value, '예식 날짜', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) throw new Error('예식 날짜를 확인해 주세요.');
  const date = new Date(`${clean}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== clean)
    throw new Error('존재하는 날짜를 입력해 주세요.');
  return clean;
}

function cleanTime(value) {
  const clean = cleanText(value, '예식 시간', 5);
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(clean)) throw new Error('예식 시간을 확인해 주세요.');
  return clean;
}

export function getPublicWeddingContent(source) {
  const side = (name, label) => ({
    father: cleanText(source.families[name].father, `${label} 아버지 성함`, 40),
    mother: cleanText(source.families[name].mother, `${label} 어머니 성함`, 40),
    relation: cleanText(source.families[name].relation, `${label} 관계`, 20),
  });
  const contact = (name) => {
    const number = getPublishedPhone(source.contacts[name]);
    return number ? { number, confirmed: true } : { number: '', confirmed: false };
  };
  const accounts = (name) => {
    const entries = source.accounts[name];
    return (Array.isArray(entries) ? entries : [entries])
      .map(getPublishedAccount)
      .filter(Boolean)
      .map((account) => ({ ...account, confirmed: true }));
  };
  const transport = (name, label) => ({
    title: cleanText(source.transport[name].title, `${label} 제목`, 30),
    primary: cleanText(source.transport[name].primary, `${label} 주요 안내`, 100),
    detail: cleanText(source.transport[name].detail, `${label} 상세 안내`, 220),
  });
  return {
    couple: {
      groom: cleanText(source.couple.groom, '신랑 성함', 40),
      bride: cleanText(source.couple.bride, '신부 성함', 40),
    },
    families: { groom: side('groom', '신랑측'), bride: side('bride', '신부측') },
    ceremony: { date: cleanDate(source.ceremony.date), time: cleanTime(source.ceremony.time) },
    venue: {
      name: cleanText(source.venue.name, '예식장명', 80),
      hall: cleanText(source.venue.hall, '홀명', 80),
      floor: cleanText(source.venue.floor, '층 정보', 30),
      address: cleanText(source.venue.address, '주소', 160),
      addressDetail: cleanText(source.venue.addressDetail, '상세 주소', 120),
      mapNaverUrl: cleanUrl(source.venue.mapNaverUrl, '네이버 지도 주소'),
      mapKakaoUrl: cleanUrl(source.venue.mapKakaoUrl, '카카오맵 주소'),
      venueUrl: cleanUrl(source.venue.venueUrl, '예식장 홈페이지 주소'),
    },
    invitation: {
      title: cleanText(source.invitation.title, '초대 인사 제목', 160, { multiline: true }),
      message: cleanText(source.invitation.message, '초대 인사 본문', 240, { multiline: true }),
    },
    transport: { subway: transport('subway', '지하철'), car: transport('car', '자동차') },
    contacts: { groom: contact('groom'), bride: contact('bride') },
    accounts: { groom: accounts('groom'), bride: accounts('bride') },
  };
}
