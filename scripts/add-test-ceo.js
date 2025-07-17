const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestCEO() {
  try {
    // 테스트 CEO 계정을 AllowedUser 테이블에 추가
    const testCEO = await prisma.allowedUser.create({
      data: {
        email: 'test1@snu.ac.kr',
        name: '테스트',
        role: 'CEO',
        isRegistered: false
      }
    });

    console.log('✅ 테스트 CEO 계정이 허용 리스트에 추가되었습니다:', testCEO);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  이미 존재하는 이메일입니다.');
    } else {
      console.error('❌ 오류:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addTestCEO(); 