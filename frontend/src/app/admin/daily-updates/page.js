
import DailyUpdatesList from '@/components/dailyupdates/AdminDailyupdates'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
<DailyUpdatesList />
      </SidebarLayout>
    </div>
  )
}
