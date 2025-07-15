'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setRole(parsed.role);

      switch (parsed.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'salesperson':
          router.push('/salesperson');
          break;
        case 'client':
          router.push('/client');
          break;
        case 'designer':
          router.push('/designer');
          break;
        case 'carpenter':
          router.push('/carpenter');
          break;
        default:
          router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div className="text-center p-10">Redirecting...</div>;
}
