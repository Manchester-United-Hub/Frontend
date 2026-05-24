# Service Description Documentation

서비스, 모듈, API, 훅(Hook) 등 "재사용 가능한 코드 단위"를 문서화할 때의 형식과 규칙.

---

## 문서 구성 순서

1. **한 줄 요약** — 이 서비스/모듈의 단일 책임
2. **공개 인터페이스** — export되는 함수, 클래스, 타입
3. **사용 예시** — 최소 동작 코드 한 개
4. **에러/예외** — 던지는 에러 종류와 발생 조건
5. **의존성** — 외부 패키지, 환경 변수, 다른 서비스

---

## 템플릿

### API Route (Next.js App Router)

```markdown
## `POST /api/auth/login`

이메일·비밀번호로 사용자를 인증하고 세션 쿠키를 발급합니다.

**Request Body**

\`\`\`ts
{
  email: string;    // 사용자 이메일
  password: string; // 평문 비밀번호 (서버에서 bcrypt 검증)
}
\`\`\`

**Response**

| 상태 코드 | 조건 |
|-----------|------|
| `200` | 인증 성공, `Set-Cookie` 헤더 포함 |
| `400` | 필드 누락 또는 형식 오류 |
| `401` | 이메일 없음 또는 비밀번호 불일치 |
| `500` | DB 연결 실패 등 서버 오류 |

**인증 불필요** — 공개 엔드포인트
```

### Custom Hook

```markdown
## `useAuth()`

현재 로그인 상태와 인증 관련 액션을 제공합니다.

**반환값**

\`\`\`ts
{
  user: User | null;         // 로그인된 사용자, 미인증 시 null
  isLoading: boolean;        // 세션 확인 중 여부
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
\`\`\`

**사용 예시**

\`\`\`tsx
const { user, login, isLoading } = useAuth();

if (isLoading) return <Spinner />;
if (!user) return <LoginForm onSubmit={login} />;
\`\`\`

**주의:** `AuthProvider` 하위에서만 사용 가능. 그 외에서 호출 시 `Error: useAuth must be used within AuthProvider` 발생.
```

### 서비스 클래스 / 유틸리티 모듈

```markdown
## `emailService`

이메일 발송을 담당하는 서버 전용 유틸리티. Resend API를 사용합니다.

**공개 함수**

| 함수 | 설명 |
|------|------|
| `sendVerificationEmail(to, token)` | 이메일 인증 링크 발송 |
| `sendPasswordReset(to, token)` | 비밀번호 재설정 링크 발송 |

**사용 예시**

\`\`\`ts
import { emailService } from '@/lib/email';

await emailService.sendVerificationEmail('user@example.com', verifyToken);
\`\`\`

**환경 변수**

| 변수 | 설명 |
|------|------|
| `RESEND_API_KEY` | Resend 발급 API 키 (서버 전용) |
| `EMAIL_FROM` | 발신자 주소 (예: `noreply@myapp.com`) |
```

---

## 이슈 작성 기준

서비스 추가/수정 작업 시 이슈 템플릿:

```markdown
## 🎯 목표
새로운 [서비스명] 서비스 구현

## 🛠 작업
- [ ] 서비스 인터페이스 정의
- [ ] 핵심 로직 구현
- [ ] 단위 테스트 작성
- [ ] TSDoc 주석 추가

## ✅ 완료 조건
- [ ] export된 모든 함수에 TSDoc 작성
- [ ] 에러 케이스 문서화 완료
```

---

## 규칙

- **책임 단위로 분리** — 한 섹션이 여러 서비스를 설명하면 분리
- 입출력 타입은 TypeScript 인터페이스 형태로 작성 (JSON 형식 금지)
- 에러는 실제로 throw되는 것만 기재 — 이론적 가능성 나열 금지
- 서버 전용 코드는 `**서버 전용**` 명시 — 클라이언트 번들 포함 시 보안 위험
- `@internal` 마킹된 함수는 문서화 불필요

---

## TSDoc 태그 사용 기준

| 태그 | 사용 시점 |
|------|-----------|
| `@param` | 매개변수가 2개 이상이거나 의미가 불명확할 때 |
| `@returns` | 반환값이 조건에 따라 달라질 때 |
| `@throws` | 실제로 예외를 던질 때 |
| `@deprecated` | 대체 함수로 마이그레이션 중일 때 |
| `@example` | 인라인 코드 예시가 문서를 크게 도울 때 |
| `@internal` | 외부 노출 의도가 없는 export일 때 |
