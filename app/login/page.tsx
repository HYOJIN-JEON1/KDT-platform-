"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("로그인 성공!");
        // 사용자 정보를 localStorage에 저장
        localStorage.setItem('user', JSON.stringify(data.user));
        // 사용자의 실제 역할에 따라 리다이렉트
        setTimeout(() => {
          if (data.user.role === "TALENT") {
            router.push("/talent");
          } else {
            router.push("/ceo");
          }
        }, 1000);
      } else {
        setError(data.error || "로그인에 실패했습니다.");
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
        <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-2">로그인</h1>
        <p className="text-gray-600 mb-8 text-center">{roleText}</p>
        
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            아직 계정이 없으신가요?{" "}
            <button
              onClick={() => router.push(`/signup?role=${role}`)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              회원가입
            </button>
          </p>
        </div>
        
        {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
        {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      </div>
    </main>
  );
}
