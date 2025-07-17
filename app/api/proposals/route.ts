import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const { proposerId, receiverId, title, message, proposedDateTime, location } = await request.json();

    // 1. 필수 필드 유효성 검사
    if (!proposerId || !receiverId || !title || !message) {
      return NextResponse.json({ 
        error: '필수 필드가 누락되었습니다. (proposerId, receiverId, title, message)' 
      }, { status: 400 });
    }

    // 2. 인증된 사용자 확인 - proposer가 실제 존재하는 사용자인지 검증
    const proposer = await prisma.user.findUnique({
      where: { id: proposerId }
    });

    if (!proposer) {
      return NextResponse.json({ 
        error: '인증되지 않은 사용자입니다.' 
      }, { status: 401 });
    }

    // 3. 수신자가 존재하는지 확인
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return NextResponse.json({ 
        error: '수신자를 찾을 수 없습니다.' 
      }, { status: 400 });
    }

    // 4. 자기 자신에게 제안을 보내는 것 방지
    if (proposerId === receiverId) {
      return NextResponse.json({ 
        error: '자기 자신에게는 만남을 제안할 수 없습니다.' 
      }, { status: 400 });
    }

    // 5. 만남 제안 생성
    const meetingProposal = await prisma.meetingProposal.create({
      data: {
        proposerId,
        receiverId,
        title,
        message,
        proposedDateTime: proposedDateTime ? new Date(proposedDateTime) : null,
        location: location || null,
        status: 'PENDING'
      },
      include: {
        proposer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // 6. 성공 응답
    return NextResponse.json({
      message: '만남 제안이 성공적으로 생성되었습니다.',
      proposal: meetingProposal
    }, { status: 201 });

  } catch (error) {
    console.error('만남 제안 생성 오류:', error);
    
    // Prisma 관련 오류 처리
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({ 
          error: '존재하지 않는 사용자입니다.' 
        }, { status: 400 });
      }
    }

    // 일반적인 서버 오류
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 