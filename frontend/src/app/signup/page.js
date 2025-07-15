// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { dummyUsers } from '../../library/dummyuser';

// export default function LoginPage() {
//   const router = useRouter();

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = (e) => {
//     e.preventDefault();

//     const user = dummyUsers.find(
//       (u) => u.username === username && u.password === password
//     );

//     if (!user) {
//       setError('Invalid credentials');
//     } else {
//       // Set user in localStorage for now
//       localStorage.setItem('crm_user', JSON.stringify(user));
//       router.push('/dashboard'); // redirect to dashboard
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center text-[#b83535]">Login</h2>

//         {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full border px-3 py-2 rounded mb-3"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border px-3 py-2 rounded mb-4"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="w-full bg-[#b83535] hover:bg-[#a62f2f] text-white py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }



import AdminSignupForm from '@/components/auth/CreateAdmin'
import React from 'react'

export default function page() {
  return (
    <div>
      <AdminSignupForm />
    </div>
  )
}
