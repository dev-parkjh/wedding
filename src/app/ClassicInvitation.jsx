import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import InvitationIcon from '../shared/InvitationIcon.jsx';
import { useWedding } from '../content/WeddingContentContext.jsx';
import ContactSection from './ContactSection.jsx';
import GiftSection from './GiftSection.jsx';
import { hasPublishedAccounts } from '../features/details/accounts.js';
import {
  CLASSIC_TEXT_SIZE_OPTIONS,
  CLASSIC_TEXT_SIZE_STORAGE_KEY,
  createClassicInviteUrl,
  readClassicTextSizePreference,
  resolveClassicTextSize,
} from './classicTextSize.js';
import ClassicVenueMap from './ClassicVenueMap.jsx';
import coupleWebp from './assets/classic-couple-illustration.webp';
import couplePng from './assets/classic-couple-illustration.png';
import './classicInvitation.css';

function saveTextSize(value) {
  try {
    globalThis.localStorage?.setItem(CLASSIC_TEXT_SIZE_STORAGE_KEY, value);
  } catch {
    // The URL remains the source of truth when storage is unavailable.
  }
}

function getCurrentSearch() {
  return typeof window === 'undefined' ? '' : window.location.search;
}

function getCurrentShareUrl(textSize) {
  if (typeof window === 'undefined') return '';
  return createClassicInviteUrl(window.location.href, textSize);
}

function replaceTextSizeInUrl(textSize) {
  if (typeof window === 'undefined') return;
  const url = new URL(createClassicInviteUrl(window.location.href, textSize));
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
}

const CLASSIC_REVEAL_SELECTOR = [
  '.classic-summary h1',
  '.classic-summary-statement',
  '.classic-couple-picture',
  '.classic-summary-details',
  '.classic-primary-actions',
  '.classic-greeting .classic-content',
  '.classic-heading-with-icon',
  '.classic-location-summary',
  '.classic-venue-map',
  '.classic-map-links',
  '.classic-directions',
  '.invitation-contact-inner',
  '.classic-gift .classic-content',
].join(',');

function CouplePicture() {
  const [loading, setLoading] = useState(true);
  const finishLoading = () => setLoading(false);

  return (
    <picture className="classic-couple-picture" data-classic-image-loading={loading}>
      <source srcSet={coupleWebp} type="image/webp" />
      <img
        src={couplePng}
        width={706}
        height={887}
        alt="꽃을 든 신랑과 신부 일러스트"
        loading="eager"
        fetchPriority="high"
        onLoad={finishLoading}
        onError={finishLoading}
      />
    </picture>
  );
}

function ActionLink({ className = '', href, children, ...props }) {
  return (
    <a className={`classic-action-link ${className}`.trim()} href={href} {...props}>
      {children}
    </a>
  );
}

function ClassicIcon({ name, className = '' }) {
  return <InvitationIcon name={name} className={`classic-icon ${className}`.trim()} />;
}

