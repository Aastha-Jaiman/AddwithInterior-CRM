import ProjectsList from '@/components/projects/StaffProjects'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
    return (
        <div>
            <SidebarLayout >
                <ProjectsList />
            </SidebarLayout>
        </div>
    )
}
