import PaymentDetailPage from '@/components/payments/AdminPaymentHistoryDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <PaymentDetailPage />
      </SidebarLayout>
    </div>
  )
}
