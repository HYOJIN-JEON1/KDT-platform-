import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: '모든 필드를 입력해 주세요.' }, { status: 400 });
    }

    // role 값 검증 및 변환
    let userRole: Role;
    if (role === 'talent') {
      userRole = Role.TALENT;
    } else if (role === 'ceo') {
      userRole = Role.CEO;
    } else {
      return NextResponse.json({ error: '유효하지 않은 역할입니다.' }, { status: 400 });
    }

    // AllowedUser 확인
    const allowedUser = await prisma.allowedUser.findUnique({ 
      where: { email } 
    });

    if (!allowedUser) {
      return NextResponse.json({ 
        error: '가입이 허용되지 않은 이메일입니다.' 
      }, { status: 403 });
    }

    if (allowedUser.isRegistered) {
      return NextResponse.json({ 
        error: '이미 가입된 사용자입니다.' 
      }, { status: 409 });
    }

    // 이메일 중복 체크 (User 테이블)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 409 });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    // AllowedUser의 isRegistered 필드를 true로 업데이트
    await prisma.allowedUser.update({
      where: { email },
      data: { isRegistered: true }
    });

    return NextResponse.json({ 
      message: '회원가입이 완료되었습니다.', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 