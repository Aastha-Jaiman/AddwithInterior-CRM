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


