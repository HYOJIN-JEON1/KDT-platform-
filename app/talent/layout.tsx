"use client";

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserCircleIcon, BriefcaseIcon, AcademicCapIcon, UsersIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 네비게이션 메뉴 항목들
  const navigationItems = [
    {
      name: '대시보드',
      href: '/talent',
      icon: HomeIcon,
    },
    {
      name: '내 프로필',
      href: '/talent/profile',
      icon: UserCircleIcon,
    },
    {
      name: '커피챗',
      href: '/talent/networking',
      icon: UsersIcon,
    },
    {
      name: '네트워킹 광장',
      href: '/talent/forum',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: '채용 공고',
      href: '/talent/jobs',
      icon: BriefcaseIcon,
    },
    {
      name: '캡스톤 허브',
      href: '/talent/capstone',
      icon: AcademicCapIcon,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 fixed inset-y-0 left-0 z-20">
        <nav className="flex flex-col gap-6">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : ''}`} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
