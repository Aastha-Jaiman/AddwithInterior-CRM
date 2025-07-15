'use client';

// import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/login');
  };

  return (
    <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to AddWith Interior Panel</h1>
      <p className="mb-6 text-gray-600 text-lg">Please login to continue</p>
      <button
        onClick={handleNavigate}
        className="bg-[#3569b8] hover:bg-[#2f41a6] text-white px-6 py-2 rounded-lg text-sm"
      >
        Go to Login
      </button>
    </div>
  );
}
