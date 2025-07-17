"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  UserCircleIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowRightIcon,
  FireIcon,
  TrophyIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function TalentDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보 가져오기
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const userName = user?.name || '사용자';

  // 더미 데이터 (추후 실제 API 연결)
  const dashboardData = {
    newJobs: 12,
    profileCompletion: 75,
    capstoneProjects: 8,
    networkingOpportunities: 15
  };

  return (
    <div className="space-y-8">
      {/* 환영 메시지 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            안녕하세요, {userName}님! 👋
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            핀테크 전문가 과정을 통해 당신의 역량을 마음껏 펼치세요!
          </p>
          <p className="text-base text-blue-200 mt-2">
            새로운 기회와 성장의 여정이 당신을 기다립니다.
          </p>
        </div>
        {/* 장식적 요소들 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 right-8 w-20 h-20 bg-white/5 rounded-full" />
        <div className="absolute top-8 right-20 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute bottom-8 right-32 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* 핵심 정보 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 새로운 채용 공고 카드 */}
        <Link href="/talent/jobs" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">새로운 채용 공고</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{dashboardData.newJobs}</p>
            <p className="text-sm text-gray-500">당신에게 맞춤 추천된 기회</p>
            <div className="mt-3 flex items-center text-sm text-blue-600 font-medium">
              <span>자세히 보기</span>
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 나의 프로필 완성도 카드 */}
        <Link href="/talent/profile" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <UserCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">프로필 완성도</h3>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-3xl font-bold text-green-600">{dashboardData.profileCompletion}%</span>
                <span className="text-sm text-gray-500">완료</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${dashboardData.profileCompletion}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">프로필을 완성하여 더 많은 기회를 얻으세요</p>
            <div className="mt-3 flex items-center text-sm text-green-600 font-medium">
              <span>프로필 편집</span>
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 추천 캡스톤 프로젝트 카드 */}
        <Link href="/talent/capstone" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">캡스톤 프로젝트</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">{dashboardData.capstoneProjects}</p>
            <p className="text-sm text-gray-500">추천 프로젝트 기회</p>
            <div className="mt-3 flex items-center text-sm text-purple-600 font-medium">
              <span>프로젝트 탐색</span>
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 새로운 네트워킹 기회 카드 */}
        <Link href="/talent/networking" className="group">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">네트워킹 기회</h3>
            <p className="text-3xl font-bold text-orange-600 mb-2">{dashboardData.networkingOpportunities}</p>
            <p className="text-sm text-gray-500">새로운 연결 가능한 인맥</p>
            <div className="mt-3 flex items-center text-sm text-orange-600 font-medium">
              <span>네트워킹 시작</span>
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* 퀵 액션 섹션 */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <FireIcon className="w-6 h-6 text-red-500 mr-3" />
          빠른 액션
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left group">
            <div className="flex items-center justify-between mb-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              <ArrowRightIcon className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-800">역량 평가 받기</h3>
            <p className="text-sm text-gray-600">나의 스킬을 점검해보세요</p>
          </button>
          
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left group">
            <div className="flex items-center justify-between mb-2">
              <TrophyIcon className="w-5 h-5 text-green-600" />
              <ArrowRightIcon className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-800">성취 확인</h3>
            <p className="text-sm text-gray-600">완료한 과정과 인증서 보기</p>
          </button>

          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left group">
            <div className="flex items-center justify-between mb-2">
              <BellIcon className="w-5 h-5 text-purple-600" />
              <ArrowRightIcon className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-800">알림 설정</h3>
            <p className="text-sm text-gray-600">맞춤 알림 관리하기</p>
          </button>
        </div>
      </div>

      {/* 최근 활동 피드 */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <ClockIcon className="w-6 h-6 text-gray-600 mr-3" />
          최근 활동
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BriefcaseIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">새로운 핀테크 스타트업 채용 공고</h3>
              <p className="text-sm text-gray-600">블록체인 개발자 포지션이 새로 올라왔습니다.</p>
              <p className="text-xs text-gray-400 mt-1">2시간 전</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">캡스톤 프로젝트 발표회 안내</h3>
              <p className="text-sm text-gray-600">다음 주 금요일 최종 발표회가 진행됩니다.</p>
              <p className="text-xs text-gray-400 mt-1">1일 전</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">동기 네트워킹 이벤트</h3>
              <p className="text-sm text-gray-600">핀테크 과정 수료생 모임이 예정되어 있습니다.</p>
              <p className="text-xs text-gray-400 mt-1">3일 전</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            모든 활동 보기 →
          </button>
        </div>
      </div>

      {/* 진행률 섹션 */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-6">이번 달 성과</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">8</div>
            <div className="text-sm text-gray-300">지원한 회사</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">3</div>
            <div className="text-sm text-gray-300">면접 기회</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
            <div className="text-sm text-gray-300">완료한 프로젝트</div>
          </div>
        </div>
      </div>
    </div>
  );
}
