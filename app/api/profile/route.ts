import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 프로필 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true } } }
    });

    if (!profile) {
      return NextResponse.json({ error: '프로필을 찾을 수 없습니다.' }, { status: 404 });
    }

    // JSON 문자열을 객체로 파싱
    const profileData = {
      ...profile,
      experiences: profile.experiences ? JSON.parse(profile.experiences) : [],
      educations: profile.educations ? JSON.parse(profile.educations) : [],
      portfolios: profile.portfolios ? JSON.parse(profile.portfolios) : []
    };

    return NextResponse.json({ profile: profileData }, { status: 200 });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 프로필 저장/업데이트
export async function POST(request: Request) {
  try {
    const { userId, introduction, skills, experiences, educations, portfolios } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
    }

    // 배열을 JSON 문자열로 변환
    const profileData = {
      userId,
      introduction,
      skills,
      experiences: JSON.stringify(experiences || []),
      educations: JSON.stringify(educations || []),
      portfolios: JSON.stringify(portfolios || [])
    };

    // upsert로 프로필이 있으면 업데이트, 없으면 생성
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: profileData
    });

    return NextResponse.json({ message: '프로필이 저장되었습니다.', profile }, { status: 200 });
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 