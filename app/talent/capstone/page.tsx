"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarDaysIcon,
  LinkIcon,
  CodeBracketIcon,
  UsersIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CapstonProject {
  id: string;
  title: string;
  description: string;
  techStack?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  category: string;
  status: string;
  teamSize: number;
  duration?: string;
  startDate?: string;
  endDate?: string;
  likes: number;
  views: number;
  featured: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  _count: {
    likes_users: number;
    comments: number;
  };
}

export default function CapstonePage() {
  const [projects, setProjects] = useState<CapstonProject[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // 프로젝트 폼 상태
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    demoUrl: '',
    category: 'WEB',
    teamSize: 1,
    duration: ''
  });

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // 가상 데이터 (API 연결 전까지)
  useEffect(() => {
    // 가상 프로젝트 데이터
    const mockProjects: CapstonProject[] = [
      {
        id: '1',
        title: 'AI 기반 주식 포트폴리오 최적화 시스템',
        description: '머신러닝을 활용하여 개인의 투자 성향과 시장 데이터를 분석해 최적의 포트폴리오를 추천하는 시스템입니다. 실시간 데이터 처리와 백테스팅 기능을 포함합니다.',
        techStack: '["Python", "TensorFlow", "React", "FastAPI", "PostgreSQL", "Docker"]',
        githubUrl: 'https://github.com/example/ai-portfolio',
        demoUrl: 'https://ai-portfolio-demo.vercel.app',
        category: 'AI',
        status: 'COMPLETED',
        teamSize: 4,
        duration: '6개월',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        likes: 23,
        views: 156,
        featured: true,
        createdAt: '2024-08-15T10:00:00Z',
        author: {
          id: 'user1',
          name: '김AI',
          role: 'TALENT'
        },
        _count: {
          likes_users: 23,
          comments: 8
        }
      },
      {
        id: '2',
        title: 'BlockChain 기반 탄소 크레딧 거래 플랫폼',
        description: '블록체인 기술을 활용한 투명하고 안전한 탄소 크레딧 거래 플랫폼입니다. 스마트 컨트랙트를 통해 자동화된 거래와 검증 시스템을 구현했습니다.',
        techStack: '["Solidity", "Web3.js", "Next.js", "Ethereum", "IPFS"]',
        githubUrl: 'https://github.com/example/carbon-credits',
        category: 'BLOCKCHAIN',
        status: 'IN_PROGRESS',
        teamSize: 3,
        duration: '4개월',
        likes: 18,
        views: 89,
        featured: false,
        createdAt: '2024-07-20T14:30:00Z',
        author: {
          id: 'user2',
          name: '박블록',
          role: 'TALENT'
        },
        _count: {
          likes_users: 18,
          comments: 5
        }
      },
      {
        id: '3',
        title: '핀테크 소상공인 대출 심사 시스템',
        description: '소상공인을 위한 AI 기반 신용평가 및 대출 심사 시스템입니다. 대안 데이터를 활용하여 기존 신용점수로는 평가하기 어려운 사업자들의 신용도를 분석합니다.',
        techStack: '["Python", "Scikit-learn", "Flask", "Vue.js", "MySQL"]',
        githubUrl: 'https://github.com/example/loan-system',
        demoUrl: 'https://loan-demo.herokuapp.com',
        category: 'FINTECH',
        status: 'COMPLETED',
        teamSize: 5,
        duration: '8개월',
        likes: 31,
        views: 203,
        featured: true,
        createdAt: '2024-06-10T09:15:00Z',
        author: {
          id: 'user3',
          name: '이핀테크',
          role: 'TALENT'
        },
        _count: {
          likes_users: 31,
          comments: 12
        }
      }
    ];

    setProjects(mockProjects);
    setLoading(false);
  }, []);

  // 프로젝트 필터링
  const filteredProjects = projects.filter(project => {
    let matchesTab = true;
    let matchesCategory = true;
    let matchesSearch = true;

    // 탭 필터
    if (activeTab === 'my' && currentUser) {
      matchesTab = project.author.id === currentUser.id;
    } else if (activeTab === 'featured') {
      matchesTab = project.featured;
    }

    // 카테고리 필터
    if (categoryFilter !== 'ALL') {
      matchesCategory = project.category === categoryFilter;
    }

    // 검색 필터
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      matchesSearch = 
        project.title.toLowerCase().includes(keyword) ||
        project.description.toLowerCase().includes(keyword) ||
        (project.techStack && project.techStack.toLowerCase().includes(keyword));
    }

    return matchesTab && matchesCategory && matchesSearch;
  });

  // 기술 스택 파싱
  const parseTechStack = (techStack?: string): string[] => {
    if (!techStack) return [];
    try {
      return JSON.parse(techStack);
    } catch {
      return techStack.split(',').map(tech => tech.trim());
    }
  };

  // 프로젝트 생성
  const handleCreateProject = async () => {
    if (!currentUser || !projectForm.title || !projectForm.description) {
      alert('제목과 설명을 입력해주세요.');
      return;
    }

    // 여기서 실제 API 호출
    const newProject: CapstonProject = {
      id: `new-${Date.now()}`,
      title: projectForm.title,
      description: projectForm.description,
      techStack: JSON.stringify(projectForm.techStack.split(',').map(t => t.trim())),
      githubUrl: projectForm.githubUrl || undefined,
      demoUrl: projectForm.demoUrl || undefined,
      category: projectForm.category,
      status: 'IN_PROGRESS',
      teamSize: projectForm.teamSize,
      duration: projectForm.duration || undefined,
      likes: 0,
      views: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      },
      _count: {
        likes_users: 0,
        comments: 0
      }
    };

    setProjects(prev => [newProject, ...prev]);
    setShowCreateForm(false);
    setProjectForm({
      title: '', description: '', techStack: '', githubUrl: '', demoUrl: '', 
      category: 'WEB', teamSize: 1, duration: ''
    });
    alert('프로젝트가 성공적으로 등록되었습니다!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">캡스톤 프로젝트 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">캡스톤 허브</h1>
          <p className="mt-2 text-gray-600">
            혁신적인 캡스톤 프로젝트를 통해 실무 경험을 쌓고 포트폴리오를 강화하세요.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          프로젝트 등록
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 카테고리 필터 */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">모든 카테고리</option>
            <option value="WEB">웹 개발</option>
            <option value="MOBILE">모바일 앱</option>
            <option value="AI">AI/머신러닝</option>
            <option value="BLOCKCHAIN">블록체인</option>
            <option value="FINTECH">핀테크</option>
            <option value="IOT">IoT</option>
          </select>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              전체 프로젝트
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'featured'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <StarIcon className="w-4 h-4 inline mr-2" />
              우수 프로젝트
            </button>
            {currentUser && (
              <button
                onClick={() => setActiveTab('my')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                내 프로젝트
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* 프로젝트 이미지 */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <AcademicCapIcon className="w-16 h-16 text-blue-500" />
              )}
              {project.featured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <StarIcon className="w-3 h-3 mr-1" />
                    우수 프로젝트
                  </span>
                </div>
              )}
            </div>

            {/* 프로젝트 정보 */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {project.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : project.status === 'IN_PROGRESS'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'COMPLETED' ? '완료' : 
                   project.status === 'IN_PROGRESS' ? '진행중' : '일시정지'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {project.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* 기술 스택 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {parseTechStack(project.techStack).slice(0, 3).map((tech, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {parseTechStack(project.techStack).length > 3 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                      +{parseTechStack(project.techStack).length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* 프로젝트 메타 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    {project.teamSize}명
                  </span>
                  {project.duration && (
                    <span className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      {project.duration}
                    </span>
                  )}
                </div>
                <span className="text-xs">
                  by {project.author.name}
                </span>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    {project._count.likes_users}
                  </button>
                  <span className="flex items-center text-sm text-gray-500">
                    <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                    {project._count.comments}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {project.views}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <CodeBracketIcon className="w-5 h-5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'my' 
              ? '첫 번째 캡스톤 프로젝트를 등록해보세요!' 
              : '조건에 맞는 프로젝트를 찾을 수 없습니다.'}
          </p>
          {activeTab === 'my' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              프로젝트 등록하기
            </button>
          )}
        </div>
      )}

      {/* 프로젝트 생성 모달 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">새 캡스톤 프로젝트 등록</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    프로젝트 제목 *
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="프로젝트 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    프로젝트 설명 *
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="프로젝트에 대한 상세한 설명을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="WEB">웹 개발</option>
                      <option value="MOBILE">모바일 앱</option>
                      <option value="AI">AI/머신러닝</option>
                      <option value="BLOCKCHAIN">블록체인</option>
                      <option value="FINTECH">핀테크</option>
                      <option value="IOT">IoT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      팀 크기
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={projectForm.teamSize}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    기술 스택 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, techStack: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Node.js, Python, TensorFlow"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      데모 URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.demoUrl}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, demoUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://your-demo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    프로젝트 기간
                  </label>
                  <input
                    type="text"
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 3개월, 6개월"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 