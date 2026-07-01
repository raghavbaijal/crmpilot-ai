import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Lock } from 'lucide-react';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-600">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100/50">
            <Lock className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Authentication Coming Soon</h2>
          <p className="text-sm text-slate-500">
            Secure login, user profiles, and multi-tenant access controls will be implemented in Phase 2.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Login;
