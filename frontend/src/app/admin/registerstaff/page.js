import StaffRegistrationForm from '@/components/registerstaff/RegisterStaff'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
        <SidebarLayout >
            <StaffRegistrationForm />
        </SidebarLayout>
    </div>
  )
}
