# 보안 가이드

## 🚨 AllowedUser (졸업생 명단) 보안 강화

### 즉시 적용해야 할 보안 조치

1. **데이터베이스 암호화**
   ```bash
   # 프로덕션 환경에서는 반드시 암호화된 데이터베이스 사용
   # SQLite → PostgreSQL/MySQL with encryption
   ```

2. **환경변수 보안**
   ```env
   # .env.local (개발용 - git에 포함 안됨)
   DATABASE_URL="file:./prisma/dev.db"
   ADMIN_SECRET_KEY="your-very-strong-secret-key-here"
   ADMIN_ALLOWED_IPS="127.0.0.1,::1,your-office-ip"
   
   # 프로덕션에서는 더 강력한 키 사용
   ADMIN_SECRET_KEY="복잡한-256비트-키"
   ```

3. **파일 권한 설정 (Linux/Mac)**
   ```bash
   chmod 600 .env.local
   chmod 600 prisma/dev.db
   ```

4. **백업 암호화**
   ```bash
   # 데이터베이스 백업 시 암호화
   openssl enc -aes-256-cbc -salt -in dev.db -out dev.db.enc
   ```

### 데이터 유출 방지 체크리스트

- [ ] `.env*` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 데이터베이스 파일이 git에 커밋되지 않는지 확인
- [ ] 프로덕션에서 HTTPS 사용
- [ ] 정기적인 보안 감사 실시
- [ ] 관리자 API 접근 로그 모니터링

# 🔒 AllowedUser 시스템 보안 가이드

## 🚨 중요: 운영 환경 보안 필수사항

### 1. 환경변수 보안
```env
# .env.local 또는 .env.production
DATABASE_URL="file:./prisma/dev.db"
ADMIN_SECRET_KEY="복잡한-32자리-이상-비밀키"
ADMIN_ALLOWED_IPS="관리자-IP1,관리자-IP2"
JWT_SECRET="별도의-JWT-시크릿-키"
```

### 2. 데이터베이스 보안
- **SQLite 파일 권한**: `chmod 600 prisma/dev.db`
- **백업 암호화**: 정기적인 암호화된 백업
- **접근 로그**: 모든 DB 접근 기록
- **프로덕션**: PostgreSQL/MySQL 사용 권장

### 3. API 보안
- **HTTPS 필수**: 운영 환경에서는 SSL/TLS 인증서 적용
- **Rate Limiting**: 요청 횟수 제한
- **IP 화이트리스트**: 신뢰할 수 있는 IP만 허용
- **요청 로깅**: 모든 관리자 API 접근 기록

### 4. 인증/인가 강화
```javascript
// JWT 토큰 사용 예시
const jwt = require('jsonwebtoken');

// 토큰 생성 (관리자 로그인 시)
const adminToken = jwt.sign(
  { role: 'admin', userId: 'admin-id' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// 토큰 검증 (미들웨어에서)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 5. 데이터 보호
- **개인정보 최소화**: 필요한 정보만 저장
- **데이터 암호화**: 민감한 정보는 암호화 저장
- **접근 권한 분리**: 읽기/쓰기 권한 분리
- **감사 로그**: 모든 데이터 변경 기록

### 6. 네트워크 보안
- **VPN 접근**: 관리자는 VPN을 통해서만 접근
- **방화벽**: 불필요한 포트 차단
- **DDoS 보호**: 트래픽 급증 방어
- **모니터링**: 실시간 접근 모니터링

### 7. 운영 보안
- **정기 보안 점검**: 월 1회 이상
- **권한 검토**: 분기별 접근 권한 재검토
- **보안 업데이트**: 의존성 라이브러리 정기 업데이트
- **침해 대응**: 보안 사고 대응 계획 수립

### 8. 법적 컴플라이언스
- **개인정보보호법**: 개인정보 처리방침 수립
- **정보통신망법**: 정보통신서비스 신고
- **데이터 보존**: 법정 보존 기간 준수
- **동의 절차**: 개인정보 수집/이용 동의

## 🛡️ 보안 체크리스트

### 개발 단계
- [ ] 환경변수로 민감 정보 분리
- [ ] 입력값 검증 및 소독
- [ ] 에러 메시지에서 민감 정보 제거
- [ ] 보안 헤더 설정

### 테스트 단계  
- [ ] 침투 테스트 수행
- [ ] 권한 우회 테스트
- [ ] SQL 인젝션 테스트
- [ ] XSS 공격 테스트

### 배포 단계
- [ ] HTTPS 인증서 설치
- [ ] 방화벽 규칙 설정
- [ ] 모니터링 도구 설치
- [ ] 백업 시스템 구축

### 운영 단계
- [ ] 정기 보안 스캔
- [ ] 접근 로그 분석
- [ ] 권한 정리
- [ ] 인시던트 대응 훈련

## 🚨 긴급 상황 대응

### 데이터 유출 의심 시
1. **즉시 서비스 중단**
2. **피해 범위 파악**
3. **관련 기관 신고**
4. **사용자 통지**
5. **보안 강화 후 서비스 재개**

### 무단 접근 감지 시
1. **해당 IP 차단**
2. **관리자 비밀번호 변경**
3. **접근 로그 분석**
4. **보안 패치 적용**
5. **모니터링 강화**

## 📞 보안 문의
- 보안팀: security@yourcompany.com
- 긴급상황: 24시간 보안 핫라인
- 신고: 개인정보보호위원회 