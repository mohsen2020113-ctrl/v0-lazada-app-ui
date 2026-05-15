'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page with register tab active
    router.replace('/login?tab=register');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E31C79] to-purple-600 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
