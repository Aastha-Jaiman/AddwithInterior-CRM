import Services from '@/components/services/AdminServices'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <Services />
      </SidebarLayout>
    </div>
  )
}
