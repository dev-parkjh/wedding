const timeZone = 'Asia/Seoul';
const koreanWeekday = new Intl.DateTimeFormat('ko-KR', { timeZone, weekday: 'long' });
const koreanDate = new Intl.DateTimeFormat('en-CA', {
  timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function createWedding(content) {
  const { accounts, ceremony, contacts, couple, families, invitation, transport, venue } = content;
  const [year, month, day] = ceremony.date.split('-').map(Number);
  const [hour, minute] = ceremony.time.split(':');
  const hours = Number(hour);
  const dateISO = `${ceremony.date}T${ceremony.time}:00+09:00`;
  const weekday = koreanWeekday.format(new Date(dateISO));

  return {
    ...couple,
    groomParents: families.groom,
    brideParents: families.bride,
    contacts,
    accounts,
    invitation,
    transport,
    dateISO,
    dateText: `${year}년 ${month}월 ${day}일 ${weekday}`,
    timeText: `${hours < 12 ? '오전' : '오후'} ${hours % 12 || 12}시 ${minute}분`,
    venue: venue.name,
    hall: venue.hall,
    floor: venue.floor,
    address: venue.address,
    addressDetail: venue.addressDetail,
    mapNaverUrl: venue.mapNaverUrl,
    mapKakaoUrl: venue.mapKakaoUrl,
  };
}

export function isAfterWeddingDay(ceremonyDate, now = new Date()) {
  const parts = Object.fromEntries(
    koreanDate.formatToParts(now).map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}` > ceremonyDate;
}
