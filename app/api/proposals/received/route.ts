import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 받은 제안 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        error: 'userId가 필요합니다.' 
      }, { status: 400 });
    }

    // 사용자 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ 
        error: '사용자를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    // 받은 제안 목록 조회
    const receivedProposals = await prisma.meetingProposal.findMany({
      where: {
        receiverId: userId
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      message: '받은 제안 목록 조회가 완료되었습니다.',
      proposals: receivedProposals
    }, { status: 200 });

  } catch (error) {
    console.error('받은 제안 목록 조회 오류:', error);
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 