// import QuotationForm from '@/components/quotation/QuotationUpload'
import QuotationForm from '@/components/quotation/SalespersonQuotationFrom'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
        <SidebarLayout>
            {/* <QuotationForm/> */}
            <QuotationForm />
        </SidebarLayout>
    </div>
  )
}
