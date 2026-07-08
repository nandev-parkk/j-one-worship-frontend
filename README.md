# J-One Worship Frontend

웹 브라우저에서 예배 팀의 공연, 세트리스트, 투표 등을 관리하는 SPA입니다.

## 기술 스택

| 영역 | 도구 |
|------|------|
| 빌드 | Vite 8 |
| 프레임워크 | React 19 |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (18개 컴포넌트) |
| 아이콘 | lucide-react |
| 날짜 유틸 | date-fns |
| 상태 관리 | TanStack Query, Zustand |
| 라우팅 | React Router v8 |
| HTTP | Axios |
| 폼 | React Hook Form + Zod |

## 실행

```bash
npm install
cp .env.example .env
npm run dev
```

- 개발 서버: http://localhost:5173
- `.env`에 `VITE_API_URL=http://localhost:8000`을 설정합니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 실행 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format` | Prettier 포매팅 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |

## 프로젝트 구조

```
src/
├── app.tsx               # Provider 래핑 (QueryClientProvider 등)
├── routes.tsx            # React Router v8 라우트 정의
├── lib/
│   ├── api.ts            # Axios 인스턴스, API 호출 함수
│   ├── query-client.ts   # TanStack Query 클라이언트 설정
│   └── utils.ts          # 공유 유틸리티
├── stores/
│   └── index.ts          # Zustand 글로벌 상태
└── components/ui/        # shadcn/ui 컴포넌트 (18개)
```

## 환경 변수

| 변수 | 설명 |
|------|------|
| `VITE_API_URL` | Backend API 주소 (기본 `http://localhost:8000`) |
