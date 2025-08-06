import SidebarLayout from '@/components/sidebar/Sidebar'
import StaffProfilePage from '@/components/profile/StaffProfile'
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
