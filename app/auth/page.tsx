"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'talent';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      const endpoint = isLogin ? "/api/auth/signin" : "/api/auth/signup";
      const body = isLogin 
        ? { email, password }
        : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(isLogin ? "로그인 성공!" : "회원가입 성공!");
        // 사용자 정보를 localStorage에 저장
        localStorage.setItem('user', JSON.stringify(data.user));
        // 사용자의 실제 역할에 따라 리다이렉트
        setTimeout(() => {
          const userRole = isLogin ? data.user.role : role.toUpperCase();
          if (userRole === "TALENT") {
            router.push("/talent");
          } else {
            router.push("/ceo");
          }
        }, 1000);
      } else {
        setError(data.error || (isLogin ? "로그인에 실패했습니다." : "회원가입에 실패했습니다."));
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const roleText = role === 'talent' ? '핀테크 졸업생/과정생' : 'CEO 졸업생/과정생';

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-2">
          {roleText}
        </h1>
        
        {/* 로그인/회원가입 탭 */}
        <div className="flex w-full mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              isLogin 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              !isLogin 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            회원가입
          </button>
        </div>
        
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 bg-gray-50"
              required
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 bg-gray-50"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 bg-gray-50"
            required
          />
          <button
            type="submit"
            className={`w-full mt-4 font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 ${
              isLogin 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={loading}
          >
            {loading 
              ? (isLogin ? "로그인 중..." : "회원가입 중...") 
              : (isLogin ? "로그인" : "회원가입")
            }
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← 메인으로 돌아가기
          </button>
        </div>
        
        {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
        {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      </div>
    </main>
  );
} 