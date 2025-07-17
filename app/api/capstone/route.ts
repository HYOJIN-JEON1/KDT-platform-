import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 캡스톤 프로젝트 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const authorId = searchParams.get('authorId');

    let whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    const projects = await prisma.capstonProject.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes_users: true,
            comments: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { likes: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('캡스톤 프로젝트 조회 오류:', error);
    return NextResponse.json({ 
      error: '캡스톤 프로젝트를 불러오는 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

// POST: 새 캡스톤 프로젝트 등록
export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      techStack,
      githubUrl,
      demoUrl,
      imageUrl,
      category,
      teamSize,
      duration,
      startDate,
      endDate,
      authorId
    } = await request.json();

    // 필수 필드 검증
    if (!title || !description || !authorId) {
      return NextResponse.json({ 
        error: '필수 필드가 누락되었습니다. (title, description, authorId)' 
      }, { status: 400 });
    }

    // 작성자 확인
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    });

    if (!author) {
      return NextResponse.json({ 
        error: '인증되지 않은 사용자입니다.' 
      }, { status: 401 });
    }

    const project = await prisma.capstonProject.create({
      data: {
        title,
        description,
        techStack: Array.isArray(techStack) ? JSON.stringify(techStack) : techStack,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        imageUrl: imageUrl || null,
        category: category || 'WEB',
        teamSize: teamSize || 1,
        duration: duration || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ 
      project,
      message: '캡스톤 프로젝트가 성공적으로 등록되었습니다.' 
    }, { status: 201 });

  } catch (error) {
    console.error('캡스톤 프로젝트 생성 오류:', error);
    return NextResponse.json({ 
      error: '캡스톤 프로젝트 등록 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 