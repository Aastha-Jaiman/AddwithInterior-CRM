import ClientQuotation from '@/components/quotation/ClientQuotation'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
    return (
        <div>
            <SidebarLayout >
                <ClientQuotation />
            </SidebarLayout>
        </div>
    )
}
