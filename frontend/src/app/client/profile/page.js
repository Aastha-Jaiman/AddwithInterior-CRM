import ProfilePage from '@/components/profile/ClientProfile'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>   
        <ProfilePage />
      </SidebarLayout>
    </div>
  )
}
