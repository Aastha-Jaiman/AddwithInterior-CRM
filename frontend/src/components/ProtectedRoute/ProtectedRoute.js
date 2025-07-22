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
import { useRouter } from "next/navigation";
import { loginSuccess } from "@/store/authSlice";
import { getProfile } from "@/services/admin.services";
import { getClientProfile } from "@/services/client.services";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("crm_user"));

        console.log(
          "🔍 Checking stored user:",
          storedUser === null
            ? "null"
            : ["admin", "salesperson", "designer", "carpenter"].includes(
                storedUser.role
              )
            ? storedUser.role
            : "client"
        );

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

        if (res.success) {
          dispatch(loginSuccess(res.user));
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
