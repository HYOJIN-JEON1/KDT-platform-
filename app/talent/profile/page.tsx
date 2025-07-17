"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
}

interface Education {
  id: string;
  school: string;
  major: string;
  status: string;
}

interface Portfolio {
  id: string;
  name: string;
  url: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser?.id) return;
      
      try {
        const res = await fetch(`/api/profile?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          const profile = data.profile;
          
          // 프로필 정보
          setIntroduction(profile.introduction || "");
          setSkills(profile.skills || "");
          setExperiences(profile.experiences || []);
          setEducations(profile.educations || []);
          setPortfolios(profile.portfolios || []);
        } else {
          // 프로필이 없는 경우 (404) - 새 프로필 생성 모드
          console.log("기존 프로필이 없습니다. 새 프로필을 생성할 수 있습니다.");
        }
      } catch (error) {
        console.error("프로필 로드 오류:", error);
      }
    };

    loadProfile();
  }, [currentUser]);

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      period: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      major: "",
      status: "",
    };
    setEducations([...educations, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addPortfolio = () => {
    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name: "",
      url: "",
    };
    setPortfolios([...portfolios, newPortfolio]);
  };

  const removePortfolio = (id: string) => {
    setPortfolios(portfolios.filter(port => port.id !== id));
  };

  const updatePortfolio = (id: string, field: keyof Portfolio, value: string) => {
    setPortfolios(portfolios.map(port => 
      port.id === id ? { ...port, [field]: value } : port
    ));
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      setMessage("로그인이 필요합니다.");
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          introduction,
          skills,
          experiences,
          educations,
          portfolios,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("프로필이 성공적으로 저장되었습니다! 🎉");
      } else {
        setMessage(`오류: ${data.error}`);
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
      console.error("프로필 저장 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">내 프로필</h1>
      
      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* 기본 정보 (수정 불가) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
            <input
              type="text"
              value={name}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        {/* 자기소개 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">자기소개</label>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="자신을 소개해주세요..."
          />
        </div>

        {/* 기술 스택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">주요 기술 스택</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Python, JavaScript, React, AI/ML (콤마로 구분)"
          />
        </div>

        {/* 경력 사항 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">경력 사항</label>
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              추가
            </button>
          </div>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="회사명"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="직무"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="기간 (예: 2022.01-2023.12)"
                    value={exp.period}
                    onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 학력 사항 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">학력 사항</label>
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              추가
            </button>
          </div>
          <div className="space-y-4">
            {educations.map((edu) => (
              <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="학교명"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="전공"
                  value={edu.major}
                  onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="졸업 여부 (예: 졸업, 재학)"
                    value={edu.status}
                    onChange={(e) => updateEducation(edu.id, 'status', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 포트폴리오 URL */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">포트폴리오 URL</label>
            <button
              type="button"
              onClick={addPortfolio}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              추가
            </button>
          </div>
          <div className="space-y-4">
            {portfolios.map((port) => (
              <div key={port.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="사이트명 (예: GitHub, 개인 웹사이트)"
                  value={port.name}
                  onChange={(e) => updatePortfolio(port.id, 'name', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://github.com/yourname"
                    value={port.url}
                    onChange={(e) => updatePortfolio(port.id, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePortfolio(port.id)}
                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className={`p-4 rounded-lg ${message.includes('성공') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "저장 중..." : "프로필 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
