const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 환경변수 설정
process.env.DATABASE_URL = "file:./prisma/dev.db";

const prisma = new PrismaClient();

async function addSNUUser() {
  try {
    console.log('🔄 test@snu.ac.kr 사용자 추가 중...');

    // 1. 먼저 허용된 사용자로 추가
    const allowedUser = await prisma.allowedUser.upsert({
      where: { email: 'test@snu.ac.kr' },
      update: {
        name: 'SNU 테스트 사용자',
        role: 'TALENT',
        isRegistered: false // 다시 가입할 수 있도록
      },
      create: {
        email: 'test@snu.ac.kr',
        name: 'SNU 테스트 사용자',
        role: 'TALENT',
        isRegistered: false
      }
    });

    console.log('✅ 허용된 사용자로 추가 완료:', allowedUser);

    // 2. 기존 User가 있다면 삭제 (새로 가입할 수 있도록)
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@snu.ac.kr' }
    });

    if (existingUser) {
      // 관련된 데이터들도 함께 삭제
      await prisma.profile.deleteMany({
        where: { userId: existingUser.id }
      });
      
      await prisma.post.deleteMany({
        where: { authorId: existingUser.id }
      });
      
      await prisma.comment.deleteMany({
        where: { authorId: existingUser.id }
      });
      
      await prisma.meetingProposal.deleteMany({
        where: { 
          OR: [
            { proposerId: existingUser.id },
            { receiverId: existingUser.id }
          ]
        }
      });

      await prisma.user.delete({
        where: { id: existingUser.id }
      });
      
      console.log('🗑️ 기존 사용자 데이터 삭제 완료');
    }

    // 3. 직접 User 생성 (가입 과정 생략)
    const hashedPassword = await bcrypt.hash('test', 10);
    
    const newUser = await prisma.user.create({
      data: {
        name: 'SNU 테스트 사용자',
        email: 'test@snu.ac.kr',
        password: hashedPassword,
        role: 'TALENT'
      }
    });

    console.log('✅ 사용자 계정 생성 완료:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    // 4. AllowedUser의 isRegistered를 true로 업데이트
    await prisma.allowedUser.update({
      where: { email: 'test@snu.ac.kr' },
      data: { isRegistered: true }
    });

    // 5. 기본 프로필 생성
    const profile = await prisma.profile.create({
      data: {
        userId: newUser.id,
        introduction: '안녕하세요! SNU KDT 테스트 사용자입니다.',
        skills: 'JavaScript, React, Node.js, Python',
        experiences: JSON.stringify([
          {
            company: '서울대학교',
            role: 'KDT 과정생',
            period: '2024.01 - 2024.12',
            description: '핀테크 전문가 과정 수강 중'
          }
        ]),
        educations: JSON.stringify([
          {
            school: '서울대학교',
            major: '컴퓨터공학',
            degree: '학사',
            period: '2020 - 2024'
          }
        ]),
        portfolios: JSON.stringify([
          {
            title: 'KDT 포트폴리오 프로젝트',
            description: '핀테크 서비스 개발',
            url: 'https://github.com/test',
            tech: 'React, Node.js, PostgreSQL'
          }
        ])
      }
    });

    console.log('✅ 프로필 생성 완료');

    console.log('\n🎉 test@snu.ac.kr 계정 설정 완료!');
    console.log('📧 이메일: test@snu.ac.kr');
    console.log('🔐 비밀번호: test');
    console.log('👤 역할: TALENT (핀테크 전문가)');
    
    // 6. 현재 등록된 모든 사용자 확인
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\n📋 현재 등록된 모든 사용자:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSNUUser(); 