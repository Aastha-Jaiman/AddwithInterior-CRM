// 'use client';

// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginSuccess, logout } from '@/store/authSlice';
// import { getProfile } from '@/services/admin.services';
// import { toast } from 'react-toastify';

// const publicRoutes = ['/', '/signup', '/login']; // add more if needed

// export default function ProtectedRoute({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await getProfile();
//         if (res.success) {
//           dispatch(loginSuccess(res.user));
//           console.log(res)

//           if (res.user.role !== 'admin') {
//             toast.error('Only admin can access this panel');

//           }
//         } else {
//           if (!publicRoutes.includes(pathname)) {
//             dispatch(logout());
//             router.replace('/login');
//           }
//         }
//       } catch (err) {
//         dispatch(logout());
//         if (!publicRoutes.includes(pathname)) {
//           router.replace('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [pathname]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-500" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { loginSuccess } from "@/store/authSlice";
import { getProfile } from "@/services/admin.services";
import { getClientProfile } from "@/services/client.services";

const publicPaths = ["/login", "/signup", "/reset-password"]; // Add all public routes here

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const storedUserJSON = localStorage.getItem("crm_user");
        const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

        // Agar current route public hai
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          // Agar user logged in hai aur public page (login/signup/reset-password) pe hai to redirect dashboard
          if (storedUser && pathname !== "/reset-password") {
            router.replace("/dashboard");
          } else {
            // Public page aur ya to user logged out ya reset-password page - allow access
            setLoading(false);
          }
          return;
        }

        // Protected page hain? Toh user hona chahiye.
        if (!storedUser) {
          router.replace("/login");
          return;
        }

        let res;

        if (
          ["admin", "salesperson", "designer", "carpenter"].includes(
            storedUser.role
          )
        ) {
          res = await getProfile();
        } else {
          res = await getClientProfile();
        }

        if (res && res.success) {
          dispatch(loginSuccess(res.user));
          setLoading(false);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        router.replace("/login");
      }
    };

    verifyUser();
  }, [dispatch, pathname, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
