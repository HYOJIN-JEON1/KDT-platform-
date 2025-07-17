import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 새 댓글 작성
export async function POST(request: Request) {
  try {
    const { content, postId, authorId } = await request.json();
    
    if (!content || !postId || !authorId) {
      return NextResponse.json({ 
        error: '댓글 내용, 게시글 ID, 작성자 정보가 모두 필요합니다.' 
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

    // 게시글이 존재하는지 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ 
        error: '존재하지 않는 게시글입니다.' 
      }, { status: 404 });
    }

    // 새 댓글 생성
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
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
        post: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json({
      message: '댓글이 성공적으로 작성되었습니다.',
      comment: newComment
    }, { status: 201 });

  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 