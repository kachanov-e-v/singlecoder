'use client';

import { useAuth } from '@/auth/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Workspace from '@/components/Workspace';

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f0f1a] text-white">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }
  if (!user) return <AuthScreen />;
  return <Workspace />;
}
