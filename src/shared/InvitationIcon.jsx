import React from 'react';
import CalendarDays from 'lucide-react/dist/esm/icons/calendar-days.mjs';
import CarFront from 'lucide-react/dist/esm/icons/car-front.mjs';
import Copy from 'lucide-react/dist/esm/icons/copy.mjs';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs';
import Map from 'lucide-react/dist/esm/icons/map.mjs';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.mjs';
import Send from 'lucide-react/dist/esm/icons/send.mjs';

// Adapted from Lucide's TramFront with an undivided windshield.
export function SubwayIcon({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="16" x="4" y="3" rx="2" />
      <path d="M4 9h16" />
      <path d="m8 19-2 3" />
      <path d="m18 22-2-3" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

const invitationIcons = {
  calendar: CalendarDays,
  car: CarFront,
  copy: Copy,
  external: ExternalLink,
  location: MapPin,
  map: Map,
  message: MessageCircle,
  send: Send,
  subway: SubwayIcon,
};

export default function InvitationIcon({ name, className = '', fill = 'none' }) {
  const Icon = invitationIcons[name];
  if (!Icon) return null;

  return (
    <Icon
      className={className}
      fill={fill}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
    />
  );
}
