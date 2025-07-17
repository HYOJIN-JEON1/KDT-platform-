"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon,
  BellIcon,
  DocumentTextIcon,
  LightBulbIcon,
  StarIcon,
  CheckCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

export default function CEODashboard() {
  const [user, setUser] = useState<any>(null);
  const [networkingData, setNetworkingData] = useState({
    newConnectionRequests: 0,
    newMembers: 0,
    communityUpdates: 23, // 커뮤니티 API가 없으므로 임시값 유지
    featuredCapstones: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보 가져오기
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 실제 네트워킹 데이터 로드
  const loadNetworkingData = async () => {
    if (!user?.id) return;
    
    try {
      // 병렬로 여러 API 호출
      const [usersResponse, receivedResponse, sentResponse] = await Promise.all([
        fetch(`/api/users?currentUserId=${user.id}`),
        fetch(`/api/proposals/received?userId=${user.id}`),
        fetch(`/api/proposals/sent?userId=${user.id}`)
      ]);

      const [usersData, receivedData, sentData] = await Promise.all([
        usersResponse.ok ? usersResponse.json() : { users: [] },
        receivedResponse.ok ? receivedResponse.json() : { proposals: [] },
        sentResponse.ok ? sentResponse.json() : { proposals: [] }
      ]);

      // 받은 제안 중 PENDING 상태인 것들만 카운트
      const pendingRequests = receivedData.proposals?.filter(
        (proposal: any) => proposal.status === 'PENDING'
      ).length || 0;

      // 최근 일주일 내 가입한 사용자 수 계산
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentMembers = usersData.users?.filter(
        (user: any) => new Date(user.createdAt) > oneWeekAgo
      ).length || 0;

      setNetworkingData(prev => ({
        ...prev,
        newConnectionRequests: pendingRequests,
        newMembers: recentMembers,
        featuredCapstones: Math.min(usersData.users?.length || 0, 7) // 임시로 사용자 수 기반
      }));

    } catch (error) {
      console.error('네트워킹 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadNetworkingData();
    }
  }, [user]);

  const userName = user?.name || 'CEO';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">대시보드 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 환영 메시지 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
            <SparklesIcon className="w-8 h-8 mr-3 text-yellow-300" />
            환영합니다, {userName}님!
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-3">
            최고의 인재 및 혁신 파트너들과 연결되어 비즈니스를 성장시키세요!
          </p>
          <p className="text-base text-blue-200">
            의미 있는 연결과 협업을 통해 핀테크 생태계를 함께 발전시켜나가세요.
          </p>
        </div>
        {/* 장식적 요소들 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-pink-300/20 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 right-8 w-24 h-24 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full" />
        <div className="absolute top-8 right-24 w-3 h-3 bg-yellow-300/60 rounded-full animate-pulse" />
        <div className="absolute bottom-12 right-36 w-2 h-2 bg-pink-300/50 rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-20 right-12 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '3s'}} />
      </div>

      {/* 주요 네트워킹 활동 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 새로운 연결 제안 카드 */}
        <Link href="/ceo/networking" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:scale-105 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-700" />
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-700 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">새로운 연결 제안</h3>
              <p className="text-3xl font-bold text-blue-700 mb-2">{networkingData.newConnectionRequests}</p>
              <p className="text-sm text-gray-600">새로운 커피챗 요청</p>
              <div className="mt-3 flex items-center text-sm text-blue-700 font-medium">
                <span>제안 확인하기</span>
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* 신규 가입 CEO/인재 카드 */}
        <Link href="/ceo/search" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 hover:scale-105 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all">
                  <UserGroupIcon className="w-6 h-6 text-emerald-700" />
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-700 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">신규 가입 인재</h3>
              <p className="text-3xl font-bold text-emerald-700 mb-2">{networkingData.newMembers}</p>
              <p className="text-sm text-gray-600">이번 주 새로운 멤버</p>
              <div className="mt-3 flex items-center text-sm text-emerald-700 font-medium">
                <span>인재 탐색하기</span>
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* 커뮤니티 새 소식 카드 */}
        <Link href="/ceo/community" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 hover:scale-105 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg group-hover:from-amber-200 group-hover:to-amber-300 transition-all">
                  <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-amber-700" />
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-700 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">커뮤니티 새 소식</h3>
              <p className="text-3xl font-bold text-amber-700 mb-2">{networkingData.communityUpdates}</p>
              <p className="text-sm text-gray-600">새로운 게시글 & 공지</p>
              <div className="mt-3 flex items-center text-sm text-amber-700 font-medium">
                <span>소식 확인하기</span>
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* 주목할 만한 캡스톤 카드 */}
        <Link href="/ceo/capstone" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 hover:scale-105 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg group-hover:from-purple-200 group-hover:to-purple-300 transition-all">
                  <AcademicCapIcon className="w-6 h-6 text-purple-700" />
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-700 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">주목할 만한 캡스톤</h3>
              <p className="text-3xl font-bold text-purple-700 mb-2">{networkingData.featuredCapstones}</p>
              <p className="text-sm text-gray-600">우수 프로젝트 업데이트</p>
              <div className="mt-3 flex items-center text-sm text-purple-700 font-medium">
                <span>프로젝트 둘러보기</span>
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 네트워킹 인사이트 섹션 */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <LightBulbIcon className="w-6 h-6 text-indigo-600 mr-3" />
          네트워킹 인사이트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <ArrowRightIcon className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">연결 분석</h3>
            <p className="text-sm text-gray-600">네트워킹 패턴 및 효과성 분석</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <HeartIcon className="w-5 h-5 text-emerald-600" />
              <ArrowRightIcon className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">관심 매칭</h3>
            <p className="text-sm text-gray-600">맞춤형 인재 추천 시스템</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <StarIcon className="w-5 h-5 text-purple-600" />
              <ArrowRightIcon className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">성공 스토리</h3>
            <p className="text-sm text-gray-600">성공적인 협업 사례 분석</p>
          </div>
        </div>
      </div>

      {/* 최근 활동 피드 */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <ClockIcon className="w-6 h-6 text-gray-600 mr-3" />
          최근 활동 피드
        </h2>
        <div className="space-y-4">
          {/* 활동 아이템 1 */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer group">
            <div className="p-2 bg-blue-600 rounded-full flex-shrink-0">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 group-hover:text-blue-800">새로운 커피챗 제안이 도착했습니다</h3>
              <p className="text-sm text-gray-600 mt-1">
                {networkingData.newConnectionRequests > 0 
                  ? `${networkingData.newConnectionRequests}건의 새로운 커피챗 요청이 있습니다.`
                  : '현재 새로운 커피챗 요청이 없습니다.'
                }
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">실시간</p>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">실시간 업데이트</span>
              </div>
            </div>
          </div>

          {/* 활동 아이템 2 */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-all cursor-pointer group">
            <div className="p-2 bg-emerald-600 rounded-full flex-shrink-0">
              <UserGroupIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 group-hover:text-emerald-800">새로운 멤버가 가입했습니다</h3>
              <p className="text-sm text-gray-600 mt-1">
                {networkingData.newMembers > 0 
                  ? `이번 주에 ${networkingData.newMembers}명의 새로운 핀테크 전문가가 합류했습니다.`
                  : '이번 주에는 새로운 가입자가 없습니다.'
                }
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">이번 주</p>
                <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">신규 가입</span>
              </div>
            </div>
          </div>

          {/* 활동 아이템 3 */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-all cursor-pointer group">
            <div className="p-2 bg-amber-600 rounded-full flex-shrink-0">
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 group-hover:text-amber-800">커뮤니티에 새로운 토론 주제가 올라왔습니다</h3>
              <p className="text-sm text-gray-600 mt-1">"2024년 핀테크 트렌드 전망"에 대한 열띤 토론이 진행 중입니다.</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">2시간 전</p>
                <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded-full">활발한 토론</span>
              </div>
            </div>
          </div>

          {/* 활동 아이템 4 */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer group">
            <div className="p-2 bg-purple-600 rounded-full flex-shrink-0">
              <AcademicCapIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 group-hover:text-purple-800">우수 캡스톤 프로젝트가 업데이트되었습니다</h3>
              <p className="text-sm text-gray-600 mt-1">"스마트 투자 포트폴리오 AI" 프로젝트가 베타 버전을 공개했습니다.</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">3시간 전</p>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">프로젝트 업데이트</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors hover:underline">
            모든 활동 보기 →
          </button>
        </div>
      </div>

      {/* 오늘의 추천 네트워킹 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BellIcon className="w-6 h-6 text-yellow-300 mr-3" />
          오늘의 추천 네트워킹
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer">
            <h3 className="font-medium mb-2 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-blue-200" />
              관심사 맞춤 인재
            </h3>
            <p className="text-sm text-blue-100">
              {networkingData.newMembers > 0 
                ? `새로 가입한 ${networkingData.newMembers}명의 전문가와 연결해보세요.`
                : 'AI 및 블록체인 전문가들과 연결해보세요.'
              }
            </p>
            <div className="mt-2 text-xs bg-blue-500/30 text-blue-100 px-2 py-1 rounded-full inline-block">
              지금 연결하기 →
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer">
            <h3 className="font-medium mb-2 flex items-center">
              <CalendarDaysIcon className="w-5 h-5 mr-2 text-purple-200" />
              커피챗 일정 관리
            </h3>
            <p className="text-sm text-purple-100">
              {networkingData.newConnectionRequests > 0 
                ? `대기 중인 커피챗 제안 ${networkingData.newConnectionRequests}건을 확인해보세요.`
                : '새로운 커피챗 제안을 보내보세요.'
              }
            </p>
            <div className="mt-2 text-xs bg-purple-500/30 text-purple-100 px-2 py-1 rounded-full inline-block">
              일정 확인하기 →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




