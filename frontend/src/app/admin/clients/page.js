
import ClientManagementComponent from '@/components/client/Client'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>

        <ClientManagementComponent />
      </SidebarLayout>
    </div>
  )
}
