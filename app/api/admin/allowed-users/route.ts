import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 허용된 사용자 목록 조회
export async function GET() {
  try {
    const allowedUsers = await prisma.allowedUser.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(allowedUsers);
  } catch (error) {
    console.error('AllowedUser 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 새로운 허용 사용자 추가
export async function POST(request: Request) {
  try {
    const { email, name, role = 'TALENT' } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: '이메일은 필수입니다.' }, { status: 400 });
    }

    // 이미 존재하는 이메일인지 확인
    const existing = await prisma.allowedUser.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 409 });
    }

    const allowedUser = await prisma.allowedUser.create({
      data: {
        email,
        name: name || null,
        role: role === 'ceo' ? 'CEO' : 'TALENT',
        isRegistered: false
      }
    });

    return NextResponse.json({ 
      message: '허용 사용자가 추가되었습니다.',
      user: allowedUser 
    }, { status: 201 });
  } catch (error) {
    console.error('AllowedUser 추가 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 허용 사용자 삭제
export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: '이메일은 필수입니다.' }, { status: 400 });
    }

    await prisma.allowedUser.delete({
      where: { email }
    });

    return NextResponse.json({ message: '허용 사용자가 삭제되었습니다.' });
  } catch (error) {
    console.error('AllowedUser 삭제 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 