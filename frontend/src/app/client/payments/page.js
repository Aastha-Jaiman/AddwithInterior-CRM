import AdminPaymentHistory from '@/components/payments/AdminPaymentsHistory'
import ClientPanel from '@/components/payments/ClientPaymentHistory'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <ClientPanel/>
      </SidebarLayout>
    </div>
  )
}
