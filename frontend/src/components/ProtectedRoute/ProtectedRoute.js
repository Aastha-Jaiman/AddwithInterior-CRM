// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";

// const publicPaths = ["/login", "/signup", "/reset-password"];

// export default function ProtectedRoute({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   // Initialize loading based on localStorage
//   const storedUserJSON =
//     typeof window !== "undefined" && localStorage.getItem("crm_user");
//   const storedToken =
//     typeof window !== "undefined" && localStorage.getItem("crm_token");
//   const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

//   const [loading, setLoading] = useState(() => {
//     if (publicPaths.some((path) => pathname.startsWith(path))) return false;
//     if (storedUser && storedToken) return false;
//     return true;
//   });

//   useEffect(() => {
//     // If route is public
//     if (publicPaths.some((path) => pathname.startsWith(path))) {
//       if (storedUser && pathname !== "/reset-password") {
//         router.replace("/dashboard");
//       }
//       return;
//     }

//     // If token or user missing, redirect to login
//     if (!storedUser || !storedToken) {
//       router.replace("/login");
//       return;
//     }

//     // Token exists, allow render
//     setLoading(false);
//   }, [pathname, router, storedUser, storedToken]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
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

const publicPaths = ["/login", "/signup", "/reset-password"];

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
      try {
        const storedUserJSON = localStorage.getItem("crm_user");
        const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

        if (publicPaths.some((path) => pathname.startsWith(path))) {
          if (storedUser && pathname !== "/reset-password") {
            router.replace("/dashboard");
          } else {
            setLoading(false);
          }
          return;
        }
        console.log('storedUser', storedUser)
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
        localStorage.removeItem("crm_user");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("clientToken");
          router.replace("/login");
      }
    };

  useEffect(() => {
    verifyUser();
  }, [dispatch, pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
