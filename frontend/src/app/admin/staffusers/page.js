import SidebarLayout from '@/components/sidebar/Sidebar'
import StaffManagement from '@/components/staff/AdminStaffUsers'
import React from 'react'

export default function page() {
    return (
        <div>
            <SidebarLayout >
                <StaffManagement />
            </SidebarLayout>
        </div>
    )
}
