import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 모든 사용자 및 프로필 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    // 1. 인증된 사용자 확인
    if (!currentUserId) {
      return NextResponse.json({ 
        error: '인증이 필요합니다. 로그인 후 다시 시도해주세요.' 
      }, { status: 401 });
    }

    // 현재 사용자가 실제로 존재하는지 확인
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    });

    if (!currentUser) {
      return NextResponse.json({ 
        error: '유효하지 않은 사용자입니다.' 
      }, { status: 401 });
    }

    // 2. 모든 사용자 및 프로필 조회 (include 옵션 사용)
    const users = await prisma.user.findMany({
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 3. 데이터 가공 (민감한 정보 제외)
    const processedUsers = users.map(user => {
      const profileData = user.profile ? {
        id: user.profile.id,
        introduction: user.profile.introduction,
        skills: user.profile.skills,
        experiences: user.profile.experiences ? JSON.parse(user.profile.experiences) : [],
        educations: user.profile.educations ? JSON.parse(user.profile.educations) : [],
        portfolios: user.profile.portfolios ? JSON.parse(user.profile.portfolios) : [],
        createdAt: user.profile.createdAt,
        updatedAt: user.profile.updatedAt
      } : null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: profileData
        // 비밀번호는 제외됨
      };
    });

    // 4. 성공 응답
    return NextResponse.json({
      message: '사용자 및 프로필 목록 조회가 완료되었습니다.',
      users: processedUsers,
      count: processedUsers.length
    }, { status: 200 });

  } catch (error) {
    // 5. 오류 처리
    console.error('사용자 목록 조회 오류:', error);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    }, { status: 500 });
  }
} 