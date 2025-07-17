"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserIcon, EnvelopeIcon, AcademicCapIcon, BriefcaseIcon, LinkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Profile {
  id: string;
  introduction: string;
  skills: string;
  experiences: any[];
  educations: any[];
  portfolios: any[];
  user: User;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      if (!userId || !currentUser?.id) return;
      
      setLoading(true);
      setError("");
      
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else if (res.status === 404) {
          setError("프로필을 찾을 수 없습니다.");
        } else {
          setError("프로필을 불러오는 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("프로필 로드 오류:", error);
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, currentUser]);

  // 커피챗 제안하기
  const handleCoffeeChatRequest = () => {
    if (currentUser?.role === 'TALENT') {
      router.push('/talent/networking');
    } else {
      router.push('/ceo/networking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">프로필을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium">{error}</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-600">프로필 정보가 없습니다.</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">프로필</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold">{profile.user.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="text-blue-100">{profile.user.email}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.user.role === 'CEO' 
                    ? 'bg-purple-400 text-white' 
                    : 'bg-blue-400 text-white'
                }`}>
                  {profile.user.role === 'CEO' ? 'CEO 과정생' : '핀테크 과정생'}
                </span>
              </div>
            </div>
            {/* 커피챗 버튼 */}
            {currentUser?.id !== userId && (
              <button
                onClick={handleCoffeeChatRequest}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                커피챗 제안하기
              </button>
            )}
          </div>
        </div>

        {/* 프로필 내용 */}
        <div className="p-8 space-y-8">
          {/* 자기소개 */}
          {profile.introduction && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="w-6 h-6 mr-2 text-blue-600" />
                자기소개
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">{profile.introduction}</p>
              </div>
            </div>
          )}

          {/* 기술 스택 */}
          {profile.skills && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">주요 기술 스택</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 경력 사항 */}
          {profile.experiences && profile.experiences.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BriefcaseIcon className="w-6 h-6 mr-2 text-green-600" />
                경력 사항
              </h3>
              <div className="space-y-4">
                {profile.experiences.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{exp.company}</h4>
                      <span className="text-sm text-gray-500">{exp.period}</span>
                    </div>
                    <p className="text-gray-600 font-medium">{exp.position}</p>
                    {exp.description && (
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 학력 사항 */}
          {profile.educations && profile.educations.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-purple-600" />
                학력 사항
              </h3>
              <div className="space-y-4">
                {profile.educations.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{edu.school}</h4>
                        <p className="text-gray-600">{edu.major}</p>
                      </div>
                      <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        {edu.status || edu.degree}
                      </span>
                    </div>
                    {edu.period && (
                      <p className="text-gray-500 text-sm mt-2">{edu.period}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 포트폴리오 */}
          {profile.portfolios && profile.portfolios.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2 text-orange-600" />
                포트폴리오
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolios.map((portfolio, index) => (
                  <a
                    key={index}
                    href={portfolio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {portfolio.title || portfolio.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{portfolio.url}</p>
                        {portfolio.description && (
                          <p className="text-sm text-gray-600 mt-1">{portfolio.description}</p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 빈 프로필 안내 */}
          {!profile.introduction && !profile.skills && 
           (!profile.experiences || profile.experiences.length === 0) &&
           (!profile.educations || profile.educations.length === 0) &&
           (!profile.portfolios || profile.portfolios.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>아직 프로필 정보가 작성되지 않았습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 