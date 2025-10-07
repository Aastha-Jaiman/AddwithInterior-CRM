// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { changePassword as changeAdminPassword } from "@/services/admin.services";
// import { changeClientPassword } from "@/services/client.services";
// import {
//   Eye,
//   EyeOff,
//   CheckCircle2,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { useSelector } from "react-redux";

// export default function ResetPasswordPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const user = useSelector((state) => state.auth.user);

//   const isStaff =
//     user &&
//     ["admin", "salesperson", "designer", "carpenter"].includes(user.role);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMsg("");
//     setLoading(true);

//     try {
//       if (isStaff) {
//         await changeAdminPassword({
//           token,
//           newPassword: password,
//           confirmPassword: confirm,
//         });
//       } else {
//         await changeClientPassword({
//           token,
//           newPassword: password,
//           confirmPassword: confirm,
//         });
//       }
//       setMsg("Password reset successfully. Redirecting to login...");
//       setTimeout(() => router.replace("/login"), 2000);
//     } catch (err) {
//       setError(err?.response?.data?.message || "Failed to reset password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Password toggle button component
//   const PasswordToggle = ({ isVisible, toggle }) => (
//     <button
//       type="button"
//       onClick={toggle}
//       className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 focus:outline-none"
//       aria-label={isVisible ? "Hide password" : "Show password"}
//       tabIndex={-1}
//     >
//       {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
//     </button>
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-100 p-6">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
//         <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
//           Reset Your Password
//         </h2>

//         {msg && (
//           <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//             <CheckCircle2 className="w-6 h-6 mr-2" />
//             <span>{msg}</span>
//           </div>
//         )}

//         {error && (
//           <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             <AlertCircle className="w-6 h-6 mr-2" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
//           <div className="relative">
//             <label
//               htmlFor="new-password"
//               className="block text-sm font-semibold text-gray-700 mb-1"
//             >
//               New Password
//             </label>
//             <input
//               id="new-password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter new password"
//               className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               autoComplete="new-password"
//               minLength={6}
//             />
//             <PasswordToggle
//               isVisible={showPassword}
//               toggle={() => setShowPassword(!showPassword)}
//             />
//           </div>

//           <div className="relative">
//             <label
//               htmlFor="confirm-password"
//               className="block text-sm font-semibold text-gray-700 mb-1"
//             >
//               Confirm Password
//             </label>
//             <input
//               id="confirm-password"
//               type={showConfirm ? "text" : "password"}
//               placeholder="Confirm new password"
//               className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               required
//               autoComplete="new-password"
//               minLength={6}
//             />
//             <PasswordToggle
//               isVisible={showConfirm}
//               toggle={() => setShowConfirm(!showConfirm)}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword as changeAdminPassword } from "@/services/admin.services";
import { changeClientPassword } from "@/services/client.services";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const storedUserJSON = localStorage.getItem("crm_user");
      const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

      if (
        storedUser &&
        ["admin", "salesperson", "designer", "carpenter"].includes(
          storedUser.role
        )
      ) {
        await changeAdminPassword({
          token,
          newPassword: password,
          confirmPassword: confirm,
        });
      } else {
        await changeClientPassword({
          token,
          newPassword: password,
          confirmPassword: confirm,
        });
      }

      setMsg("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password. Invalid or expired link?"
      );
    } finally {
      setLoading(false);
    }
  }

  // Password toggle button component
  const PasswordToggle = ({ isVisible, toggle }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 focus:outline-none"
      aria-label={isVisible ? "Hide password" : "Show password"}
      tabIndex={-1}
    >
      {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Reset Your Password
        </h2>

        {msg && (
          <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <CheckCircle2 className="w-6 h-6 mr-2" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
            <PasswordToggle
              isVisible={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
            <PasswordToggle
              isVisible={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
