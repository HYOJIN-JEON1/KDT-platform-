import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 채용 공고 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const jobType = searchParams.get('jobType');
    const experience = searchParams.get('experience');
    const location = searchParams.get('location');
    const skills = searchParams.get('skills');
    const search = searchParams.get('search');

    if (!userId) {
      return NextResponse.json({ 
        error: '인증이 필요합니다.' 
      }, { status: 401 });
    }

    // 현재 사용자가 존재하는지 확인
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ 
        error: '유효하지 않은 사용자입니다.' 
      }, { status: 401 });
    }

    // 필터 조건 구성
    const whereConditions: any = {
      isActive: true
    };

    if (jobType && jobType !== 'ALL') {
      whereConditions.jobType = jobType;
    }

    if (experience && experience !== 'ALL') {
      whereConditions.experience = experience;
    }

    if (location) {
      whereConditions.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (skills) {
      whereConditions.skills = {
        contains: skills,
        mode: 'insensitive'
      };
    }

    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 채용 공고 목록 조회 (최신순, 작성자 정보 포함)
    const jobs = await prisma.job.findMany({
      where: whereConditions,
      include: {
        author: {
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
      message: '채용 공고 목록 조회가 완료되었습니다.',
      jobs
    }, { status: 200 });

  } catch (error) {
    console.error('채용 공고 목록 조회 오류:', error);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

// 새 채용 공고 작성
export async function POST(request: Request) {
  try {
    const { 
      title, 
      company, 
      location, 
      description, 
      requirements, 
      salary, 
      jobType, 
      experience, 
      skills, 
      benefits, 
      contactEmail, 
      authorId 
    } = await request.json();
    
    if (!title || !company || !description || !authorId) {
      return NextResponse.json({ 
        error: '제목, 회사명, 설명, 작성자 정보가 모두 필요합니다.' 
      }, { status: 400 });
    }

    // 작성자가 존재하는지 확인
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    });

    if (!author) {
      return NextResponse.json({ 
        error: '유효하지 않은 작성자입니다.' 
      }, { status: 401 });
    }

    // CEO만 채용 공고를 작성할 수 있도록 제한
    if (author.role !== 'CEO') {
      return NextResponse.json({ 
        error: 'CEO만 채용 공고를 작성할 수 있습니다.' 
      }, { status: 403 });
    }

    // 새 채용 공고 생성
    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        location: location || null,
        description,
        requirements: requirements || null,
        salary: salary || null,
        jobType: jobType || 'FULL_TIME',
        experience: experience || null,
        skills: skills || null,
        benefits: benefits || null,
        contactEmail: contactEmail || author.email,
        authorId,
        isActive: true
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
      message: '채용 공고가 성공적으로 작성되었습니다.',
      job: newJob
    }, { status: 201 });

  } catch (error) {
    console.error('채용 공고 작성 오류:', error);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 