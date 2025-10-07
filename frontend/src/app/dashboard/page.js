// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserProfile } from '../../store/authSlice';

// export default function DashboardPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { user, status } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user) {
//       dispatch(fetchUserProfile('client'));
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     if (user) {
//       switch (user.role) {
//         case 'admin':
//           router.push('/admin-dashboard');
//           break;
//         case 'salesperson':
//           router.push('/salesperson-dashboard');
//           break;
//         case 'client':
//           router.push('/client-dashboard');
//           break;
//         case 'designer':
//           router.push('/designer-dashboard');
//           break;
//         case 'carpenter':
//           router.push('/carpenter-dashboard');
//           break;
//         default:
//           router.push('/login');
//       }
//     }
//   }, [user, router]);

//   return <div className="text-center p-10">Redirecting...</div>;
// }
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
          router.push('/admin-dashboard');
          break;
        case 'salesperson':
          router.push('/salesperson-dashboard');
          break;
        case 'client':
          router.push('/client-dashboard');
          break;
        case 'designer':
          router.push('/designer-dashboard');
          break;
        case 'carpenter':
          router.push('/carpenter-dashboard');
          break;
        default:
          router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);

  return <div className="text-center p-10">Redirecting...</div>;
}
