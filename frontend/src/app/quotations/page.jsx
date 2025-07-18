// 'use client';

// import { useSelector } from 'react-redux';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import UploadQuotationForm from '@/components/quotation/UploadQuotation';
// import QuotationsTable from '@/components/quotation/QuotationTable';

// export default function QuotationsPage() {
//     const router = useRouter();
//     const user = useSelector((s) => s.auth.user);

//     const canView = user?.permission?.includes('view_quotations');
//     const canUpload = user?.permission?.includes('upload_quotation');

//     // Kick out if user has neither permission
//     useEffect(() => {
//         if (!canView && !canUpload) {
//             router.replace('/403');
//         }
//     }, [user]);

//     if (!canView && !canUpload) return null; // while redirecting

//     return (
//         <div className="p-6 space-y-6">
//             <header className="flex items-center justify-between">
//                 <h1 className="text-2xl font-semibold text-indigo-600">Quotations</h1>

//                 {canUpload && (
//                     <button
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                         onClick={() => {/* open modal OR scroll to form */ }}
//                     >
//                         Upload New Quotation
//                     </button>
//                 )}
//             </header>

//             {/* Upload section */}
//             {canUpload && (
//                 <section className="bg-white p-4 rounded shadow">
//                     <UploadQuotationForm />
//                 </section>
//             )}

//             {/* View section */}
//             {canView && (
//                 <section className="bg-white p-4 rounded shadow">
//                     <QuotationsTable />
//                 </section>
//             )}
//         </div>
//     );
// }



// /app/quotations/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useHasPermission } from '@/hooks/useHasPermission';
import SidebarLayout from '@/components/sidebar/Sidebar';

export default function QuotationsPage() {
  const router = useRouter();

  const canUpload = useHasPermission('upload_quotation');
  const canView = useHasPermission('view_quotations');

  return (
    <SidebarLayout>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Quotations</h1>

        {/* Upload Button — only for admin/salesperson */}
        {canUpload && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => router.push('/upload-quotation')}
          >
            Upload Quotation
          </button>
        )}

        {/* View Quotations — everyone with view permission */}
        {canView && (
          <div className="mt-4">
            {/* Your quotations table or view here */}
            <p>You have access to view quotations.</p>
          </div>
        )}

        {/* If no access */}
        {!canView && !canUpload && (
          <p className="text-red-500">You don't have access to this page.</p>
        )}
      </div>
    </SidebarLayout>
  );
}


