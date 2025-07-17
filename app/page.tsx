import React from "react";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* 배경 이미지 및 오버레이 */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-20 w-full max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
            서울대 KDT<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              네트워킹 플랫폼
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white/95 mb-4">
              KDT, 최고의 인재와 혁신 기업을 연결하다
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              핀테크와 AI 분야의 전문성을 갖춘 인재들과 혁신적인 기업들이 만나는 플랫폼
            </p>
            <p className="text-base md:text-lg text-white/70 font-medium">
              미래를 선도하는 기술 혁신의 중심에서 새로운 기회를 발견하세요
            </p>
          </div>
        </div>

        {/* 카드 섹션 */}
        <div className="flex w-full max-w-6xl mx-auto flex-col gap-8 lg:flex-row px-4">
          {/* 핀테크 전문가 과정 카드 */}
          <div className="flex flex-1 flex-col items-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-12 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ease-out group">
            <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="mb-4 text-2xl md:text-3xl font-bold text-white text-center">
              핀테크 전문가 과정
            </h3>
            
            <p className="mb-8 flex-grow text-center text-base md:text-lg text-white/90 leading-relaxed max-w-sm">
              당신의 역량을 증명하고, 최고의 기회를 만나보세요. 
              <span className="block mt-2 text-white/70 text-sm">
                혁신적인 금융 기술의 최전선에서 성장하세요
              </span>
            </p>
            
            <Link href="/auth?role=talent" className="w-full">
              <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:from-blue-500 hover:to-blue-600 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30">
                핀테크 졸업생/과정생
              </button>
            </Link>
          </div>

          {/* CEO 과정 카드 */}
          <div className="flex flex-1 flex-col items-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-12 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ease-out group">
            <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <h3 className="mb-4 text-2xl md:text-3xl font-bold text-white text-center">
              CEO 과정
            </h3>
            
            <p className="mb-8 flex-grow text-center text-base md:text-lg text-white/90 leading-relaxed max-w-sm">
              검증된 인재를 발굴하고, AI 혁신을 가속화하세요.
              <span className="block mt-2 text-white/70 text-sm">
                비즈니스 리더십과 기술 혁신의 융합을 경험하세요
              </span>
            </p>
            
            <Link href="/auth?role=ceo" className="w-full">
              <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:from-purple-500 hover:to-purple-600 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30">
                CEO 졸업생/과정생
              </button>
            </Link>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="text-center mt-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-400">500+</div>
                <div className="text-sm">전문 인재</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-400">50+</div>
                <div className="text-sm">파트너 기업</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-cyan-400">1000+</div>
                <div className="text-sm">성공적인 매칭</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장식적 요소들 */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}} />
      <div className="absolute bottom-40 right-10 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" style={{animationDelay: '3s'}} />
    </main>
  );
}
