"use client";

import React, { useState, useEffect } from "react";
import { 
  PlusIcon, 
  ChatBubbleLeftIcon,
  UserIcon,
  ClockIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TALENT' | 'CEO';
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: User;
  comments: Comment[];
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'TALENT' | 'CEO';
}

export default function TalentForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');

  // 새 게시글 폼 상태
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // 게시글 목록 로드
  const loadPosts = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`/api/posts?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error('게시글 목록 로드 실패');
      }
    } catch (error) {
      console.error('게시글 목록 로드 오류:', error);
    }
  };

  // 데이터 로드
  useEffect(() => {
    if (currentUser?.id) {
      loadPosts().finally(() => {
        setLoading(false);
      });
    }
  }, [currentUser]);

  // 새 게시글 작성
  const handleCreatePost = async () => {
    if (!currentUser || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          authorId: currentUser.id
        })
      });

      if (response.ok) {
        alert('게시글이 성공적으로 작성되었습니다!');
        setShowNewPostModal(false);
        setNewPost({ title: '', content: '' });
        loadPosts(); // 목록 새로고침
      } else {
        const error = await response.json();
        alert(`게시글 작성 실패: ${error.error}`);
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  // 댓글 작성
  const handleAddComment = async (postId: string) => {
    if (!currentUser || !newComment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          postId: postId,
          authorId: currentUser.id
        })
      });

      if (response.ok) {
        setNewComment('');
        loadPosts(); // 목록 새로고침
        // 선택된 게시글 업데이트
        if (selectedPost && selectedPost.id === postId) {
          const updatedPost = posts.find(p => p.id === postId);
          if (updatedPost) setSelectedPost(updatedPost);
        }
      } else {
        const error = await response.json();
        alert(`댓글 작성 실패: ${error.error}`);
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  // 시간 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return date.toLocaleDateString('ko-KR');
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
          <p className="mt-4 text-gray-600">게시글을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">네트워킹 광장</h1>
          <p className="mt-2 text-gray-600">
            핀테크 & AI 커뮤니티 멤버들과 자유롭게 소통하고 네트워킹하세요.
          </p>
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          새 글 작성
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">아직 게시글이 없습니다.</p>
            <p className="text-gray-500 text-sm mt-2">첫 번째 게시글을 작성해보세요!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                        post.author.role === 'CEO' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.author.role === 'CEO' ? 'CEO' : '핀테크 전문가'}
                      </span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  {post.comments.length}개의 댓글
                </div>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  자세히 보기
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 새 게시글 작성 모달 */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">새 게시글 작성</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="게시글 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="게시글 내용을 입력하세요"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                작성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 상세보기 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">게시글 상세보기</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 게시글 내용 */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedPost.author.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedPost.author.name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      selectedPost.author.role === 'CEO' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedPost.author.role === 'CEO' ? 'CEO' : '핀테크 전문가'}
                    </span>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {formatDate(selectedPost.createdAt)}
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedPost.content}
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                댓글 ({selectedPost.comments.length})
              </h4>

              {/* 댓글 작성 */}
              <div className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="댓글을 입력하세요..."
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleAddComment(selectedPost.id)}
                        disabled={!newComment.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        댓글 작성
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {comment.author.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{comment.author.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              comment.author.role === 'CEO' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {comment.author.role === 'CEO' ? 'CEO' : '핀테크 전문가'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedPost.comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ChatBubbleLeftIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>아직 댓글이 없습니다.</p>
                    <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 