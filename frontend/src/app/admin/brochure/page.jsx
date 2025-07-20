import Brochures from '@/components/brochure/Brochures'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <Brochures />
      </SidebarLayout>
    </div>
  )
}
