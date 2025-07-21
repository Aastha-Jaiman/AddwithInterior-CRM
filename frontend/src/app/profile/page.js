import SidebarLayout from '@/components/sidebar/Sidebar'
import StaffProfilePage from '@/components/staffprofile/Profile'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <StaffProfilePage />
      </SidebarLayout>
    </div>
  )
}
