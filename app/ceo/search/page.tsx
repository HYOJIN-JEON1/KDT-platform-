"use client";

import React, { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  TagIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TALENT' | 'CEO';
  createdAt: string;
  profile?: {
    id: string;
    introduction?: string;
    skills?: string;
    experiences?: any[];
    educations?: any[];
    portfolios?: any[];
  };
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'TALENT' | 'CEO';
}

export default function UserSearchPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 제안 폼 상태
  const [proposalForm, setProposalForm] = useState({
    title: '',
    message: '',
    proposedDateTime: '',
    location: ''
  });

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // 모든 사용자 프로필 로드
  const loadAllUsers = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`/api/users?currentUserId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else {
        console.error('사용자 목록 로드 실패');
      }
    } catch (error) {
      console.error('사용자 목록 로드 오류:', error);
    }
  };

  // 데이터 로드
  useEffect(() => {
    if (currentUser?.id) {
      loadAllUsers().finally(() => {
        setLoading(false);
      });
    }
  }, [currentUser]);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = users;

    // 카테고리 필터 (기술 스택 기반)
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(user => {
        const skills = user.profile?.skills?.toLowerCase() || '';
        const introduction = user.profile?.introduction?.toLowerCase() || '';
        const experiences = user.profile?.experiences?.map(exp => JSON.stringify(exp).toLowerCase()).join(' ') || '';
        const educations = user.profile?.educations?.map(edu => JSON.stringify(edu).toLowerCase()).join(' ') || '';
        
        const allContent = `${skills} ${introduction} ${experiences} ${educations}`;
        
        switch (categoryFilter) {
          case 'CEO':
            return user.role === 'CEO';
          case '핀테크':
            return allContent.includes('핀테크') || allContent.includes('fintech') || 
                   allContent.includes('금융') || allContent.includes('은행') || allContent.includes('결제');
          case 'AI':
            return allContent.includes('ai') || allContent.includes('인공지능') || 
                   allContent.includes('machine learning') || allContent.includes('딥러닝') ||
                   allContent.includes('tensorflow') || allContent.includes('pytorch');
          case '백엔드':
            return allContent.includes('backend') || allContent.includes('백엔드') ||
                   allContent.includes('server') || allContent.includes('api') ||
                   allContent.includes('node') || allContent.includes('spring') ||
                   allContent.includes('django') || allContent.includes('flask');
          case '프론트엔드':
            return allContent.includes('frontend') || allContent.includes('프론트엔드') ||
                   allContent.includes('react') || allContent.includes('vue') ||
                   allContent.includes('angular') || allContent.includes('javascript') ||
                   allContent.includes('typescript') || allContent.includes('css');
          case '빅데이터':
            return allContent.includes('빅데이터') || allContent.includes('big data') ||
                   allContent.includes('data') || allContent.includes('분석') ||
                   allContent.includes('pandas') || allContent.includes('numpy') ||
                   allContent.includes('spark') || allContent.includes('hadoop');
          case '블록체인':
            return allContent.includes('blockchain') || allContent.includes('블록체인') ||
                   allContent.includes('ethereum') || allContent.includes('web3') ||
                   allContent.includes('solidity') || allContent.includes('crypto');
          case '모바일':
            return allContent.includes('mobile') || allContent.includes('모바일') ||
                   allContent.includes('android') || allContent.includes('ios') ||
                   allContent.includes('flutter') || allContent.includes('react native');
          default:
            return true;
        }
      });
    }

    // 키워드 검색 (이름, 자기소개, 기술스택, 경험, 학력)
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(user => {
        const skills = user.profile?.skills?.toLowerCase() || '';
        const introduction = user.profile?.introduction?.toLowerCase() || '';
        const experiences = user.profile?.experiences?.map(exp => JSON.stringify(exp).toLowerCase()).join(' ') || '';
        const educations = user.profile?.educations?.map(edu => JSON.stringify(edu).toLowerCase()).join(' ') || '';
        
        return user.name?.toLowerCase().includes(keyword) ||
               user.email?.toLowerCase().includes(keyword) ||
               introduction.includes(keyword) ||
               skills.includes(keyword) ||
               experiences.includes(keyword) ||
               educations.includes(keyword);
      });
    }

    setFilteredUsers(filtered);
  }, [users, categoryFilter, searchKeyword]);

  // 커피챗 제안 보내기
  const handleSendProposal = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposerId: currentUser.id,
          receiverId: selectedUser.id,
          title: proposalForm.title,
          message: proposalForm.message,
          proposedDateTime: proposalForm.proposedDateTime || null,
          location: proposalForm.location || null
        })
      });

      if (response.ok) {
        alert('커피챗 제안이 성공적으로 전송되었습니다!');
        setShowProposalModal(false);
        setProposalForm({ title: '', message: '', proposedDateTime: '', location: '' });
      } else {
        const error = await response.json();
        alert(`제안 전송 실패: ${error.error}`);
      }
    } catch (error) {
      console.error('제안 전송 오류:', error);
      alert('제안 전송 중 오류가 발생했습니다.');
    }
  };

  // 기술 스택 파싱 (쉼표로 구분된 문자열을 배열로)
  const parseSkills = (skills?: string): string[] => {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  // 자동 분류 함수
  const categorizeUsers = (users: User[]) => {
    const categories = {
      'AI/머신러닝 전문가': users.filter(user => 
        user.profile?.skills?.toLowerCase().includes('ai') ||
        user.profile?.skills?.toLowerCase().includes('machine learning') ||
        user.profile?.skills?.toLowerCase().includes('딥러닝') ||
        user.profile?.skills?.toLowerCase().includes('tensorflow') ||
        user.profile?.skills?.toLowerCase().includes('pytorch')
      ),
      '블록체인 개발자': users.filter(user => 
        user.profile?.skills?.toLowerCase().includes('blockchain') ||
        user.profile?.skills?.toLowerCase().includes('ethereum') ||
        user.profile?.skills?.toLowerCase().includes('web3') ||
        user.profile?.skills?.toLowerCase().includes('solidity')
      ),
      '웹 개발자': users.filter(user => 
        user.profile?.skills?.toLowerCase().includes('react') ||
        user.profile?.skills?.toLowerCase().includes('vue') ||
        user.profile?.skills?.toLowerCase().includes('javascript') ||
        user.profile?.skills?.toLowerCase().includes('typescript') ||
        user.profile?.skills?.toLowerCase().includes('node')
      ),
      '핀테크 CEO': users.filter(user => user.role === 'CEO'),
      '데이터 사이언티스트': users.filter(user => 
        user.profile?.skills?.toLowerCase().includes('python') ||
        user.profile?.skills?.toLowerCase().includes('data') ||
        user.profile?.skills?.toLowerCase().includes('pandas') ||
        user.profile?.skills?.toLowerCase().includes('numpy')
      )
    };
    
    return Object.entries(categories).filter(([_, userList]) => userList.length > 0);
  };

  const openProposalModal = (user: User) => {
    setSelectedUser(user);
    setProposalForm({
      title: `${user.name}님과의 커피챗`,
      message: `안녕하세요 ${user.name}님,\n\n저는 ${currentUser?.name}입니다. 귀하의 프로필을 보고 많은 관심이 생겨 커피챗을 제안드리고 싶습니다.\n\n서로의 경험과 인사이트를 나누는 의미있는 시간이 되었으면 좋겠습니다.\n\n감사합니다.`,
      proposedDateTime: '',
      location: ''
    });
    setShowProposalModal(true);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const categorizedUsers = categorizeUsers(filteredUsers);

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">회원 프로필 검색</h1>
        <p className="mt-2 text-gray-600">
          핀테크 과정 수료생과 CEO들의 프로필을 탐색하고 커피챗을 제안해보세요.
        </p>
      </div>
      
      {/* 검색 및 필터링 UI */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          {/* 키워드 검색 */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 자기소개, 기술스택으로 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">분야 필터:</span>
            {[
              { key: 'ALL', label: '전체' },
              { key: 'CEO', label: 'CEO' },
              { key: '핀테크', label: '핀테크' },
              { key: 'AI', label: 'AI' },
              { key: '백엔드', label: '백엔드' },
              { key: '프론트엔드', label: '프론트엔드' },
              { key: '빅데이터', label: '빅데이터' },
              { key: '블록체인', label: '블록체인' },
              { key: '모바일', label: '모바일' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 검색 결과 요약 */}
          <div className="text-sm text-gray-600">
            총 {filteredUsers.length}명의 프로필을 찾았습니다.
          </div>
        </div>
      </div>
      
      {/* 자동 분류 섹션 */}
      {categorizedUsers.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">전문 분야별 분류</h2>
          {categorizedUsers.map(([category, categoryUsers]) => (
            <div key={category} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TagIcon className="h-5 w-5 text-blue-600 mr-2" />
                {category} ({categoryUsers.length}명)
        </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryUsers.slice(0, 6).map((user) => (
                  <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'CEO' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'CEO' ? 'CEO' : '핀테크 전문가'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {user.profile?.introduction || '자기소개가 없습니다.'}
                    </p>
                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => openProposalModal(user)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        커피챗 제안하기
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 전체 프로필 카드 목록 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">모든 프로필</h2>
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">검색 조건에 맞는 프로필이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                {/* 프로필 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === 'CEO' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'CEO' ? 'CEO' : '핀테크 전문가'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 자기소개 */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {user.profile?.introduction || '자기소개가 등록되지 않았습니다.'}
        </p>
      </div>
      
                {/* 기술 스택 */}
                {user.profile?.skills && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">기술 스택</h4>
                    <div className="flex flex-wrap gap-1">
                      {parseSkills(user.profile.skills).slice(0, 4).map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {parseSkills(user.profile.skills).length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          +{parseSkills(user.profile.skills).length - 4}개 더
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 경험/학력 요약 */}
                <div className="mb-4 space-y-2">
                  {user.profile?.experiences && user.profile.experiences.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      <span>경험 {user.profile.experiences.length}개</span>
                    </div>
                  )}
                  {user.profile?.educations && user.profile.educations.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      <span>학력 {user.profile.educations.length}개</span>
                    </div>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="mt-4">
                  {user.id === currentUser.id ? (
                    <div className="bg-gray-100 text-gray-600 text-center py-2 px-4 rounded-md text-sm">
                      내 프로필
                    </div>
                  ) : (
                    <button
                      onClick={() => openProposalModal(user)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      커피챗 제안하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 커피챗 제안 모달 */}
      {showProposalModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedUser.name}님께 커피챗 제안
        </h3>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="커피챗 제목을 입력하세요"
                />
              </div>

              {/* 메시지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메시지
                </label>
                <textarea
                  value={proposalForm.message}
                  onChange={(e) => setProposalForm({ ...proposalForm, message: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="제안 메시지를 입력하세요"
                />
              </div>

              {/* 날짜/시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  희망 날짜/시간 (선택사항)
                </label>
                <input
                  type="datetime-local"
                  value={proposalForm.proposedDateTime}
                  onChange={(e) => setProposalForm({ ...proposalForm, proposedDateTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 장소 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  희망 장소 (선택사항)
                </label>
                <input
                  type="text"
                  value={proposalForm.location}
                  onChange={(e) => setProposalForm({ ...proposalForm, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 강남역 스타벅스"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProposalModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSendProposal}
                disabled={!proposalForm.title.trim() || !proposalForm.message.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                제안 보내기
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
} 