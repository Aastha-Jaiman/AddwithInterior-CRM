import AdminPaymentsHistory from '@/components/payments/AdminPaymentsHistory'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <AdminPaymentsHistory />
      </SidebarLayout>
    </div>
  )
}
