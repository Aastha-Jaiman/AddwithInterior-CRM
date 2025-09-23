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



// import QuotationList from '@/components/quotation/Quotation'
// import QuotationUpload from '@/components/quotation/QuotationUpload'
// import SidebarLayout from '@/components/sidebar/Sidebar'
// import { useHasPermission } from '@/hooks/useHasPermission';
// import React from 'react'


// export default function page() {
//   const canViewQuotations = useHasPermission("/quotations");

//   if (!canViewQuotations) {
//     return <p className="text-red-500">You don’t have permission to view quotations.</p>;
//   }
//   return (
//     <div>
//       <SidebarLayout>
//         {/* <QuotationUpload /> */}
//         <QuotationList />
//       </SidebarLayout>
//     </div>
//   )
// }
