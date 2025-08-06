import ProjectDetails from '@/components/projects/ClientProject'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
    return (
        <div>
            <SidebarLayout>

                <ProjectDetails />
            </SidebarLayout>
        </div>
    )
}
