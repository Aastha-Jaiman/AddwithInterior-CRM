import AdminQuotation from '@/components/quotation/AdminQuotation'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <AdminQuotation />
      </SidebarLayout>
    </div>
  )
}
