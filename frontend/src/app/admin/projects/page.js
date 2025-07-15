
import AdminProject from '@/components/projects/AdminProject'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <AdminProject />
      </SidebarLayout>
    </div>
  )
}
