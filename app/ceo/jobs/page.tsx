"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  jobType: string;
  experience: string;
  skills: string;
  benefits: string;
  contactEmail: string;
  createdAt: string;
  isActive: boolean;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function JobManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    jobType: 'FULL_TIME',
    experience: 'JUNIOR',
    skills: '',
    benefits: '',
    contactEmail: ''
  });

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // 채용 공고 목록 로드
  const loadJobs = async () => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      } else {
        console.error('채용 공고 로드 실패');
      }
    } catch (error) {
      console.error('채용 공고 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [currentUser]);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorId: currentUser.id,
          contactEmail: formData.contactEmail || currentUser.email
        }),
      });

      if (response.ok) {
        alert('채용 공고가 성공적으로 등록되었습니다!');
        setShowJobForm(false);
        setFormData({
          title: '',
          company: '',
          location: '',
          description: '',
          requirements: '',
          salary: '',
          jobType: 'FULL_TIME',
          experience: 'JUNIOR',
          skills: '',
          benefits: '',
          contactEmail: ''
        });
        loadJobs();
      } else {
        const error = await response.json();
        alert(`오류: ${error.error}`);
      }
    } catch (error) {
      console.error('채용 공고 등록 오류:', error);
      alert('채용 공고 등록 중 오류가 발생했습니다.');
    }
  };

  const getJobTypeLabel = (jobType: string) => {
    const labels: { [key: string]: string } = {
      'FULL_TIME': '정규직',
      'PART_TIME': '계약직',
      'CONTRACT': '프리랜서',
      'INTERNSHIP': '인턴십'
    };
    return labels[jobType] || jobType;
  };

  const getExperienceLabel = (experience: string) => {
    const labels: { [key: string]: string } = {
      'ENTRY': '신입',
      'JUNIOR': '주니어',
      'SENIOR': '시니어',
      'LEAD': '리드'
    };
    return labels[experience] || experience;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">채용 공고를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
          <h1 className="text-3xl font-bold text-gray-900">채용 공고 관리</h1>
        <p className="mt-2 text-gray-600">
            우수한 핀테크 인재를 발굴하고 채용하세요.
        </p>
      </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>새 공고 등록</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 공고</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">활성 공고</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.filter(job => job.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
      </div>
      
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">이번 달 등록</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobs.filter(job => {
                  const jobDate = new Date(job.createdAt);
                  const now = new Date();
                  return jobDate.getMonth() === now.getMonth() && 
                         jobDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <PlusIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 채용 공고 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">내가 등록한 채용 공고</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <BuildingOfficeIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                등록된 채용 공고가 없습니다
        </h3>
              <p className="text-gray-600 mb-4">
                첫 번째 채용 공고를 등록해보세요.
              </p>
              <button
                onClick={() => setShowJobForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                공고 등록하기
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {job.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      {job.location && (
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center space-x-1">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {getJobTypeLabel(job.jobType)}
                      </span>
                      {job.experience && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {getExperienceLabel(job.experience)}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-3 line-clamp-2">{job.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 채용 공고 등록 모달 */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">새 채용 공고 등록</h2>
              <button
                onClick={() => setShowJobForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    채용 제목 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: React 프론트엔드 개발자"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 핀테크 스타트업 A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    근무 지역
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 서울 강남구"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    급여
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 연봉 4000-6000만원"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    고용 형태
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FULL_TIME">정규직</option>
                    <option value="PART_TIME">계약직</option>
                    <option value="CONTRACT">프리랜서</option>
                    <option value="INTERNSHIP">인턴십</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    경력
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ENTRY">신입</option>
                    <option value="JUNIOR">주니어 (1-3년)</option>
                    <option value="SENIOR">시니어 (3-7년)</option>
                    <option value="LEAD">리드 (7년+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  담당 업무 *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="담당하게 될 업무에 대해 설명해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자격 요건
                </label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="필요한 경험, 기술, 자격 요건을 설명해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기술 스택
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, Python (콤마로 구분)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  복리후생
                </label>
                <textarea
                  rows={2}
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="제공되는 복리후생을 설명해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 이메일
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비워두면 계정 이메일을 사용합니다"
                />
      </div>
      
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  공고 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 안내 카드 */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-green-900 mb-2">
          💼 우수 인재 풀
        </h3>
        <p className="text-green-700">
          핀테크와 AI 분야의 전문성을 갖춘 검증된 인재들과 연결하세요.
        </p>
      </div>
    </div>
  );
} 