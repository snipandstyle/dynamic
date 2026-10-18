'use client';

import React from 'react';
import TermsModal from '../../components/TermsModal';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 flex items-center justify-center">
      <TermsModal isOpen={true} onClose={() => window.location.href = '/'} />
    </div>
  );
}
