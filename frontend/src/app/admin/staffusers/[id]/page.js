import SidebarLayout from '@/components/sidebar/Sidebar'
import StaffDetailsPage from '@/components/staff/StaffDeatils'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <StaffDetailsPage/>
      </SidebarLayout>
    </div>
  )
}
