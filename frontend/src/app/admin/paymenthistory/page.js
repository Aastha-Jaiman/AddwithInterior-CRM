import PaymentsPage from '@/components/payments/AdminPaymentsHistory'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <PaymentsPage />
      </SidebarLayout>
    </div>
  )
}
