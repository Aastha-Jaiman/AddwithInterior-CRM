import DailyUpdateDetails from '@/components/dailyupdates/AdminDailyupdatesDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
        <SidebarLayout>
            <DailyUpdateDetails />
        </SidebarLayout>
    </div>
  )
}
