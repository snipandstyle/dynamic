'use client';

import React from 'react';
import PrivacyModal from '../../components/PrivacyModal';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 flex items-center justify-center">
      <PrivacyModal isOpen={true} onClose={() => window.location.href = '/'} />
    </div>
  );
}
