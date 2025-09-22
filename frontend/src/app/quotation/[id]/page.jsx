import QuotationDetails from '@/components/quotation/QuitationDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
  return (
    <div>
        <SidebarLayout>
            <QuotationDetails/>
        </SidebarLayout>
    </div>
  )
}
