# AllowedUser 시스템 관리 가이드

## 📋 시스템 작동 방식

### 자동 가입 처리 여부
**❌ 자동 가입 아님** - 사용자가 직접 가입해야 함

1. **AllowedUser 테이블** = 가입 허용 명단 (졸업생 명단)
2. **User 테이블** = 실제 가입한 사용자
3. **가입 프로세스:**
   - 사용자가 가입 시도
   - 시스템이 AllowedUser 테이블 확인
   - 허용된 이메일이면 가입 진행
   - 가입 완료 시 `isRegistered = true`로 변경

## 🛠 일상 관리 작업

### 1. 졸업생 명단 추가
```bash
# CSV 파일로 일괄 추가
node scripts/import-users.js graduates-2024.csv

# 개별 추가 (API 사용)
curl -X POST http://localhost:3000/api/admin/allowed-users \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"student@snu.ac.kr","name":"김학생","role":"TALENT"}'
```

### 2. 가입 현황 모니터링
```bash
# Prisma Studio로 확인
npx prisma studio
# http://localhost:5555 접속하여 AllowedUser, User 테이블 확인
```

### 3. 문제 상황 대응

**Case 1: 졸업생이 가입 안된다고 연락**
```sql
-- Prisma Studio에서 확인
-- AllowedUser 테이블에서 해당 이메일 검색
-- 없으면 추가, 있으면 isRegistered 상태 확인
```

**Case 2: 졸업생 아닌 사람이 가입 시도**
```bash
# 가입 거부됨 (403 에러) - 정상 작동
# 로그에서 확인 가능
```

**Case 3: 이메일 변경 요청**
```bash
# 기존 이메일 삭제
curl -X DELETE http://localhost:3000/api/admin/allowed-users \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"old@email.com"}'

# 새 이메일 추가
curl -X POST http://localhost:3000/api/admin/allowed-users \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"new@email.com","name":"김학생","role":"TALENT"}'
```

## 📊 정기 관리 작업

### 월별 체크리스트
- [ ] 신규 졸업생 명단 업데이트
- [ ] 가입률 확인 (AllowedUser vs User 테이블 비교)
- [ ] 보안 로그 검토
- [ ] 데이터베이스 백업

### 연도별 작업
- [ ] 졸업생 명단 대량 업데이트
- [ ] 이전 연도 데이터 아카이브
- [ ] 보안 정책 업데이트
- [ ] 시스템 성능 최적화

## 🔍 모니터링 도구

### 1. 가입 현황 대시보드 (추후 개발 권장)
```javascript
// 통계 API 예시
GET /api/admin/stats
{
  "totalAllowed": 150,
  "totalRegistered": 89,
  "registrationRate": "59.3%",
  "recentSignups": [...]
}
```

### 2. 알림 시스템 (추후 개발 권장)
- 새로운 가입 시 이메일 알림
- 의심스러운 가입 시도 알림
- 시스템 오류 알림

## 🚨 보안 사고 대응

### 데이터 유출 의심 시
1. **즉시 조치**
   ```bash
   # 관리자 API 비활성화
   # .env.local에서 ADMIN_SECRET_KEY 변경
   ```

2. **영향 범위 조사**
   - 어떤 데이터가 노출되었는지 확인
   - 언제부터 언제까지 접근 가능했는지 확인

3. **대응 조치**
   - 비밀번호 변경 권고
   - 시스템 보안 강화
   - 관련자 통보

### 예방 조치
- 정기적인 보안 감사
- 접근 로그 모니터링
- 직원 보안 교육
- 백업 시스템 검증

## 📞 문의 대응

### FAQ 템플릿

**Q: 가입이 안 돼요**
A: 서울대 KDT 졸업생만 가입 가능합니다. 졸업생 명단에 등록된 이메일을 사용해주세요.

**Q: 다른 이메일로 가입하고 싶어요**
A: 관리자에게 연락하여 이메일 변경을 요청해주세요.

**Q: 역할(talent/CEO)을 바꾸고 싶어요**
A: 가입 후 프로필에서 변경 가능하거나, 관리자에게 문의해주세요.

## 📈 확장 계획

### 단기 (1-3개월)
- [ ] 가입 현황 대시보드 개발
- [ ] 이메일 알림 시스템 구축
- [ ] 자동 백업 시스템 구축

### 중기 (3-6개월)
- [ ] 모바일 앱 지원
- [ ] 고급 검색 기능
- [ ] 사용자 분석 도구

### 장기 (6개월+)
- [ ] AI 기반 사용자 매칭
- [ ] 외부 시스템 연동
- [ ] 국제화 지원 