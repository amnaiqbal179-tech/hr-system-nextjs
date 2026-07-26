'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Seedha Login page par redirect kar dein
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">HR Management System</h1>
        <p className="text-gray-400 text-sm">Redirecting to login...</p>
      </div>
    </div>
  );
}