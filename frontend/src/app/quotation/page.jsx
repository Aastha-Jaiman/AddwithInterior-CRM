import QuotationList from '@/components/quotation/Quotation'
import QuotationUpload from '@/components/quotation/QuotationUpload'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
      <SidebarLayout>
        {/* <QuotationUpload /> */}
        <QuotationList />
      </SidebarLayout>
    </div>
  )
}
