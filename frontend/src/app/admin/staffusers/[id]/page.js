
import SidebarLayout from '@/components/sidebar/Sidebar'
import StaffDetailsComponent from '@/components/staff/StaffDeatils'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <StaffDetailsComponent />
      </SidebarLayout>
    </div>
  )
}
