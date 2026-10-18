'use client';

import React from 'react';
import AdminDashboardModal from '../../components/AdminDashboardModal';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 flex items-center justify-center">
      <AdminDashboardModal isOpen={true} onClose={() => window.location.href = '/'} />
    </div>
  );
}
