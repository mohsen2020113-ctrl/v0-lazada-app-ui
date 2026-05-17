import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

export default function LoginPage({ navigate }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, loading, error, clearError } = useAuth();

  const handleSubmit = async () => {
    clearError();
    const success = isLogin ? await login(email, password) : await register(email, password, firstName, lastName);
    if (success) navigate('account');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-4 pt-12 pb-4"><button onClick={() => navigate('account')} className="text-gray-600"><ChevronLeft size={22} /></button></div>
      <div className="flex-1 px-6 pt-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">L</div>
          <h1 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome back!' : 'Create account'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isLogin ? 'Sign in to your LEE account' : 'Join LEE for exclusive deals'}</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">{error}</div>}
        <div className="space-y-3">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="input-field pl-9" /></div>
              <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="input-field pl-9" /></div>
            </div>
          )}
          <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-9" /></div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-9 pr-10" />
            <button onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading || !email || !password} className="btn-primary w-full mt-6 text-base">
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => { setIsLogin(l => !l); clearError(); }} className="text-orange-500 font-medium">{isLogin ? 'Sign Up' : 'Sign In'}</button>
        </p>
      </div>
    </div>
  );
}
