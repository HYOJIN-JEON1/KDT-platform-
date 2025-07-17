"use client";

import React, { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon
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
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    jobType: 'ALL',
    experience: 'ALL',
    location: ''
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
      const queryParams = new URLSearchParams({
        userId: currentUser.id,
        ...(filters.jobType !== 'ALL' && { jobType: filters.jobType }),
        ...(filters.experience !== 'ALL' && { experience: filters.experience }),
        ...(filters.location && { location: filters.location }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/jobs?${queryParams}`);
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
  }, [currentUser, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">채용 공고</h1>
        <p className="mt-2 text-gray-600">
          서울대 KDT 프로그램 수료자를 위한 맞춤형 채용 정보를 확인하세요.
        </p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 검색 */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="제목, 회사명으로 검색"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 고용 형태 */}
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">모든 고용형태</option>
            <option value="FULL_TIME">정규직</option>
            <option value="PART_TIME">계약직</option>
            <option value="CONTRACT">프리랜서</option>
            <option value="INTERNSHIP">인턴십</option>
          </select>

          {/* 경력 */}
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">모든 경력</option>
            <option value="ENTRY">신입</option>
            <option value="JUNIOR">주니어</option>
            <option value="SENIOR">시니어</option>
            <option value="LEAD">리드</option>
          </select>

          {/* 지역 */}
          <input
            type="text"
            placeholder="지역 (예: 서울, 강남)"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 채용 공고 목록 */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              채용 공고가 없습니다
            </h3>
            <p className="text-gray-600">
              현재 조건에 맞는 채용 공고가 없습니다. 필터를 조정해보세요.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
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
                  <div className="flex items-center space-x-2 mb-3">
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
              </div>

              <div className="space-y-4">
                {/* 설명 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">담당 업무</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
                </div>

                {/* 요구사항 */}
                {job.requirements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">자격 요건</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{job.requirements}</p>
                  </div>
                )}

                {/* 기술 스택 */}
                {job.skills && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">기술 스택</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 혜택 */}
                {job.benefits && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">복리후생</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{job.benefits}</p>
                  </div>
                )}

                {/* 지원하기 버튼 */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    작성자: {job.author.name}
                  </div>
                  <a
                    href={`mailto:${job.contactEmail}?subject=[채용문의] ${job.title}&body=안녕하세요. ${job.title} 포지션에 관심이 있어 연락드립니다.`}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>지원하기</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 프로필 완성 안내 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          🎯 개인화된 채용 정보
        </h3>
        <p className="text-blue-700">
          프로필을 완성하면 더 정확한 채용 공고 추천을 받을 수 있습니다.
        </p>
      </div>
    </div>
  );
} 