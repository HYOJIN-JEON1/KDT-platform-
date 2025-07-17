# 🚀 즉시 배포 가이드 (10분 완성)

## 1️⃣ Vercel 계정 생성 (2분)
1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. 무료 계정 생성

## 2️⃣ 프로젝트 준비 (3분)
```bash
# Git에 현재 코드 커밋
git add .
git commit -m "프로젝트 배포 준비"
git push origin main
```

## 3️⃣ Vercel 배포 (3분)
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 리포지토리 선택
3. Framework: "Next.js" 선택
4. Root Directory: "web" 입력
5. "Deploy" 클릭

## 4️⃣ 환경변수 설정 (2분)
Vercel 대시보드 → Settings → Environment Variables에서:
```
DATABASE_URL=file:./prisma/dev.db
ADMIN_SECRET_KEY=당신의-시크릿-키
ADMIN_ALLOWED_IPS=0.0.0.0
```

## ✅ 완료!
몇 분 후 `https://your-project.vercel.app` 주소로 접속 가능

---

## 📱 공유하기
- **동료들에게**: URL만 보내면 됨
- **모바일에서도**: 자동으로 반응형
- **실시간 업데이트**: 코드 수정하면 자동 재배포

## 💰 비용
- **무료**: 개인/팀 프로젝트
- **Pro ($20/월)**: 상업적 사용
- **데이터베이스**: 별도 필요시 Planetscale/Supabase ($5-10/월)

## 🔒 보안 주의사항
- `.env.local` 파일은 절대 Git에 올리지 마세요
- Vercel 환경변수에서만 시크릿 키 설정
- 데이터베이스는 프로덕션용으로 별도 설정 권장 