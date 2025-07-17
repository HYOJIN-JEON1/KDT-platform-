"use client";

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarDaysIcon,
  LinkIcon,
  CodeBracketIcon,
  UsersIcon,
  StarIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

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

export default function CapstoneExplorationPage() {
  const [projects, setProjects] = useState<CapstonProject[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'trending'>('featured');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProject, setSelectedProject] = useState<CapstonProject | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 연락 메시지 폼
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    contactType: 'mentoring' // mentoring, investment, collaboration, hiring
  });

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // 가상 프로젝트 데이터 (실제로는 API에서)
  useEffect(() => {
    const mockProjects: CapstonProject[] = [
      {
        id: '1',
        title: 'AI 기반 주식 포트폴리오 최적화 시스템',
        description: '머신러닝을 활용하여 개인의 투자 성향과 시장 데이터를 분석해 최적의 포트폴리오를 추천하는 시스템입니다. 실시간 데이터 처리와 백테스팅 기능을 포함하며, 실제 금융회사에서 활용 가능한 수준으로 개발되었습니다.',
        techStack: '["Python", "TensorFlow", "React", "FastAPI", "PostgreSQL", "Docker", "AWS"]',
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
        description: '블록체인 기술을 활용한 투명하고 안전한 탄소 크레딧 거래 플랫폼입니다. 스마트 컨트랙트를 통해 자동화된 거래와 검증 시스템을 구현했으며, ESG 경영에 관심 있는 기업들의 탄소 중립 달성을 지원합니다.',
        techStack: '["Solidity", "Web3.js", "Next.js", "Ethereum", "IPFS", "Chainlink"]',
        githubUrl: 'https://github.com/example/carbon-credits',
        category: 'BLOCKCHAIN',
        status: 'IN_PROGRESS',
        teamSize: 3,
        duration: '4개월',
        likes: 18,
        views: 89,
        featured: true,
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
        description: '소상공인을 위한 AI 기반 신용평가 및 대출 심사 시스템입니다. 대안 데이터를 활용하여 기존 신용점수로는 평가하기 어려운 사업자들의 신용도를 분석하며, 실제 금융기관에서 파일럿 테스트를 진행했습니다.',
        techStack: '["Python", "Scikit-learn", "Flask", "Vue.js", "MySQL", "Redis"]',
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
      },
      {
        id: '4',
        title: '실시간 주식 거래 봇 플랫폼',
        description: '개인 투자자를 위한 자동 주식 거래 시스템입니다. 기술적 분석과 감정 분석을 결합하여 매매 신호를 생성하며, 백테스팅과 리스크 관리 기능을 포함합니다.',
        techStack: '["Python", "Django", "React", "WebSocket", "PostgreSQL"]',
        githubUrl: 'https://github.com/example/trading-bot',
        category: 'FINTECH',
        status: 'COMPLETED',
        teamSize: 2,
        duration: '5개월',
        likes: 15,
        views: 78,
        featured: false,
        createdAt: '2024-05-15T16:20:00Z',
        author: {
          id: 'user4',
          name: '정트레이딩',
          role: 'TALENT'
        },
        _count: {
          likes_users: 15,
          comments: 3
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
    if (activeTab === 'featured') {
      matchesTab = project.featured;
    } else if (activeTab === 'trending') {
      matchesTab = project.likes > 20; // 인기 프로젝트 기준
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
        (project.techStack && project.techStack.toLowerCase().includes(keyword)) ||
        project.author.name.toLowerCase().includes(keyword);
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

  // 프로젝트 팀에게 연락하기
  const handleContactTeam = () => {
    if (!selectedProject || !currentUser) return;

    // 실제로는 API를 통해 메시지 전송
    alert(`${selectedProject.author.name}님에게 ${contactForm.subject} 관련 연락을 보냈습니다!`);
    setShowContactModal(false);
    setContactForm({ subject: '', message: '', contactType: 'mentoring' });
    setSelectedProject(null);
  };

  // 연락 유형별 기본 메시지
  const getDefaultMessage = (type: string, projectTitle: string) => {
    switch (type) {
      case 'mentoring':
        return `안녕하세요. "${projectTitle}" 프로젝트에 대해 멘토링을 제공하고 싶습니다. 프로젝트의 기술적 완성도와 비즈니스 모델에 대해 논의하고 싶습니다.`;
      case 'investment':
        return `안녕하세요. "${projectTitle}" 프로젝트의 투자 가능성에 대해 관심이 있습니다. 비즈니스 플랜과 시장성에 대해 더 자세히 이야기하고 싶습니다.`;
      case 'collaboration':
        return `안녕하세요. "${projectTitle}" 프로젝트와 관련하여 협업 방안을 논의하고 싶습니다. 저희 회사의 리소스와 네트워크를 활용한 프로젝트 발전 방안을 제안드리고 싶습니다.`;
      case 'hiring':
        return `안녕하세요. "${projectTitle}" 프로젝트를 통해 보여주신 역량에 깊은 인상을 받았습니다. 저희 회사에서 함께 일할 기회에 대해 이야기하고 싶습니다.`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (selectedProject && contactForm.contactType) {
      const defaultMsg = getDefaultMessage(contactForm.contactType, selectedProject.title);
      setContactForm(prev => ({ ...prev, message: defaultMsg }));
    }
  }, [contactForm.contactType, selectedProject]);

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">캡스톤 둘러보기</h1>
        <p className="mt-2 text-gray-600">
          서울대 KDT 수료생들의 혁신적인 캡스톤 프로젝트를 탐색하고 비즈니스 기회를 발견하세요.
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="프로젝트 또는 개발자 검색..."
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
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🔥 인기 프로젝트
            </button>
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
          </nav>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* 프로젝트 이미지 */}
            <div className="h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <AcademicCapIcon className="w-20 h-20 text-blue-500" />
              )}
              {project.featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <StarIcon className="w-3 h-3 mr-1" />
                    우수 프로젝트
                  </span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
            </div>

            {/* 프로젝트 정보 */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 flex-1">
                  {project.title}
                </h3>
                <span className={`ml-3 text-xs px-2 py-1 rounded-full flex-shrink-0 ${
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
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                {project.description}
              </p>

              {/* 개발자 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">
                    개발자: {project.author.name}
                  </span>
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
              </div>

              {/* 기술 스택 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {parseTechStack(project.techStack).slice(0, 4).map((tech, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {parseTechStack(project.techStack).length > 4 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                      +{parseTechStack(project.techStack).length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    {project._count.likes_users}
                  </span>
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
                      title="GitHub 보기"
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
                      title="데모 보기"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowContactModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    연락하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트를 찾을 수 없습니다</h3>
          <p className="text-gray-500">
            검색 조건을 변경해보거나 다른 카테고리를 선택해보세요.
          </p>
        </div>
      )}

      {/* 연락하기 모달 */}
      {showContactModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">프로젝트 팀에게 연락하기</h2>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedProject(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedProject.title}</h3>
                <p className="text-sm text-gray-600">개발자: {selectedProject.author.name}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락 목적
                  </label>
                  <select
                    value={contactForm.contactType}
                    onChange={(e) => setContactForm(prev => ({ ...prev, contactType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="mentoring">멘토링 제공</option>
                    <option value="investment">투자 논의</option>
                    <option value="collaboration">협업 제안</option>
                    <option value="hiring">채용 제안</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="연락 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메시지
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="상세한 메시지를 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleContactTeam}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!contactForm.subject || !contactForm.message}
                >
                  연락 보내기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 