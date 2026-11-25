import React from 'react';
import { SubwayIcon } from '../shared/InvitationIcon.jsx';
import weddingCityMark from './assets/wedding-city-mark.svg';

/** The venue pin stays southwest of the station, as in the supplied print map. */
export default function ClassicVenueMap() {
  return (
    <figure className="classic-venue-map">
      <svg
        viewBox="0 0 480 340"
        role="img"
        aria-labelledby="classic-venue-map-title classic-venue-map-description"
      >
        <title id="classic-venue-map-title">웨딩시티 신도림 약도</title>
        <desc id="classic-venue-map-description">
          경인로 아래 신도림역 3번 출구에서 왼쪽 아래에 신도림테크노마트 8층 웨딩시티가 있습니다.
          1·2호선 신도림역에서 테크노마트 지하 1층 연결 통로를 이용해 주세요.
        </desc>

        <rect className="classic-map-ground" width="480" height="340" />

        <g className="classic-map-road-secondary">
          <path d="M86 30V248" />
          <path d="M196 100V248" />
          <path d="M332 100V248" />
          <path d="M170 238H452" />
        </g>
        <path className="classic-map-road-primary" d="M28 100H452" />
        <path className="classic-map-railway" d="M28 174H452" />

        <g className="classic-map-directions" aria-hidden="true">
          <path d="m28 62-6 6 6 6m-6-6h16" />
          <text x="46" y="74">
            부천 · 인천
          </text>
          <path d="m446 62 6 6-6 6m6-6h-16" />
          <text x="424" y="74" textAnchor="end">
            여의도
          </text>
        </g>
        <text className="classic-map-road-label" x="252" y="82" textAnchor="middle">
          경인로
        </text>
        <text
          className="classic-map-road-label"
          x="65"
          y="190"
          textAnchor="middle"
          transform="rotate(-90 65 190)"
        >
          서부간선도로
        </text>

        <g className="classic-map-station" transform="translate(332 174) scale(.85)">
          <circle r="18" />
          <SubwayIcon x={-14} y={-14} size={28} aria-hidden="true" focusable="false" />
        </g>
        <text className="classic-map-station-label" x="356" y="164">
          신도림역
        </text>
        <text className="classic-map-exit-label" x="356" y="190">
          3번 출구
        </text>

        <g
          className="classic-map-venue-marker"
          transform="translate(270 235) scale(.8) translate(-270 -235)"
        >
          <path d="M270 172c-14 0-25 11-25 25 0 17 25 38 25 38s25-21 25-38c0-14-11-25-25-25Z" />
          <circle cx="270" cy="197" r="17" />
          <image href={weddingCityMark} x="256" y="186.7" width="28" height="20.6" />
        </g>
        <text className="classic-map-venue-label" x="270" y="272" textAnchor="middle">
          웨딩시티
        </text>
        <text className="classic-map-venue-detail" x="270" y="298" textAnchor="middle">
          신도림테크노마트 8층
        </text>
      </svg>
    </figure>
  );
}
