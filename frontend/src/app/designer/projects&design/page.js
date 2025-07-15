

import DesignerPanel from '@/components/designs/designer-design/DesignPanel'
import SidebarLayout from '@/components/sidebar/Sidebar'
import React from 'react'

export default function page() {
    return (
        <div>
            <SidebarLayout>
                <DesignerPanel />
            </SidebarLayout>
        </div>
    )
}
