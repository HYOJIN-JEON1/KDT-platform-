const fs = require('fs');
const path = require('path');

function backupDatabase() {
  try {
    const dbPath = path.join(__dirname, '../prisma/dev.db');
    const backupDir = path.join(__dirname, '../backups');
    
    // 백업 폴더 생성
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // 현재 날짜시간으로 백업 파일명 생성
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const backupPath = path.join(backupDir, `dev_backup_${timestamp}.db`);
    
    // 파일 복사
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      console.log(`✅ 데이터베이스 백업 완료: ${backupPath}`);
      console.log(`📊 파일 크기: ${(fs.statSync(backupPath).size / 1024).toFixed(2)} KB`);
    } else {
      console.log('❌ 데이터베이스 파일을 찾을 수 없습니다:', dbPath);
    }
    
  } catch (error) {
    console.error('❌ 백업 실패:', error);
  }
}

// 스크립트 직접 실행시
if (require.main === module) {
  backupDatabase();
}

module.exports = backupDatabase; 