# Portfolio Todo List Backend

Express.js + Prisma@6 + TypeScript 기반의 Todo List 백엔드 API 서버입니다.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma@6
- **Language**: TypeScript
- **CORS**: cors middleware

## 프로젝트 구조

```
back/
├── src/
│   ├── server.ts          # Express 서버 진입점
│   ├── controllers/       # 컨트롤러 (비즈니스 로직)
│   ├── middleware/        # 미들웨어
│   ├── schema/           # Prisma 스키마
│   └── routes/           # 라우트 정의
├── prisma/
│   └── schema.prisma     # Prisma 스키마 파일
└── package.json
```

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정 (.env 파일 생성):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/todolist?schema=public"
PORT=3001
```

3. Prisma 마이그레이션:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. 개발 서버 실행:
```bash
npm run dev
```

## API 엔드포인트

- `GET /api/todos` - 모든 Todo 조회
- `GET /api/todos/:id` - 특정 Todo 조회
- `POST /api/todos` - Todo 생성
- `PUT /api/todos/:id` - Todo 수정
- `DELETE /api/todos/:id` - Todo 삭제
- `PUT /api/todos/reorder` - Todo 순서 변경

