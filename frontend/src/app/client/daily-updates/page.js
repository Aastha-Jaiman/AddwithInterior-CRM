import AdminDailyUpdates from '@/components/dailyupdates/AdminDailyupdates'
import DailyUpdates from '@/components/dailyupdates/ClientUpdates'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        {/* <AdminDailyUpdates /> */}
        <DailyUpdates />
      </SidebarLayout>
    </div>
  )
}
