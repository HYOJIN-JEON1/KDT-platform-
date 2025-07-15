import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] px-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black text-center mb-12">
        KDT, 최고의 인재와 혁신 기업을 연결하다.
      </h1>
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Left Box */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-3 text-gray-900">For KDT Talents</h2>
          <p className="text-gray-600 mb-6 text-center">당신의 역량을 증명하고, 최고의 기회를 만나보세요.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            KDT 인재로 시작하기
          </button>
        </div>
        {/* Right Box */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-3 text-gray-900">For CEO Partners</h2>
          <p className="text-gray-600 mb-6 text-center">검증된 인재를 발굴하고, AI 혁신을 가속화하세요.</p>
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            CEO 파트너로 시작하기
          </button>
        </div>
      </div>
    </main>
  );
}
