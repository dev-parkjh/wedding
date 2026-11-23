import React from 'react';
import { useWedding } from '../content/WeddingContentContext.jsx';
import { getPublishedPhone } from '../features/details/contacts.js';
import './contact.css';

export default function ContactSection() {
  const wedding = useWedding();
  const people = [
    { side: 'groom', role: '신랑', name: wedding.groom },
    { side: 'bride', role: '신부', name: wedding.bride },
  ]
    .map((person) => ({ ...person, phone: getPublishedPhone(wedding.contacts[person.side]) }))
    .filter((person) => person.phone);

  if (people.length === 0) return null;

  return (
    <section id="contact" className="invitation-contact" aria-labelledby="invitation-contact-title">
      <div className="invitation-contact-inner">
        <h2 id="invitation-contact-title">필요하시면 편하게 연락 주세요.</h2>
        <div className="invitation-contact-list">
          {people.map(({ side, role, name, phone }) => (
            <div className="invitation-contact-person" key={side}>
              <p>
                <span>{role}</span> {name}
              </p>
              <div className="invitation-contact-actions">
                <a href={`tel:${phone}`} aria-label={`${role} ${name}에게 전화하기`}>
                  전화하기
                </a>
                <a href={`sms:${phone}`} aria-label={`${role} ${name}에게 문자하기`}>
                  문자하기
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
