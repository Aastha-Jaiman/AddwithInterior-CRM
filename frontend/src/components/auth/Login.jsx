// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { loginAdmin } from "@/services/admin.services";
// import { loginSuccess } from "@/store/authSlice";
// import PublicRoute from "./PublicRoutes";
// import { loginClient } from "@/services/client.services";

// export default function LoginPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userType, setUserType] = useState("admin"); // 'admin' or 'client'

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       let result;

//       if (
//         userType === "admin" ||
//         userType === "salesperson" ||
//         userType === "designer" ||
//         userType === "carpenter"
//       ) {
//         result = await loginAdmin({ email, password });
//       } else {
//         result = await loginClient({ email, identifier: email, password });
//       }

//       const userPayload = {
//         name: result.user.name,
//         email: result.user.email,
//         role: result.user.role || userType,
//         permission: result.user.permission || [],
//       };

//       const isStaff =
//         userType === "admin" ||
//         userType === "salesperson" ||
//         userType === "designer" ||
//         userType === "carpenter";

//       localStorage.setItem("crm_user", JSON.stringify(userPayload));
//       localStorage.setItem(
//         isStaff ? "adminToken" : "clientToken",
//         result.token
//       );

//       console.log(" Storing user:", userPayload);
//       dispatch(loginSuccess(userPayload));

//       router.replace("/dashboard");
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Login failed";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PublicRoute>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <form
//           onSubmit={handleLogin}
//           className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
//         >
//           <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
//             Login
//           </h2>

//           {/* Toggle login type */}
//           <div className="flex justify-center gap-4 mb-5">
//             <button
//               type="button"
//               onClick={() => setUserType("admin")}
//               className={`px-4 py-1 rounded-full border ${userType === "admin"
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-white text-indigo-600 border-indigo-300"
//                 }`}
//             >
//               Login as Admin
//             </button>
//             <button
//               type="button"
//               onClick={() => setUserType("client")}
//               className={`px-4 py-1 rounded-full border ${userType === "client"
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "bg-white text-indigo-600 border-indigo-300"
//                 }`}
//             >
//               Login as Client
//             </button>
//           </div>

//           {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border px-3 py-2 rounded mb-3"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border px-3 py-2 rounded mb-4"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded"
//             disabled={loading}
//           >
//             {loading ? `Logging in as ${userType}...` : `Login as ${userType}`}
//           </button>
//         </form>
//       </div>
//     </PublicRoute>
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

      console.log(" Storing user:", userPayload);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Logo/Brand Section */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 px-2">Sign in to your account to continue</p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              {/* User Type Toggle */}
              <div className="flex gap-1 sm:gap-2 p-1 bg-gray-100/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${userType === "admin"
                    ? "bg-white text-blue-600 shadow-md border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden xs:inline">Admin</span>
                    <span className="xs:hidden">Admin</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("client")}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${userType === "client"
                    ? "bg-white text-blue-600 shadow-md border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Client
                  </div>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm flex items-start sm:items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="block w-full pl-8 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in as {userType}...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login as {userType}
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-500 px-2">
                Secure login powered by advanced encryption
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 sm:mt-8 text-center px-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Having trouble signing in?{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors block sm:inline mt-1 sm:mt-0">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
