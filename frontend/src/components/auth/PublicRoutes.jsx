// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSelector } from 'react-redux';

// export default function PublicRoute({ children }) {
//   const router = useRouter();
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (user) {
//       router.replace('/dashboard');  
//     }
//   }, [router, user]);

//   return <>{children}</>;
// }


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
