// "use client";

// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (user) {
//       router.replace("/dashboard");
//     }
//   }, [user, router]);

//   const handleNavigate = () => {
//     router.push("/signup");
//   };

//   return (
//     <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">
//         Welcome to AddWith Interior Panel
//       </h1>
//       <p className="mb-6 text-gray-600 text-lg">Please login to continue</p>
//       <button
//         onClick={handleNavigate}
//         className="bg-[#3569b8] hover:bg-[#2f41a6] text-white px-6 py-2 rounded-lg text-sm"
//       >
//         Go to Signup Or Login
//       </button>
//     </div>
//   );
// }

'use client';

// import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/signup');
  };

  
  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to AddWith Interior Panel</h1>
      <p className="mb-6 text-gray-600 text-lg">Please login to continue</p>
      <button
        onClick={handleNavigate}
        className="bg-[#3569b8] hover:bg-[#2f41a6] text-white px-6 py-2 rounded-lg text-sm"
      >
        Go to Signup Or Login
      </button>
    </div>
  );
}

