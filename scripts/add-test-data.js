#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addTestData() {
  console.log('🚀 테스트 데이터 추가 시작...\n');

  try {
    // 1. 기존 테스트 데이터 정리
    await prisma.meetingProposal.deleteMany({
      where: {
        OR: [
          { proposer: { email: { contains: 'test' } } },
          { receiver: { email: { contains: 'test' } } }
        ]
      }
    });
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } }
    });
    await prisma.allowedUser.deleteMany({
      where: { email: { contains: 'test' } }
    });

    console.log('✅ 기존 테스트 데이터 정리 완료');

    // 2. AllowedUser 데이터 추가
    const allowedUsers = [
      { email: 'ceo1@test.com', name: 'CEO 김대표', role: 'CEO' },
      { email: 'ceo2@test.com', name: 'CEO 박사장', role: 'CEO' },
      { email: 'talent1@test.com', name: '핀테크 이개발', role: 'TALENT' },
      { email: 'talent2@test.com', name: '핀테크 정프론트', role: 'TALENT' },
      { email: 'talent3@test.com', name: '핀테크 김백엔드', role: 'TALENT' },
      { email: 'talent4@test.com', name: '핀테크 박풀스택', role: 'TALENT' },
    ];

    for (const userData of allowedUsers) {
      await prisma.allowedUser.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isRegistered: false
        }
      });
    }

    console.log('✅ AllowedUser 테스트 데이터 추가 완료');

    // 3. 실제 User 데이터 추가 (가입 완료된 사용자)
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const users = [
      { email: 'ceo1@test.com', name: 'CEO 김대표', role: 'CEO' },
      { email: 'ceo2@test.com', name: 'CEO 박사장', role: 'CEO' },
      { email: 'talent1@test.com', name: '핀테크 이개발', role: 'TALENT' },
      { email: 'talent2@test.com', name: '핀테크 정프론트', role: 'TALENT' },
      { email: 'talent3@test.com', name: '핀테크 김백엔드', role: 'TALENT' },
      { email: 'talent4@test.com', name: '핀테크 박풀스택', role: 'TALENT' },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role
        }
      });
      createdUsers.push(user);

      // AllowedUser 상태 업데이트
      await prisma.allowedUser.update({
        where: { email: userData.email },
        data: { isRegistered: true }
      });
    }

    console.log('✅ User 테스트 데이터 추가 완료');

    // 4. 프로필 데이터 추가
    for (const user of createdUsers) {
      const profileData = {
        userId: user.id,
        introduction: `안녕하세요! ${user.name}입니다.`,
        skills: user.role === 'CEO' ? '경영, 투자, 사업개발' : 'JavaScript, React, Node.js, Python',
        experiences: JSON.stringify([
          {
            company: user.role === 'CEO' ? '스타트업 A' : '테크 컴퍼니',
            position: user.role === 'CEO' ? '대표이사' : '개발자',
            period: '2020-2024',
            description: `${user.role === 'CEO' ? '스타트업 운영 및 투자 유치' : '웹 개발 및 시스템 구축'}`
          }
        ]),
        educations: JSON.stringify([
          {
            school: '서울대학교',
            major: user.role === 'CEO' ? '경영학과' : '컴퓨터공학과',
            degree: '학사',
            period: '2016-2020'
          }
        ]),
        portfolios: JSON.stringify([
          {
            title: user.role === 'CEO' ? '스타트업 성장 스토리' : '개인 프로젝트',
            url: 'https://github.com/example',
            description: '프로젝트 설명입니다.'
          }
        ])
      };

      await prisma.profile.create({ data: profileData });
    }

    console.log('✅ Profile 테스트 데이터 추가 완료');

    // 5. 커피챗 제안 샘플 데이터 추가
    const ceoUsers = createdUsers.filter(user => user.role === 'CEO');
    const talentUsers = createdUsers.filter(user => user.role === 'TALENT');

    // CEO가 Talent에게 제안
    await prisma.meetingProposal.create({
      data: {
        proposerId: ceoUsers[0].id,
        receiverId: talentUsers[0].id,
        title: '채용 상담 제안',
        message: '안녕하세요! 귀하의 프로필을 보고 연락드립니다. 저희 회사에서 개발자를 채용 중인데, 커피챗을 통해 서로 알아가는 시간을 가졌으면 합니다.',
        status: 'PENDING',
        proposedDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1주일 후
        location: '강남역 스타벅스'
      }
    });

    // Talent가 CEO에게 제안
    await prisma.meetingProposal.create({
      data: {
        proposerId: talentUsers[1].id,
        receiverId: ceoUsers[1].id,
        title: '멘토링 요청',
        message: '안녕하세요! 창업에 관심이 많은 개발자입니다. 경험 공유와 조언을 구하고 싶어 연락드렸습니다.',
        status: 'ACCEPTED',
        proposedDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
        location: '을지로 카페'
      }
    });

    console.log('✅ MeetingProposal 테스트 데이터 추가 완료');

    // 6. 게시글 데이터 추가
    await prisma.post.create({
      data: {
        title: '핀테크 개발자 모집합니다!',
        content: '저희 스타트업에서 React/Node.js 경험이 있는 개발자를 찾고 있습니다. 관심 있으신 분은 연락주세요!',
        authorId: ceoUsers[0].id
      }
    });

    await prisma.post.create({
      data: {
        title: '개발 스터디 참여자 모집',
        content: '매주 토요일 알고리즘 스터디를 진행하고 있습니다. 함께 성장할 분들을 찾습니다!',
        authorId: talentUsers[0].id
      }
    });

    console.log('✅ Post 테스트 데이터 추가 완료');

    // 7. 채용 공고 데이터 추가
    const jobData = [
      {
        title: 'React 프론트엔드 개발자',
        company: '핀테크 스타트업 A',
        location: '서울 강남구',
        description: 'React를 활용한 사용자 인터페이스 개발 및 사용자 경험 개선 업무를 담당합니다. 모던 프론트엔드 기술 스택을 활용하여 혁신적인 금융 서비스를 만들어갑니다.',
        requirements: '• React 3년 이상 개발 경험\n• TypeScript 활용 경험\n• 금융 도메인 이해도 우대\n• Git을 활용한 협업 경험',
        salary: '연봉 4500-6000만원',
        jobType: 'FULL_TIME',
        experience: 'JUNIOR',
        skills: 'React, TypeScript, JavaScript, CSS, Git',
        benefits: '• 4대보험 완비\n• 연차 15일\n• 교육비 지원\n• 맥북 지급\n• 간식 무제한',
        authorId: ceoUsers[0].id,
        contactEmail: 'recruit@fintechA.com'
      },
      {
        title: 'Node.js 백엔드 개발자',
        company: '핀테크 스타트업 A',
        location: '서울 강남구',
        description: 'Node.js 기반의 서버 개발 및 API 설계를 담당합니다. 대용량 트래픽 처리와 보안이 중요한 금융 시스템 개발 경험을 쌓을 수 있습니다.',
        requirements: '• Node.js 개발 경험 2년 이상\n• 데이터베이스 설계 경험\n• RESTful API 설계 경험\n• 금융 시스템 경험 우대',
        salary: '연봉 4000-5500만원',
        jobType: 'FULL_TIME',
        experience: 'JUNIOR',
        skills: 'Node.js, Express, MongoDB, PostgreSQL, AWS',
        benefits: '• 4대보험 완비\n• 연차 15일\n• 점심 지원\n• 카페테리아',
        authorId: ceoUsers[0].id,
        contactEmail: 'recruit@fintechA.com'
      },
      {
        title: 'AI/ML 엔지니어',
        company: 'AI 스타트업 B',
        location: '서울 서초구',
        description: '머신러닝 모델 개발 및 AI 서비스 구축을 담당합니다. 데이터 분석부터 모델 배포까지 전 과정에 참여하여 실무 경험을 쌓을 수 있습니다.',
        requirements: '• Python 개발 경험\n• 머신러닝 프레임워크 경험 (TensorFlow, PyTorch)\n• 데이터 분석 경험\n• 통계학 기초 지식',
        salary: '연봉 5000-7000만원',
        jobType: 'FULL_TIME',
        experience: 'SENIOR',
        skills: 'Python, TensorFlow, PyTorch, Pandas, SQL',
        benefits: '• 4대보험 완비\n• 연차 20일\n• 주식옵션\n• 자유로운 휴가\n• 최신 장비 지원',
        authorId: ceoUsers[1].id,
        contactEmail: 'jobs@aistartupB.com'
      },
      {
        title: '프론트엔드 인턴',
        company: '테크 스타트업 C',
        location: '서울 마포구',
        description: '웹 프론트엔드 개발 인턴으로 실무 경험을 쌓을 수 있는 기회입니다. 시니어 개발자의 멘토링을 받으며 성장할 수 있습니다.',
        requirements: '• HTML, CSS, JavaScript 기초 지식\n• React 학습 경험 (포트폴리오 우대)\n• 컴퓨터공학 전공 또는 관련 학과\n• 6개월 이상 근무 가능',
        salary: '월 200만원',
        jobType: 'INTERNSHIP',
        experience: 'ENTRY',
        skills: 'HTML, CSS, JavaScript, React',
        benefits: '• 정직원 전환 기회\n• 교육 프로그램\n• 멘토링\n• 간식 제공',
        authorId: ceoUsers[1].id,
        contactEmail: 'intern@techC.com'
      }
    ];

    for (const job of jobData) {
      await prisma.job.create({ data: job });
    }

    console.log('✅ Job 테스트 데이터 추가 완료');

    // 6. 포럼 게시글 및 댓글 추가
    console.log('📝 포럼 게시글 추가 중...');

    const postData = [
      {
        title: '핀테크 업계 트렌드 공유합니다',
        content: '안녕하세요! 최근 핀테크 업계에서 주목받고 있는 트렌드들을 공유하고 싶습니다.\n\n1. 블록체인 기반 결제 시스템\n2. AI를 활용한 신용평가\n3. 디지털 자산 관리 플랫폼\n\n여러분들은 어떤 분야에 관심이 있으신가요? 함께 논의해봐요!',
        authorId: ceoUsers[0].id
      },
      {
        title: '취업 준비 후기 및 조언',
        content: '드디어 핀테크 스타트업에 합격했습니다! 🎉\n\n면접 과정에서 중요했던 점들을 공유드리겠습니다:\n- 실무 프로젝트 경험의 중요성\n- 금융 도메인 지식\n- 팀워크와 커뮤니케이션 능력\n\n취업 준비하시는 분들에게 도움이 되었으면 좋겠어요.',
        authorId: talentUsers[0].id
      },
      {
        title: '프로그래밍 스터디 그룹 모집',
        content: '안녕하세요! 알고리즘 및 시스템 설계 스터디 그룹을 모집합니다.\n\n📅 모임: 매주 토요일 오후 2시\n📍 장소: 온라인 (줌)\n🎯 목표: 코딩테스트 및 기술면접 준비\n\n관심 있으신 분들은 댓글로 연락 부탁드려요!',
        authorId: talentUsers[1].id
      },
      {
        title: '스타트업 창업 경험담',
        content: '핀테크 스타트업을 운영하면서 얻은 인사이트를 나누고 싶습니다.\n\n특히 기술 인재 채용에서 중요하게 보는 것들:\n- 문제 해결 능력\n- 빠른 학습력\n- 협업 경험\n- 비즈니스 이해도\n\n궁금한 점이 있으시면 언제든 물어보세요!',
        authorId: ceoUsers[1].id
      },
      {
        title: '개발자 포트폴리오 피드백 부탁드려요',
        content: '포트폴리오를 정리하고 있는데, 피드백을 받고 싶습니다.\n\n현재 포함된 프로젝트:\n1. React 기반 가계부 앱\n2. Node.js API 서버\n3. 블록체인 투표 시스템\n\n더 추가하면 좋을 프로젝트나 개선점이 있을까요?',
        authorId: talentUsers[2].id
      }
    ];

    const createdPosts = [];
    for (const post of postData) {
      const createdPost = await prisma.post.create({ data: post });
      createdPosts.push(createdPost);
    }

    // 댓글 추가
    console.log('💬 댓글 추가 중...');

    const commentData = [
      {
        content: '정말 유익한 정보네요! 특히 AI 신용평가 부분이 흥미롭습니다.',
        postId: createdPosts[0].id,
        authorId: talentUsers[0].id
      },
      {
        content: '블록체인 결제 시스템 관련해서 더 자세한 정보를 얻을 수 있을까요?',
        postId: createdPosts[0].id,
        authorId: talentUsers[1].id
      },
      {
        content: 'DM으로 연락드렸습니다. 참여하고 싶어요!',
        postId: createdPosts[0].id,
        authorId: ceoUsers[1].id
      },
      {
        content: '축하드려요! 면접 팁이 정말 도움이 될 것 같아요.',
        postId: createdPosts[1].id,
        authorId: talentUsers[2].id
      },
      {
        content: '저도 비슷한 경험이 있는데, 실무 프로젝트 정말 중요하죠!',
        postId: createdPosts[1].id,
        authorId: talentUsers[3].id
      },
      {
        content: '스터디 그룹 참여하고 싶습니다! 어떻게 연락드리면 될까요?',
        postId: createdPosts[2].id,
        authorId: talentUsers[0].id
      },
      {
        content: '저도 관심 있어요. 난이도는 어느 정도인가요?',
        postId: createdPosts[2].id,
        authorId: talentUsers[3].id
      },
      {
        content: '창업 경험담 정말 인상깊네요. 채용 과정에서 중요시하는 부분을 더 알고 싶어요.',
        postId: createdPosts[3].id,
        authorId: talentUsers[1].id
      },
      {
        content: 'DeFi 프로젝트를 추가하면 어떨까요? 요즘 핫한 분야라서요.',
        postId: createdPosts[4].id,
        authorId: ceoUsers[0].id
      },
      {
        content: '포트폴리오 구성이 알차네요! 개인적으로는 팀 프로젝트 경험도 추가하면 좋을 것 같아요.',
        postId: createdPosts[4].id,
        authorId: talentUsers[0].id
      }
    ];

    for (const comment of commentData) {
      await prisma.comment.create({ data: comment });
    }

    console.log('✅ 포럼 게시글 및 댓글 추가 완료');

    console.log('\n🎉 모든 테스트 데이터 추가 완료!');
    console.log('\n📋 추가된 테스트 계정:');
    console.log('CEO 계정: ceo1@test.com, ceo2@test.com');
    console.log('Talent 계정: talent1@test.com, talent2@test.com, talent3@test.com, talent4@test.com');
    console.log('공통 비밀번호: test123');
    console.log('\n🚀 이제 다음 기능들을 테스트해보세요:');
    console.log('• 커피챗 제안/수락/거절');
    console.log('• 프로필 관리 및 조회');
    console.log('• 채용 공고 조회 및 등록 (CEO)');
    console.log('• 채용 공고 필터링 및 지원 (Talent)');
    console.log('• 네트워킹 광장에서 게시글 작성/댓글 (CEO & Talent)');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData(); 