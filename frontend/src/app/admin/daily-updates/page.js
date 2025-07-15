'use client';
import AdminDailyUpdates from '@/components/dailyupdates/AdminDailyupdates';
import SidebarLayout from '@/components/sidebar/Sidebar';
import React, { Suspense } from 'react';



export default function Page() {
  return (
    <div>
      <SidebarLayout>
        {/* ✅ Suspense wrap to fix useSearchParams issue */}
        <Suspense fallback={<div>Loading...</div>}>
          <AdminDailyUpdates />
        </Suspense>
      </SidebarLayout>
    </div>
  );
}
