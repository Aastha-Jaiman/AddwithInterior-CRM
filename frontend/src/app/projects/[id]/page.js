import StaffProjectDetails from '@/components/projects/StaffProjectDetails'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
    return (
        <div>
            <SidebarLayout>
                <StaffProjectDetails />
            </SidebarLayout>
        </div>
    )
}
