

import ClientDetailsPage from '@/components/client/ClientDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <ClientDetailsPage />
      </SidebarLayout>
    </div>
  )
}
