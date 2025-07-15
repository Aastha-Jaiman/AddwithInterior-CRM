
import SalespersonProjects from '@/components/projects/Salesperson'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
        <SidebarLayout>
            <SalespersonProjects />
        </SidebarLayout>
    </div>
  )
}
