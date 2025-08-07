import ClientProjectDetails from '@/components/projects/ClientProjectDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'

import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <ClientProjectDetails />
      </SidebarLayout>
    </div>
  )
}
