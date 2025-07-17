import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // 임시 테스트 유저 생성
    const testUser = await prisma.user.create({
      data: {
        name: "테스트 유저",
        email: "test@example.com",
        password: "hashed_password_here",
        role: "talent"
      }
    });

    return NextResponse.json({ 
      message: "테스트 유저가 생성되었습니다.",
      userId: testUser.id,
      user: testUser
    }, { status: 201 });
  } catch (error) {
    console.error('테스트 유저 생성 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 