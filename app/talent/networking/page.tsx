"use client";

import React, { useState, useEffect } from "react";
import { UserIcon, CalendarIcon, ClockIcon, CheckIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TALENT' | 'CEO';
}

interface MeetingProposal {
  id: string;
  title: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELED';
  proposedDateTime?: string;
  location?: string;
  createdAt: string;
  proposer: User;
  receiver: User;
}

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'received' | 'sent'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [receivedProposals, setReceivedProposals] = useState<MeetingProposal[]>([]);
  const [sentProposals, setSentProposals] = useState<MeetingProposal[]>([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  // 사용자 목록 로드
  const loadUsers = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`/api/users?currentUserId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('사용자 목록 로드 실패');
      }
    } catch (error) {
      console.error('사용자 목록 로드 오류:', error);
    }
  };

  // 받은 제안 목록 로드
  const loadReceivedProposals = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`/api/proposals/received?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setReceivedProposals(data.proposals);
      } else {
        console.error('받은 제안 목록 로드 실패');
      }
    } catch (error) {
      console.error('받은 제안 목록 로드 오류:', error);
    }
  };

  // 보낸 제안 목록 로드
  const loadSentProposals = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`/api/proposals/sent?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setSentProposals(data.proposals);
      } else {
        console.error('보낸 제안 목록 로드 실패');
      }
    } catch (error) {
      console.error('보낸 제안 목록 로드 오류:', error);
    }
  };

  // 데이터 로드
  useEffect(() => {
    if (currentUser?.id) {
      Promise.all([
        loadUsers(),
        loadReceivedProposals(),
        loadSentProposals()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [currentUser]);

  // 제안 보내기
  const handleSendProposal = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposerId: currentUser.id,
          receiverId: selectedUser.id,
          title: proposalForm.title,
          message: proposalForm.message,
          proposedDateTime: proposalForm.proposedDateTime || null,
          location: proposalForm.location || null,
        }),
      });

      if (response.ok) {
        alert('만남 제안이 성공적으로 전송되었습니다!');
        setShowProposalForm(false);
        setProposalForm({ title: '', message: '', proposedDateTime: '', location: '' });
        setSelectedUser(null);
        // 보낸 제안 목록 새로고침
        await loadSentProposals();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('제안 전송 오류:', error);
      alert('제안 전송 중 오류가 발생했습니다.');
    }
  };

  // 제안 상태 업데이트
  const handleUpdateProposalStatus = async (proposalId: string, status: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          status: status,
        }),
      });

      if (response.ok) {
        alert(`제안이 ${status === 'ACCEPTED' ? '수락' : '거절'}되었습니다.`);
        // 받은 제안 목록 새로고침
        await loadReceivedProposals();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('제안 상태 업데이트 오류:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">커피챗</h1>
        <p className="mt-2 text-gray-600">
          동기, 선배, 기업 관계자들과 커피챗을 통해 의미 있는 관계를 구축하세요.
        </p>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon className="w-5 h-5 inline mr-2" />
            사용자 목록
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarIcon className="w-5 h-5 inline mr-2" />
            받은 제안
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5 inline mr-2" />
            보낸 제안
          </button>
        </nav>
      </div>
      
      {/* 사용자 목록 탭 */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.role === 'CEO' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'CEO' ? 'CEO 과정생' : '핀테크 과정생'}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  프로필 보기
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowProposalForm(true);
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  만남 제안하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 받은 제안 탭 */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              받은 만남 제안이 없습니다.
            </div>
          ) : (
            receivedProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {proposal.proposer.name} ({proposal.proposer.role === 'CEO' ? 'CEO 과정생' : '핀테크 과정생'})
                    </p>
                    <p className="text-gray-700 mt-2">{proposal.message}</p>
                    {proposal.proposedDateTime && (
                      <p className="text-sm text-gray-500 mt-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        제안 일시: {new Date(proposal.proposedDateTime).toLocaleString()}
                      </p>
                    )}
                    {proposal.location && (
                      <p className="text-sm text-gray-500">
                        📍 장소: {proposal.location}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {proposal.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateProposalStatus(proposal.id, 'ACCEPTED')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          <CheckIcon className="w-4 h-4 inline mr-1" />
                          수락
                        </button>
                        <button
                          onClick={() => handleUpdateProposalStatus(proposal.id, 'REJECTED')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          <XMarkIcon className="w-4 h-4 inline mr-1" />
                          거절
                        </button>
                      </>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      proposal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {proposal.status === 'PENDING' ? '대기중' :
                       proposal.status === 'ACCEPTED' ? '수락됨' :
                       proposal.status === 'REJECTED' ? '거절됨' : proposal.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 보낸 제안 탭 */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              보낸 만남 제안이 없습니다.
            </div>
          ) : (
            sentProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      받는 사람: {proposal.receiver.name} ({proposal.receiver.role === 'CEO' ? 'CEO 과정생' : '핀테크 과정생'})
                    </p>
                    <p className="text-gray-700 mt-2">{proposal.message}</p>
                    {proposal.proposedDateTime && (
                      <p className="text-sm text-gray-500 mt-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        제안 일시: {new Date(proposal.proposedDateTime).toLocaleString()}
                      </p>
                    )}
                    {proposal.location && (
                      <p className="text-sm text-gray-500">
                        📍 장소: {proposal.location}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    proposal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    proposal.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {proposal.status === 'PENDING' ? '대기중' :
                     proposal.status === 'ACCEPTED' ? '수락됨' :
                     proposal.status === 'REJECTED' ? '거절됨' : proposal.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 제안 작성 모달 */}
      {showProposalForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedUser.name}님에게 만남 제안하기
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제안 제목 *
                </label>
                <input
                  type="text"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                  placeholder="예: 커피챗 제안"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메시지 *
                </label>
                <textarea
                  value={proposalForm.message}
                  onChange={(e) => setProposalForm({...proposalForm, message: e.target.value})}
                  placeholder="만남의 목적과 간단한 소개를 적어주세요."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  희망 일시 (선택사항)
                </label>
                <input
                  type="datetime-local"
                  value={proposalForm.proposedDateTime}
                  onChange={(e) => setProposalForm({...proposalForm, proposedDateTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
      </div>
      
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  희망 장소 (선택사항)
                </label>
                <input
                  type="text"
                  value={proposalForm.location}
                  onChange={(e) => setProposalForm({...proposalForm, location: e.target.value})}
                  placeholder="예: 강남역 스타벅스"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
      </div>
      
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSendProposal}
                disabled={!proposalForm.title || !proposalForm.message}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                제안 보내기
              </button>
              <button
                onClick={() => {
                  setShowProposalForm(false);
                  setSelectedUser(null);
                  setProposalForm({ title: '', message: '', proposedDateTime: '', location: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
} 