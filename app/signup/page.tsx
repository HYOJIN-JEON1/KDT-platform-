"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("회원가입 성공!");
        // 사용자 정보를 localStorage에 저장
        localStorage.setItem('user', JSON.stringify(data.user));
        // 역할에 따라 다른 페이지로 리다이렉트
        setTimeout(() => {
          if (role === "talent") {
            router.push("/talent");
          } else {
            router.push("/ceo");
          }
        }, 1500);
      } else {
        setError(data.error || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const roleText = role === 'talent' ? '핀테크 과정생/수료생' : 'CEO 과정생/수료생';

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-2">회원가입</h1>
        <p className="text-gray-600 mb-8 text-center">{roleText}</p>
        
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 bg-gray-50"
            required
          />
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
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => router.push(`/login?role=${role}`)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              로그인
            </button>
          </p>
        </div>
        
        {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
        {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      </div>
    </main>
  );
} 