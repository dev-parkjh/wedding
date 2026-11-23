import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WeddingContentProvider } from './content/WeddingContentContext.jsx';
import { createWedding, isAfterWeddingDay } from './content/wedding.js';
import './styles/fonts.css';
import './styles/base.css';
import ClassicInvitation from './app/ClassicInvitation.jsx';

const wedding = createWedding(__WEDDING_CONTENT__);
const archived = isAfterWeddingDay(__WEDDING_CONTENT__.ceremony.date);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeddingContentProvider wedding={wedding}>
      <ClassicInvitation archived={archived} />
    </WeddingContentProvider>
  </StrictMode>,
);
