import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 게시글 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    // 모든 게시글 조회 (최신순, 작성자와 댓글 정보 포함)
    const posts = await prisma.post.findMany({
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
                email: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      message: '게시글 목록 조회가 완료되었습니다.',
      posts
    }, { status: 200 });

  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

// 새 게시글 작성
export async function POST(request: Request) {
  try {
    const { title, content, authorId } = await request.json();
    
    if (!title || !content || !authorId) {
      return NextResponse.json({ 
        error: '제목, 내용, 작성자 정보가 모두 필요합니다.' 
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

    // 새 게시글 생성
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
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
        },
        comments: {
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
        }
      }
    });

    return NextResponse.json({
      message: '게시글이 성공적으로 작성되었습니다.',
      post: newPost
    }, { status: 201 });

  } catch (error) {
    console.error('게시글 작성 오류:', error);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 