// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { loginAdmin } from '@/services/admin.services';

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const result = await loginAdmin({
//         email,
//         password,
//       });

//       console.log("✅ Login response:", result);

//       const userPayload = {
//         name: result.user.name,
//         email: result.user.email,
//         role: result.user.role,
//         permission: result.user.permission || [],
//       };

//       console.log("💾 Storing user:", userPayload);
//       localStorage.setItem('crm_user', JSON.stringify(userPayload));
//       localStorage.setItem('adminToken', result.token);

//       router.replace('/dashboard');
//     } catch (err) {
//       console.error("Login failed:", err);
//       const msg = err?.response?.data?.message || 'Login failed';
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Login</h2>

//         {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border px-3 py-2 rounded mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border px-3 py-2 rounded mb-4"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "@/services/admin.services";
import { loginSuccess } from "@/store/authSlice";
import PublicRoute from "./PublicRoutes";
import { loginClient } from "@/services/client.services";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("admin"); // 'admin' or 'client'

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (
        userType === "admin" ||
        userType === "salesperson" ||
        userType === "designer" ||
        userType === "carpenter"
      ) {
        result = await loginAdmin({ email, password });
      } else {
        result = await loginClient({ email, identifier: email, password });
      }

      const userPayload = {
        name: result.user.name,
        email: result.user.email,
        role: result.user.role || userType,
        permission: result.user.permission || [],
      };

      const isStaff =
        userType === "admin" ||
        userType === "salesperson" ||
        userType === "designer" ||
        userType === "carpenter";

      localStorage.setItem("crm_user", JSON.stringify(userPayload));
      localStorage.setItem(
        isStaff ? "adminToken" : "clientToken",
        result.token
      );

      console.log("💾 Storing user:", userPayload);
      dispatch(loginSuccess(userPayload));

      router.replace("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
            Login
          </h2>

          {/* Toggle login type */}
          <div className="flex justify-center gap-4 mb-5">
            <button
              type="button"
              onClick={() => setUserType("staff")}
              className={`px-4 py-1 rounded-full border ${
                userType === "staff"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-600 border-indigo-300"
              }`}
            >
              Login as Staff
            </button>
            <button
              type="button"
              onClick={() => setUserType("client")}
              className={`px-4 py-1 rounded-full border ${
                userType === "client"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-600 border-indigo-300"
              }`}
            >
              Login as Client
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? `Logging in as ${userType}...` : `Login as ${userType}`}
          </button>
        </form>
      </div>
    </PublicRoute>
  );
}
