'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Phone, Lock, Eye, EyeOff, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react';

const countries = [
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSendOTP = () => {
    if (phone.length >= 9) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowOTP(true);
      }, 1000);
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setLoading(true);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  };

  const handleLogin = () => {
    if (phone && password) {
      setLoading(true);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  };

  const handleRegister = () => {
    if (name && phone && password && confirmPassword === password && agreedToTerms) {
      setLoading(true);
      setTimeout(() => {
        setShowOTP(true);
        setLoading(false);
      }, 1000);
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E31C79] via-[#E31C79] to-purple-600 flex flex-col">
        {/* Header */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
            <span className="text-4xl font-black text-[#E31C79]">L</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Number</h1>
          <p className="text-white/80 text-center mb-8">
            We sent a 6-digit code to<br />
            <span className="font-semibold">{selectedCountry.code} {phone}</span>
          </p>
          
          {/* OTP Input */}
          <div className="flex gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                className="w-12 h-14 bg-white/20 border-2 border-white/40 rounded-xl text-center text-2xl font-bold text-white focus:bg-white/30 focus:border-white outline-none transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.join('').length !== 6}
            className="w-full max-w-xs bg-white text-[#E31C79] font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#E31C79] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Verify
              </>
            )}
          </button>

          <button className="mt-4 text-white/80 hover:text-white text-sm">
            Resend Code (59s)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E31C79] via-[#E31C79] to-purple-600 flex flex-col">
      {/* Header with animated logo */}
      <div className="pt-16 pb-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4 animate-pulse">
          <span className="text-5xl font-black text-[#E31C79]">LEE</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Welcome to LEE</h1>
        <p className="text-white/80 mt-2">Shop the best deals online</p>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-6">
        {/* Tab Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              isLogin ? 'bg-[#E31C79] text-white shadow-md' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !isLogin ? 'bg-[#E31C79] text-white shadow-md' : 'text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          /* Login Form */
          <div className="space-y-4">
            {/* Phone Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="flex items-center gap-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="812 345 6789"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#E31C79] focus:ring-2 focus:ring-[#E31C79]/20"
                  />
                </div>
              </div>
              {showCountryPicker && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryPicker(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                      <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#E31C79] focus:ring-2 focus:ring-[#E31C79]/20"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button className="text-[#E31C79] text-sm font-medium">Forgot Password?</button>

            <button
              onClick={handleLogin}
              disabled={loading || !phone || !password}
              className="w-full bg-[#E31C79] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Login */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">f</div>
                <span className="text-sm font-medium">Facebook</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs"></div>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>

            {/* OTP Login */}
            <button
              onClick={handleSendOTP}
              disabled={!phone}
              className="w-full py-3 border-2 border-[#E31C79] text-[#E31C79] font-semibold rounded-xl hover:bg-[#E31C79]/5 transition-all disabled:opacity-50 mt-4"
            >
              Login with OTP
            </button>
          </div>
        ) : (
          /* Register Form */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#E31C79] focus:ring-2 focus:ring-[#E31C79]/20"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="flex items-center gap-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="812 345 6789"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#E31C79] focus:ring-2 focus:ring-[#E31C79]/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#E31C79] focus:ring-2 focus:ring-[#E31C79]/20"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#E31C79] focus:ring-2 focus:ring-[#E31C79]/20"
              />
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#E31C79]"
              />
              <span className="text-sm text-gray-600">
                I agree to the <span className="text-[#E31C79]">Terms of Service</span> and <span className="text-[#E31C79]">Privacy Policy</span>
              </span>
            </label>

            <button
              onClick={handleRegister}
              disabled={loading || !name || !phone || !password || password !== confirmPassword || !agreedToTerms}
              className="w-full bg-[#E31C79] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
