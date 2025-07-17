import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 특정 제안 조회
export async function GET(
  request: Request,
  { params }: { params: { proposalId: string } }
) {
  try {
    const { proposalId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // 1. 인증된 사용자 확인
    if (!userId) {
      return NextResponse.json({ 
        error: '인증이 필요합니다. userId를 제공해주세요.' 
      }, { status: 401 });
    }

    // 2. 제안 ID 확인
    if (!proposalId) {
      return NextResponse.json({ 
        error: '제안 ID가 필요합니다.' 
      }, { status: 400 });
    }

    // 3. 사용자 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ 
        error: '인증되지 않은 사용자입니다.' 
      }, { status: 401 });
    }

    // 4. 제안 조회
    const proposal = await prisma.meetingProposal.findUnique({
      where: { id: proposalId },
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

    // 5. 제안 없음 처리
    if (!proposal) {
      return NextResponse.json({ 
        error: '제안을 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    // 6. 제안 조회 권한 확인 (proposer 또는 receiver만 조회 가능)
    if (proposal.proposerId !== userId && proposal.receiverId !== userId) {
      return NextResponse.json({ 
        error: '이 제안을 조회할 권한이 없습니다.' 
      }, { status: 403 });
    }

    // 7. 성공 응답
    return NextResponse.json({
      message: '제안 조회가 완료되었습니다.',
      proposal
    }, { status: 200 });

  } catch (error) {
    console.error('제안 조회 오류:', error);
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

// PATCH: 제안 상태 업데이트
export async function PATCH(
  request: Request,
  { params }: { params: { proposalId: string } }
) {
  try {
    const { proposalId } = params;
    const { status, userId } = await request.json();

    // 1. 인증된 사용자 확인
    if (!userId) {
      return NextResponse.json({ 
        error: '인증이 필요합니다. userId를 제공해주세요.' 
      }, { status: 401 });
    }

    // 2. 제안 ID 확인
    if (!proposalId) {
      return NextResponse.json({ 
        error: '제안 ID가 필요합니다.' 
      }, { status: 400 });
    }

    // 3. 요청 본문 유효성 검사
    if (!status) {
      return NextResponse.json({ 
        error: 'status 필드가 필요합니다.' 
      }, { status: 400 });
    }

    // 4. 유효한 MeetingStatus 값인지 검증
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `유효하지 않은 상태입니다. 허용된 값: ${validStatuses.join(', ')}` 
      }, { status: 400 });
    }

    // 5. 사용자 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ 
        error: '인증되지 않은 사용자입니다.' 
      }, { status: 401 });
    }

    // 6. 기존 제안 조회
    const existingProposal = await prisma.meetingProposal.findUnique({
      where: { id: proposalId }
    });

    if (!existingProposal) {
      return NextResponse.json({ 
        error: '제안을 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    // 7. 제안 업데이트 권한 확인 (receiver만 상태 변경 가능)
    if (existingProposal.receiverId !== userId) {
      return NextResponse.json({ 
        error: '제안을 받은 사용자만 상태를 변경할 수 있습니다.' 
      }, { status: 403 });
    }

    // 8. 제안 상태 업데이트
    const updatedProposal = await prisma.meetingProposal.update({
      where: { id: proposalId },
      data: { status },
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

    // 9. 성공 응답
    return NextResponse.json({
      message: '제안 상태가 성공적으로 업데이트되었습니다.',
      proposal: updatedProposal
    }, { status: 200 });

  } catch (error) {
    console.error('제안 상태 업데이트 오류:', error);
    
    // Prisma 관련 오류 처리
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json({ 
          error: '업데이트할 제안을 찾을 수 없습니다.' 
        }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 