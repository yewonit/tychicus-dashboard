# API 연동 계획서 (구성원 관리)

**작성일**: 2024년 11월 22일
**작성자**: 프론트엔드 개발팀
**목적**: 백엔드 API 검토 결과를 바탕으로 프론트엔드 서비스 레이어 수정 및 데이터 연동 계획 수립

---

## 1. API 매핑 및 현황 분석

| 기능 | 프론트엔드 구현 (현재) | 백엔드 스펙 (확정) | 상태/조치사항 |
| :--- | :--- | :--- | :--- |
| **구성원 목록** | `GET /api/members` | `GET /api/users/list` | **엔드포인트 수정**, 응답 데이터 매핑 필요 |
| **필터 옵션** | 자체 데이터 추출 | `GET /api/organizations/filter-options` | **신규 API 적용**, 로직 단순화 가능 |
| **소속 일괄 변경** | `PUT /api/members/affiliation` | `PATCH /api/users/bulk-change-organization` | **엔드포인트 수정**, 조직 ID 변환 로직 추가 필요 |
| **구성원 상세** | `GET /api/members/:id` | `GET /api/users/:id` | 기존 유지, 상세 정보(히스토리, 출석) 미구현 상태 인지 |
| **구성원 추가** | `POST /api/members` | `POST /api/users` | **엔드포인트 수정**, 요청 포맷 변환 필요 |

---

## 2. 데이터 변환 전략 (Adapter Pattern)

프론트엔드 컴포넌트는 기존 한글 필드명(`이름`, `소속국` 등)을 그대로 사용하고, **Service Layer**에서 백엔드 형식으로 변환하여 통신합니다.

### 2.1 필드명 매핑 (Member Interface)

| 프론트엔드 (Component) | 백엔드 (API Response) | 변환 로직 |
| :--- | :--- | :--- |
| `id` | `id` | - |
| `이름` | `name` | - |
| `생일연도` | `birthYear` | - |
| `소속국` | `affiliation.department` | 중첩 객체 접근 |
| `소속그룹` | `affiliation.group` | 중첩 객체 접근 |
| `소속순` | `affiliation.team` | 중첩 객체 접근 |
| `직분` | `role` | - |
| `휴대폰번호` | `phoneNumber` | - |

### 2.2 조직 정보 변환 (String ↔ ID)

백엔드의 수정/생성 API는 `organizationId`를 요구하므로, 프론트엔드의 문자열 소속 정보("1국", "김민수그룹", "이용걸순")를 ID로 변환해야 합니다.

1.  **조직 목록 조회**: `GET /api/organizations` (또는 유사 API)를 통해 전체 조직 구조를 가져와 캐싱(Context 또는 Store)합니다.
2.  **ID 찾기 로직**:
    ```typescript
    // 예시 로직
    const findOrgId = (dept: string, group: string, team: string) => {
       const orgName = `${dept}_${group}_${team}`; // 백엔드 조직명 규칙 확인 필요
       return cachedOrgs.find(org => org.name === orgName)?.id;
    }
    ```

### 2.3 생년월일 변환

-   **Front**: "95" (YY)
-   **Back**: "1995-05-15" (YYYY-MM-DD)
-   **Logic**:
    -   조회 시: `birth_date`에서 연도 추출 후 뒤 2자리 사용
    -   전송 시: YY -> YYYY 변환 (기준: 50 이상 1900년대, 미만 2000년대), 월/일은 기본값(01-01) 또는 입력값 사용

---

## 3. 적용 계획 (Implementation Plan)

### 단계 1: 타입 정의 수정 (`src/types/api.ts`)

백엔드 응답에 맞춘 DTO(Data Transfer Object) 인터페이스를 정의합니다.

```typescript
// 백엔드 실제 응답 타입
export interface UserDto {
  id: number;
  name: string;
  birthYear: string;
  phoneNumber: string;
  affiliation: {
    department: string;
    group: string;
    team: string;
  };
  role: string;
}

// 프론트엔드 내부 사용 타입 (기존 유지)
export interface Member {
  id: number;
  이름: string;
  // ...
}
```

### 단계 2: 서비스 레이어 구현 (`src/services/memberService.ts`)

목업 데이터를 제거하고 실제 API 호출 및 데이터 변환 로직을 구현합니다.

1.  **`getMembers`**:
    -   `axios.get('/api/users/list', { params: ... })` 호출
    -   응답 `UserDto[]`를 `Member[]`로 매핑하여 반환

2.  **`getFilterOptions`**:
    -   `axios.get('/api/organizations/filter-options')` 호출

3.  **`updateMembersAffiliation`**:
    -   먼저 조직 ID 조회 (필요 시 `fetchOrganizations` 선행 호출)
    -   `axios.patch('/api/users/bulk-change-organization', ...)` 호출

4.  **`createMember`**:
    -   조직 ID 조회 및 날짜 변환
    -   `axios.post('/api/users', ...)` 호출

### 단계 3: 컴포넌트 연동 확인

-   `MembersManagement.tsx`에서 `memberService` 호출부가 정상 동작하는지 확인
-   검색, 필터, 페이지네이션, 소속 변경 기능 테스트

---

## 4. 이슈 및 확인 사항

-   **조직명 규칙**: 백엔드에서 조직명을 어떻게 구성하는지 정확한 규칙 확인 필요 (예: `1국_김민수그룹_이용걸순` 띄어쓰기 등)
-   **직분 매핑**: 프론트엔드 "청년" -> 백엔드 "순원" 매핑 로직 추가
-   **인증**: API 호출 시 토큰(Bearer) 자동 포함 여부 확인 (`axiosClient` 설정 확인)

