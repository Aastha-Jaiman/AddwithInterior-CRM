
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginAdmin } from '@/services/admin.services'; 

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAdmin({
        email,
        password,
      });

      console.log("✅ Login response:", result);

      const userPayload = {
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        permission: result.user.permission || [], 
      };

      console.log("💾 Storing user:", userPayload);
      localStorage.setItem('crm_user', JSON.stringify(userPayload));
      localStorage.setItem('adminToken', result.token);

      router.replace('/dashboard'); 
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#b83535]">Login</h2>

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
          className="w-full bg-[#b83535] hover:bg-[#a62f2f] text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
