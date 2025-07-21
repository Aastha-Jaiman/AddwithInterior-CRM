import { ClientDetails } from '@/components/client/ClientDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <ClientDetails />
      </SidebarLayout>
    </div>
  )
}
