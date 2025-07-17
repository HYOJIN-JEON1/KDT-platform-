"use client";

import React, { useState, useEffect } from 'react';
import { 
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalProjects: 0,
    totalJobs: 0,
    pendingReports: 0,
    activeConnections: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // 가상 통계 데이터
    setStats({
      totalUsers: 156,
      totalPosts: 89,
      totalProjects: 23,
      totalJobs: 12,
      pendingReports: 3,
      activeConnections: 45
    });
  }, []);

  // 관리자 권한 확인
  if (!currentUser || currentUser.role !== 'CEO') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldCheckIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="mt-1 text-sm text-gray-500">SNU KDT 네트워킹 플랫폼 관리</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">관리자:</span>
              <span className="font-medium text-gray-900">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 전체 사용자 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">전체 사용자</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500">CEO: 45명, Talent: 111명</p>
              </div>
            </div>
          </div>

          {/* 게시글 수 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">총 게시글</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalPosts}</p>
                <p className="text-sm text-gray-500">이번 주 +12개</p>
              </div>
            </div>
          </div>

          {/* 캡스톤 프로젝트 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">캡스톤 프로젝트</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalProjects}</p>
                <p className="text-sm text-gray-500">우수: 8개, 진행중: 15개</p>
              </div>
            </div>
          </div>

          {/* 채용 공고 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">채용 공고</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalJobs}</p>
                <p className="text-sm text-gray-500">활성: 9개, 마감: 3개</p>
              </div>
            </div>
          </div>

          {/* 신고/검토 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">대기 중 신고</h3>
                <p className="text-3xl font-bold text-red-600">{stats.pendingReports}</p>
                <p className="text-sm text-gray-500">검토 필요</p>
              </div>
            </div>
          </div>

          {/* 활성 연결 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">현재 접속자</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.activeConnections}</p>
                <p className="text-sm text-gray-500">실시간</p>
              </div>
            </div>
          </div>
        </div>

        {/* 관리 메뉴들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 사용자 관리 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">사용자 관리</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">전체 사용자 목록</span>
                    <span className="text-sm text-gray-500">{stats.totalUsers}명</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">가입 승인 대기</span>
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">5개</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">정지된 계정</span>
                    <span className="text-sm text-gray-500">2명</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">활동 로그</span>
                    <span className="text-sm text-gray-500">실시간</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 컨텐츠 관리 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">컨텐츠 관리</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">신고된 게시글</span>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">{stats.pendingReports}개</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">캡스톤 프로젝트 승인</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">7개 대기</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">우수 프로젝트 선정</span>
                    <span className="text-sm text-gray-500">관리</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">공지사항 작성</span>
                    <span className="text-sm text-gray-500">+</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 시스템 현황 */}
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">시스템 현황</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-500">서버 가동률</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-gray-500">평균 응답 시간</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">256MB</div>
                  <div className="text-sm text-gray-500">데이터베이스 크기</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">최근 활동</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">새로운 사용자 가입</span>
                    <span className="text-gray-500">3분 전</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">캡스톤 프로젝트 등록</span>
                    <span className="text-gray-500">12분 전</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">새로운 채용 공고</span>
                    <span className="text-gray-500">1시간 전</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">커피챗 성사</span>
                    <span className="text-gray-500">2시간 전</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              공지사항 작성
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              프로젝트 승인
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              신고 처리
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              통계 내보내기
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              시스템 설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 