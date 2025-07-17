import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 대량 사용자 추가 (CSV 또는 JSON 데이터)
export async function POST(request: Request) {
  try {
    const { users, format = 'json' } = await request.json();
    
    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ 
        error: 'users 배열이 필요합니다.' 
      }, { status: 400 });
    }

    const results = {
      success: [],
      failed: [],
      duplicates: []
    };

    for (const userData of users) {
      try {
        const { email, name, role = 'TALENT' } = userData;
        
        if (!email || !email.includes('@')) {
          results.failed.push({
            email: email || 'unknown',
            reason: '잘못된 이메일 형식'
          });
          continue;
        }

        // 중복 체크
        const existing = await prisma.allowedUser.findUnique({
          where: { email }
        });

        if (existing) {
          results.duplicates.push({
            email,
            reason: '이미 등록된 이메일'
          });
          continue;
        }

        const allowedUser = await prisma.allowedUser.create({
          data: {
            email: email.toLowerCase().trim(),
            name: name?.trim() || null,
            role: role === 'ceo' || role === 'CEO' ? 'CEO' : 'TALENT',
            isRegistered: false
          }
        });

        results.success.push({
          email: allowedUser.email,
          name: allowedUser.name,
          role: allowedUser.role
        });

      } catch (error) {
        results.failed.push({
          email: userData.email || 'unknown',
          reason: '데이터베이스 오류'
        });
      }
    }

    return NextResponse.json({
      message: '대량 추가가 완료되었습니다.',
      summary: {
        total: users.length,
        success: results.success.length,
        failed: results.failed.length,
        duplicates: results.duplicates.length
      },
      details: results
    }, { status: 201 });

  } catch (error) {
    console.error('대량 추가 오류:', error);
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 