function Lines({ value }) {
  return String(value || '')
    .split('\n')
    .map((line, index, lines) => (
      <React.Fragment key={`${line}-${index}`}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
}

export default function ClassicInvitation({ archived }) {
  const wedding = useWedding();
  const invitationRef = useRef(null);
  const [textSize, setTextSize] = useState(() =>
    resolveClassicTextSize({
      search: getCurrentSearch(),
      storedValue: readClassicTextSizePreference(),
    }),
  );
  const [copyStatus, setCopyStatus] = useState('idle');
  const shareUrl = useMemo(() => getCurrentShareUrl(textSize), [textSize]);

  useLayoutEffect(() => {
    replaceTextSizeInUrl(textSize);
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    const root = invitationRef.current;
    const view = root?.ownerDocument?.defaultView;
    const reduceMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!root || !view?.IntersectionObserver || reduceMotion) return undefined;

    const targets = Array.from(root.querySelectorAll(CLASSIC_REVEAL_SELECTOR));
    targets.forEach((target) => target.setAttribute('data-classic-reveal', 'waiting'));
    root.setAttribute('data-reveal-ready', 'true');

    const observer = new view.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-classic-reveal', 'visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
    );

    const revealFocusedGroup = (event) => {
      const target = event.target.closest?.('[data-classic-reveal="waiting"]');
      if (!target) return;
      target.setAttribute('data-classic-reveal', 'visible');
      observer.unobserve(target);
    };

    targets.forEach((target) => observer.observe(target));
    root.addEventListener('focusin', revealFocusedGroup);

    return () => {
      observer.disconnect();
      root.removeEventListener('focusin', revealFocusedGroup);
      root.removeAttribute('data-reveal-ready');
      targets.forEach((target) => target.removeAttribute('data-classic-reveal'));
    };
  }, [archived]);

  const families = [
    { ...wedding.groomParents, child: wedding.groom },
    { ...wedding.brideParents, child: wedding.bride },
  ];
  const showGift = hasPublishedAccounts(wedding.accounts);

  const changeTextSize = (value) => {
    setTextSize(value);
    setCopyStatus('idle');
    saveTextSize(value);
    replaceTextSizeInUrl(value);
  };

  const copyShareLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  };

  return (
    <main ref={invitationRef} className="classic-invitation" data-text-size={textSize}>
      <header className="classic-summary" aria-labelledby="classic-title">
        <p className="classic-summary-statement">결혼합니다</p>
        <h1 id="classic-title">
          {wedding.groom} <span aria-hidden="true">·</span> {wedding.bride}
        </h1>
        <div className="classic-photo">
          <CouplePicture />
        </div>
        <div className="classic-summary-details">
          <div className="classic-summary-detail">
            <span className="classic-summary-icon" aria-hidden="true">
              <ClassicIcon name="calendar" />
            </span>
            <time className="classic-summary-date" dateTime={wedding.dateISO}>
              <span>{wedding.dateText}</span>
              <span>{wedding.timeText}</span>
            </time>
          </div>
          <div className="classic-summary-detail">
            <span className="classic-summary-icon" aria-hidden="true">
              <ClassicIcon name="location" />
            </span>
            <p className="classic-summary-venue">
              <strong>
                {wedding.venue} · {wedding.floor} {wedding.hall}
              </strong>
            </p>
          </div>
        </div>
        <div className="classic-primary-actions" aria-label="예식 정보 바로가기">
          <ActionLink className="is-primary" href="#classic-location">
            <ClassicIcon name="map" className="classic-action-icon" />
            오시는 길 확인하기
          </ActionLink>
        </div>
      </header>

      <section
        className="classic-section classic-greeting"
        aria-labelledby="classic-greeting-title"
      >
        <div className="classic-content">
          <h2 id="classic-greeting-title">
            <Lines value={wedding.invitation.title} />
          </h2>
          <p>
            <Lines value={wedding.invitation.message} />
          </p>
          <div className="classic-family" aria-label="신랑 신부 가족 소개">
            {families.map(({ father, mother, relation, child }) => (
              <p key={child}>
                <span>
                  {father} · {mother}
                </span>
                <span>
                  의 {relation} <strong>{child}</strong>
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section
        id="classic-location"
        className="classic-section classic-location"
        aria-labelledby="classic-location-title"
      >
        <div className="classic-content">
          <h2 id="classic-location-title" className="classic-heading-with-icon">
            <span className="classic-heading-icon" aria-hidden="true">
              <ClassicIcon name="location" />
            </span>
            오시는 길
          </h2>
          <div className="classic-location-summary">
            <p className="classic-venue-name">
              {wedding.venue} · {wedding.floor} {wedding.hall}
            </p>
            <address>
              {wedding.address}
              <br />
              {wedding.addressDetail}
            </address>
          </div>
          <ClassicVenueMap />
          <div className="classic-map-links" aria-label="지도에서 예식장 보기">
            <ActionLink
              className="is-primary"
              href={wedding.mapNaverUrl}
              target="_blank"
              rel="noreferrer"
            >
              네이버 지도에서 보기
              <ClassicIcon name="external" className="classic-link-icon" />
            </ActionLink>
            <ActionLink href={wedding.mapKakaoUrl} target="_blank" rel="noreferrer">
              카카오맵에서 보기
              <ClassicIcon name="external" className="classic-link-icon" />
            </ActionLink>
          </div>
          <div className="classic-directions">
            <article className="classic-direction-item">
              <span className="classic-direction-icon" aria-hidden="true">
                <ClassicIcon name="subway" />
              </span>
              <div>
                <h3>지하철로 오실 때</h3>
                <p>
                  <strong>{wedding.transport.subway.primary}</strong>
                  <br />
                  {wedding.transport.subway.detail}
                </p>
              </div>
            </article>
            <article className="classic-direction-item">
              <span className="classic-direction-icon" aria-hidden="true">
                <ClassicIcon name="car" />
              </span>
              <div>
                <h3>자동차로 오실 때</h3>
                <p>
                  <strong>{wedding.transport.car.primary}</strong>
                  <br />
                  {wedding.transport.car.detail}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <ContactSection />

      {showGift && (
        <section
          id="classic-gift"
          className="classic-section classic-gift"
          aria-labelledby="classic-gift-title"
        >
          <div className="classic-content">
            <h2 id="classic-gift-title">마음 전하실 곳</h2>
            <GiftSection copyIcon={<ClassicIcon name="copy" className="classic-button-icon" />} />
          </div>
        </section>
      )}

      {archived && (
        <section className="classic-closing" aria-labelledby="classic-closing-message">
          <div className="classic-closing-inner">
            <p id="classic-closing-message">함께해 주셔서 감사합니다.</p>
          </div>
        </section>
      )}

      <footer className="classic-footer" aria-label="초대장 공유와 보기 설정">
        <div className="classic-footer-inner">
          <div className="classic-text-size-options" role="group" aria-label="글자 크기 선택">
            {CLASSIC_TEXT_SIZE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                data-size={value}
                aria-pressed={textSize === value}
                onClick={() => changeTextSize(value)}
              >
                <span className="classic-text-size-preview" aria-hidden="true">
                  Aa
                </span>
                <span className="classic-text-size-label">{label}</span>
              </button>
            ))}
          </div>
          <div className="classic-footer-actions">
            <button type="button" className="classic-share-button" onClick={copyShareLink}>
              <ClassicIcon name="send" className="classic-button-icon" />
              <span>소식 전달하기</span>
            </button>
          </div>
          <div className="classic-share-feedback" data-open={copyStatus !== 'idle'}>
            <div className="classic-share-feedback-content">
              <p className="classic-share-status" role="status" aria-live="polite">
                {copyStatus === 'success' ? '초대장 링크를 복사했습니다.' : ''}
                {copyStatus === 'error'
                  ? '링크를 복사하지 못했습니다. 아래 주소를 직접 선택해 복사해 주세요.'
                  : ''}
              </p>
              {copyStatus === 'error' && (
                <label className="classic-share-fallback">
                  공유 주소
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
