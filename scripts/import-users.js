// 졸업생 명단을 CSV에서 가져와서 대량 추가하는 스크립트
// 사용법: node scripts/import-users.js

const fs = require('fs');
const path = require('path');

// CSV 파일 예시 형식:
// email,name,role
// student1@snu.ac.kr,김철수,talent
// student2@snu.ac.kr,이영희,talent
// ceo1@company.com,박대표,ceo

async function importUsers() {
  try {
    // CSV 파일 읽기
    const csvPath = path.join(__dirname, 'users.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('❌ users.csv 파일이 없습니다.');
      console.log('📝 다음 형식으로 users.csv 파일을 생성하세요:');
      console.log('email,name,role');
      console.log('student1@snu.ac.kr,김철수,talent');
      console.log('student2@snu.ac.kr,이영희,talent');
      return;
    }

    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    
    if (!headers.includes('email')) {
      console.log('❌ CSV 파일에 email 컬럼이 필요합니다.');
      return;
    }

    const users = [];
    
    // CSV 데이터 파싱
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const user = {};
      
      headers.forEach((header, index) => {
        user[header.trim()] = values[index]?.trim() || '';
      });
      
      if (user.email && user.email.includes('@')) {
        users.push({
          email: user.email,
          name: user.name || null,
          role: user.role || 'talent'
        });
      }
    }

    console.log(`📊 ${users.length}명의 사용자를 추가합니다...`);

    // API 호출
    const response = await fetch('http://localhost:3000/api/admin/bulk-add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 대량 추가 완료!');
      console.log(`📈 성공: ${result.summary.success}명`);
      console.log(`❌ 실패: ${result.summary.failed}명`);
      console.log(`🔄 중복: ${result.summary.duplicates}명`);
      
      if (result.details.failed.length > 0) {
        console.log('\n❌ 실패한 사용자들:');
        result.details.failed.forEach(item => {
          console.log(`  - ${item.email}: ${item.reason}`);
        });
      }
    } else {
      console.log('❌ 오류:', result.error);
    }

  } catch (error) {
    console.error('❌ 스크립트 실행 오류:', error.message);
  }
}

// 스크립트 실행
importUsers(); 