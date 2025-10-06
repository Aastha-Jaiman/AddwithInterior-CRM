'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { loginSuccess, logout, fetchUserProfile } from '../../store/authSlice';

const publicPaths = ['/login', '/signup', '/reset-password'];

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          if (user) router.replace('/dashboard');
          else setLoading(false);
          return;
        }
        if (!user) {
          const storedUser = typeof window !== 'undefined' && sessionStorage.getItem('crm_user');
          const role = storedUser ? JSON.parse(storedUser).role : 'client';
          const result = await dispatch(fetchUserProfile(role)).unwrap();
          if (!result) {
            dispatch(logout());
            router.replace('/login');
            return;
          }
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        dispatch(logout());
        router.replace('/login');
      }
    };

    verifyUser();
  }, [dispatch, pathname, router, user]);

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
