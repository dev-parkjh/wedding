import React, { useEffect, useId, useRef, useState } from 'react';
import InvitationIcon from '../shared/InvitationIcon.jsx';
import { useWedding } from '../content/WeddingContentContext.jsx';
import {
  copyGiftAccount,
  getPublishedAccount,
  getPublishedAccounts,
  GIFT_ACCOUNT_SIDES,
} from '../features/details/accounts.js';
import './gift.css';

export function GiftAccount({ account, label, role = '예금주', copyIcon = null }) {
  const [status, setStatus] = useState('');
  const [copying, setCopying] = useState(false);
  const requestRef = useRef(0);
  const statusTimerRef = useRef(null);
  const displayed = getPublishedAccount(account);

  useEffect(
    () => () => {
      requestRef.current += 1;
      clearTimeout(statusTimerRef.current);
    },
    [account],
  );

  if (!displayed) return null;

  const copy = async () => {
    if (copying) return;
    const request = ++requestRef.current;
    clearTimeout(statusTimerRef.current);
    setCopying(true);
    setStatus('');
    const message = await copyGiftAccount(account);
    if (request !== requestRef.current) return;
    setCopying(false);
    setStatus(message);
    if (message === '계좌번호를 복사했습니다.') {
      statusTimerRef.current = setTimeout(() => setStatus(''), 1800);
    }
  };

  return (
    <article className="gift-account">
      <span className="gift-account-role">{role}</span>
      <div className="gift-account-owner">
        <span className="gift-account-holder">{displayed.holder}</span>
        <span className="gift-account-bank">{displayed.bank}</span>
      </div>
      <div className="gift-account-transfer">
        <span className="gift-account-number">{displayed.number}</span>
        <div className="gift-account-actions">
          <button
            type="button"
            className="gift-copy"
            onClick={copy}
            aria-disabled={copying || undefined}
            aria-label={`${label} ${displayed.bank} ${displayed.holder} 계좌번호 복사`}
            title="계좌번호 복사"
          >
            {copyIcon ?? <InvitationIcon name="copy" className="gift-copy-icon" />}
            <span>복사</span>
          </button>
          {displayed.kakaoPayUrl && (
            <a
              className="gift-kakao-pay"
              href={displayed.kakaoPayUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${displayed.holder}에게 카카오페이로 송금`}
              title="카카오페이 송금"
            >
              <InvitationIcon name="message" fill="currentColor" />
              <span>pay</span>
            </a>
          )}
        </div>
      </div>
      <p className="gift-copy-status" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </article>
  );
}

function GiftAccountGroup({ side, label, entries, copyIcon }) {
  const wedding = useWedding();
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const role = side === 'groom' ? '신랑' : '신부';
  const parents = wedding[`${side}Parents`];
  const roles = new Map([
    [parents.father, `${role} 아버지`],
    [parents.mother, `${role} 어머니`],
    [wedding[side], role],
  ]);

  return (
    <div className="gift-account-group">
      <h3 className="gift-account-heading">
        <button
          type="button"
          className="gift-account-summary"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((current) => !current)}
        >
          {label}
        </button>
      </h3>
      <div
        id={panelId}
        className="gift-account-collapse"
        data-open={expanded}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="gift-account-list">
          {entries.map((account, index) => (
            <GiftAccount
              key={JSON.stringify([account.bank, account.holder, account.number, index])}
              account={account}
              label={label}
              role={roles.get(account.holder.trim())}
              copyIcon={copyIcon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GiftSection({ copyIcon = null }) {
  const wedding = useWedding();
  const groups = Object.entries(GIFT_ACCOUNT_SIDES)
    .map(([side, label]) => ({
      side,
      label,
      entries: getPublishedAccounts(wedding.accounts[side]),
    }))
    .filter(({ entries }) => entries.length);
  if (!groups.length) return null;

  return (
    <div className="gift-details">
      <div className="gift-note">
        <p className="gift-intro">참석이 어려운 분들께 계좌를 안내드립니다.</p>
        <p className="gift-message">함께 축하해 주시는 마음만으로도 큰 기쁨입니다.</p>
      </div>
      <div className="gift-accounts">
        {groups.map(({ side, label, entries }) => (
          <GiftAccountGroup
            key={side}
            side={side}
            label={label}
            entries={entries}
            copyIcon={copyIcon}
          />
        ))}
      </div>
    </div>
  );
}
