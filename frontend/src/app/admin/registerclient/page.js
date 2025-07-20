import ClientRegistrationForm from '@/components/registerstaff/RegisterClient'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
        <SidebarLayout >
            <ClientRegistrationForm />
        </SidebarLayout>
    </div>
  )
}
