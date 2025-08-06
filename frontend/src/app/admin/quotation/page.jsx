import QuotationUpload from '@/components/quotation/QuotationUpload'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <QuotationUpload />
      </SidebarLayout>
    </div>
  )
}
