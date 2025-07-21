'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('crm_user')) {
      router.replace('/dashboard');  
    }
  }, [router]);

  return <>{children}</>;
}
