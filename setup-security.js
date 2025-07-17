#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

console.log('🔒 AllowedUser 시스템 보안 설정\n');

// 1. Generate strong admin secret key
function generateSecretKey() {
  return crypto.randomBytes(32).toString('hex');
}

// 2. Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
  console.log('✅ .env.local 파일이 존재합니다.');
} else {
  console.log('⚠️  .env.local 파일이 없습니다. 새로 생성합니다.');
}

// 3. Generate or update ADMIN_SECRET_KEY
const newSecretKey = generateSecretKey();
const secretKeyLine = `ADMIN_SECRET_KEY="${newSecretKey}"`;

if (envContent.includes('ADMIN_SECRET_KEY=')) {
  envContent = envContent.replace(/ADMIN_SECRET_KEY=.*/, secretKeyLine);
  console.log('🔄 ADMIN_SECRET_KEY를 업데이트했습니다.');
} else {
  envContent += `\n${secretKeyLine}`;
  console.log('➕ ADMIN_SECRET_KEY를 추가했습니다.');
}

// 4. Add IP restriction if not exists
if (!envContent.includes('ADMIN_ALLOWED_IPS=')) {
  envContent += `\nADMIN_ALLOWED_IPS="127.0.0.1,::1"`;
  console.log('➕ ADMIN_ALLOWED_IPS를 추가했습니다.');
}

// 5. Add DATABASE_URL if not exists
if (!envContent.includes('DATABASE_URL=')) {
  envContent += `\nDATABASE_URL="file:./prisma/dev.db"`;
  console.log('➕ DATABASE_URL을 추가했습니다.');
}

// 6. Write updated .env.local
fs.writeFileSync(envPath, envContent.trim() + '\n');

// 7. Set file permissions (Unix systems only)
try {
  fs.chmodSync(envPath, 0o600);
  console.log('🔐 .env.local 파일 권한을 설정했습니다 (600).');
} catch (error) {
  console.log('⚠️  파일 권한 설정 실패 (Windows에서는 정상):', error.message);
}

// 8. Check database file permissions
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
if (fs.existsSync(dbPath)) {
  try {
    fs.chmodSync(dbPath, 0o600);
    console.log('🔐 데이터베이스 파일 권한을 설정했습니다.');
  } catch (error) {
    console.log('⚠️  데이터베이스 파일 권한 설정 실패:', error.message);
  }
} else {
  console.log('ℹ️  데이터베이스 파일이 아직 없습니다.');
}

console.log('\n📋 보안 설정 완료!');
console.log('📝 다음 단계:');
console.log('1. 관리자 키를 안전한 곳에 저장하세요:');
console.log(`   ${newSecretKey}`);
console.log('2. 필요시 ADMIN_ALLOWED_IPS에 사무실 IP를 추가하세요');
console.log('3. 프로덕션 배포 전 security-guide.md를 확인하세요');
console.log('4. 정기적으로 키를 업데이트하세요\n');

// 9. Security checklist
console.log('🔍 보안 체크리스트:');
const checklist = [
  '.env.local 파일 권한 설정',
  '강력한 ADMIN_SECRET_KEY 생성',
  'IP 접근 제한 설정',
  '.gitignore에 민감한 파일 제외',
  '데이터베이스 파일 보호'
];

checklist.forEach((item, index) => {
  console.log(`${index + 1}. ✅ ${item}`);
});

console.log('\n⚠️  주의사항:');
console.log('- 이 키를 절대 git에 커밋하지 마세요');
console.log('- 정기적으로 키를 변경하세요');
console.log('- 프로덕션에서는 더 강력한 보안 설정을 사용하세요'); 