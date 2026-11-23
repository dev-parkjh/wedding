import React from 'react';
import CalendarDays from 'lucide-react/dist/esm/icons/calendar-days.mjs';
import CarFront from 'lucide-react/dist/esm/icons/car-front.mjs';
import Copy from 'lucide-react/dist/esm/icons/copy.mjs';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs';
import Map from 'lucide-react/dist/esm/icons/map.mjs';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.mjs';
import Send from 'lucide-react/dist/esm/icons/send.mjs';
import TrainFront from 'lucide-react/dist/esm/icons/train-front.mjs';

const invitationIcons = {
  calendar: CalendarDays,
  car: CarFront,
  copy: Copy,
  external: ExternalLink,
  location: MapPin,
  map: Map,
  message: MessageCircle,
  send: Send,
  subway: TrainFront,
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
