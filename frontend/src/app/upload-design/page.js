'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import DesignerPanel from '@/components/designs/designer-design/DesignPanel';

export default function UploadDesignPage() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.permission?.includes('upload_design')) {
      router.replace('/403'); // Or redirect to dashboard
    }
  }, [user]);

  // Optional: show nothing until permission check passes
  if (!user?.permission?.includes('upload_design')) return null;

  return (
        <DesignerPanel />
  );
}
