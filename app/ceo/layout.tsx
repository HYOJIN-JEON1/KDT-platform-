"use client";

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function CEOLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: '대시보드', href: '/ceo', icon: HomeIcon },
    { name: '인재 검색', href: '/ceo/search', icon: MagnifyingGlassIcon },
    { name: '커피챗', href: '/ceo/networking', icon: UsersIcon },
    { name: '네트워킹 광장', href: '/ceo/forum', icon: ChatBubbleLeftRightIcon },
    { name: '캡스톤 둘러보기', href: '/ceo/capstone', icon: AcademicCapIcon },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 fixed inset-y-0 left-0 z-20">
        <nav className="flex flex-col gap-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 transition-colors relative group ${
                  isActive
                    ? 'text-blue-600 font-semibold bg-blue-50 rounded-lg px-3 py-2'
                    : 'text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50'
                }`}
              >
                <Icon className="w-6 h-6" />
                {item.name}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full" />
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




