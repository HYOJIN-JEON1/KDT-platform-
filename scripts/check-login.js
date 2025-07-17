const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 환경변수 설정
process.env.DATABASE_URL = "file:./prisma/dev.db";

const prisma = new PrismaClient();

async function checkLogin() {
  try {
    console.log('🔍 test@snu.ac.kr 계정 확인 중...');

    // 1. 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email: 'test@snu.ac.kr' }
    });

    if (!user) {
      console.log('❌ 사용자를 찾을 수 없습니다!');
      return;
    }

    console.log('✅ 사용자 발견:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // 2. 비밀번호 확인
    const isPasswordValid = await bcrypt.compare('test', user.password);
    
    if (isPasswordValid) {
      console.log('✅ 비밀번호 일치: 로그인이 정상적으로 작동해야 합니다');
    } else {
      console.log('❌ 비밀번호 불일치: 비밀번호에 문제가 있습니다');
    }

    // 3. AllowedUser 확인
    const allowedUser = await prisma.allowedUser.findUnique({
      where: { email: 'test@snu.ac.kr' }
    });

    if (allowedUser) {
      console.log('✅ 허용된 사용자:', {
        email: allowedUser.email,
        isRegistered: allowedUser.isRegistered
      });
    } else {
      console.log('❌ 허용된 사용자 목록에 없습니다');
    }

    // 4. 프로필 확인
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    if (profile) {
      console.log('✅ 프로필 존재');
    } else {
      console.log('⚠️  프로필 없음 (하지만 로그인에는 문제없음)');
    }

    console.log('\n🎯 결론: test@snu.ac.kr / test 로 로그인이 가능해야 합니다');
    console.log('🌐 브라우저에서 http://localhost:3000 접속 후 시도해보세요');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogin(); 