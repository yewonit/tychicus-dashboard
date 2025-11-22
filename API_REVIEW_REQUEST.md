# 구성원 관리 기능 API 검토 요청서

## 📋 문서 개요

**작성일**: 2024년 11월 22일  
**작성자**: 프론트엔드 개발팀  
**대상**: 백엔드 개발팀  
**목적**: 구성원 관리 페이지 UI 프로토타입 완료에 따른 백엔드 API 지원 여부 검토 요청

---

## 🎯 현재 구현 상태

구성원 관리 페이지의 UI 프로토타입이 완료되었으며, 현재는 목업 데이터로 동작하고 있습니다.  
실제 API 연동을 위해 아래 기능들을 지원하는 API가 필요한지 검토 요청드립니다.

---

## 📱 구현된 기능 목록

### 1. 구성원 목록 조회 및 검색/필터링

- **기능 설명**: 구성원 목록을 조회하고, 이름으로 검색하며, 소속국/소속그룹/소속순으로 필터링
- **현재 상태**: 목업 데이터로 동작 중
- **UI 요소**: 검색 입력창, 필터 드롭다운 (소속국/소속그룹/소속순), 테이블

### 2. 구성원 목록 페이지네이션

- **기능 설명**: 구성원 목록을 페이지 단위로 표시 (10개씩)
- **현재 상태**: 목업 데이터로 동작 중
- **UI 요소**: 페이지 번호 버튼, 이전/다음 버튼

### 3. 구성원 선택 기능 (체크박스)

- **기능 설명**: 개별 구성원 선택 및 전체 선택
- **현재 상태**: UI만 구현됨
- **UI 요소**: 체크박스

### 4. 구성원 소속 일괄 변경

- **기능 설명**: 선택한 여러 구성원의 소속을 일괄 변경
- **현재 상태**: 목업 데이터로 동작 중 (로컬 상태만 업데이트)
- **UI 요소**: 소속 변경 버튼, 모달 (소속국/소속그룹/소속순 선택)

### 5. 구성원 상세 정보 조회

- **기능 설명**: 구성원 클릭 시 상세 정보 페이지로 이동
- **현재 상태**: 목업 데이터로 동작 중
- **UI 요소**: 구성원 이름 클릭

### 6. 새 구성원 추가
    
- **기능 설명**: 새 구성원을 추가하는 기능
- **현재 상태**: 모달 UI 구현됨 (목업 데이터로 동작)
- **UI 요소**: "새 구성원 추가" 버튼, 입력 모달 (이름, 생년월일, 휴대폰번호, 소속 정보)

---

## 🔌 필요한 API 목록

### API 1: 구성원 목록 조회 (검색/필터링/페이지네이션)

#### 요청 사항

- **엔드포인트**: `GET /api/members` 또는 유사한 경로
- **기능**: 구성원 목록을 조회하며, 검색어와 필터 조건을 지원

#### 요청 파라미터

```typescript
interface GetMembersRequest {
  // 검색어 (이름)
  search?: string;

  // 필터 조건
  department?: string; // 소속국 (예: "1국", "2국")
  group?: string; // 소속그룹 (예: "김민수 그룹")
  team?: string; // 소속순 (예: "김민수 순")

  // 페이지네이션
  page?: number; // 페이지 번호 (기본값: 1)
  limit?: number; // 페이지당 항목 수 (기본값: 10)
}
```

#### 응답 형식 (예상)

```typescript
interface GetMembersResponse {
  // 구성원 목록
  members: Member[];

  // 페이지네이션 정보
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };

  // 필터 옵션 (선택사항 - 드롭다운 옵션 제공용)
  filterOptions?: {
    departments: string[];
    groups: string[];
    teams: string[];
  };
}

interface Member {
  id: number;
  이름: string;
  생일연도?: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
  직분?: string;
  주일청년예배출석일자?: string;
  수요예배출석일자?: string;
  휴대폰번호?: string;
}
```

#### 검토 사항

- [ ] 해당 API가 존재하는지 확인
- [ ] 검색 기능이 지원되는지 확인
- [ ] 필터링 기능이 지원되는지 확인
- [ ] 페이지네이션 기능이 지원되는지 확인
- [ ] 필터 옵션 목록을 별도로 제공하는 API가 필요한지 확인

---

### API 2: 구성원 소속 일괄 변경

#### 요청 사항

- **엔드포인트**: `PUT /api/members/affiliation` 또는 `PATCH /api/members/batch` 또는 유사한 경로
- **기능**: 선택한 여러 구성원의 소속을 일괄 변경

#### 요청 본문

```typescript
interface UpdateMembersAffiliationRequest {
  // 변경할 구성원 ID 배열
  memberIds: number[];

  // 새로운 소속 정보
  affiliation: {
    department: string; // 소속국 (예: "1국")
    group: string; // 소속그룹 (예: "김민수 그룹")
    team: string; // 소속순 (예: "김민수 순")
  };
}
```

#### 응답 형식 (예상)

```typescript
interface UpdateMembersAffiliationResponse {
  // 성공 여부
  success: boolean;

  // 변경된 구성원 수
  updatedCount: number;

  // 변경된 구성원 ID 목록
  updatedMemberIds: number[];

  // 메시지 (선택사항)
  message?: string;
}
```

#### 검토 사항

- [ ] 일괄 변경 API가 존재하는지 확인
- [ ] 여러 구성원을 한 번에 변경할 수 있는지 확인
- [ ] 부분 업데이트(PATCH)가 가능한지, 전체 업데이트(PUT)가 필요한지 확인
- [ ] 권한 체크가 필요한지 확인 (관리자만 가능한지 등)

---

### API 3: 구성원 상세 정보 조회

#### 요청 사항

- **엔드포인트**: `GET /api/members/:id` 또는 유사한 경로
- **기능**: 특정 구성원의 상세 정보 조회

#### 요청 파라미터

```typescript
// URL 파라미터
id: number; // 구성원 ID
```

#### 응답 형식 (예상)

```typescript
interface GetMemberDetailResponse {
  // 구성원 기본 정보
  id: number;
  이름: string;
  생일연도?: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
  직분?: string;
  주일청년예배출석일자?: string;
  수요예배출석일자?: string;
  휴대폰번호?: string;

  // 추가 정보 (선택사항)
  프로필사진?: string; // 이미지 URL 또는 base64
  최초등록일자?: string;
  출석구분?: string; // "정기출석자", "단기결석자", "장기결석자" 등

  // 히스토리 정보 (선택사항)
  히스토리?: {
    departmentHistory?: Array<{
      year: string;
      department: string;
      group: string;
      order: string;
    }>;
    absenceHistory?: Array<{
      date: string;
      reason: string;
      type: string;
    }>;
    positionHistory?: Array<{
      year: string;
      position: string;
    }>;
    newFamilyHistory?: Array<{
      date: string;
      course: string;
      status: string;
    }>;
  };

  // 영적 흐름 (선택사항)
  spiritualFlow?: Array<{
    type: 'visitation' | 'forum' | 'prayer';
    date: string;
    content: string;
  }>;
}
```

#### 검토 사항

- [ ] 구성원 상세 조회 API가 존재하는지 확인
- [ ] 히스토리 정보가 포함되는지 확인
- [ ] 영적 흐름 정보가 포함되는지 확인
- [ ] 프로필 사진 조회가 별도 API인지 확인

---

### API 4: 새 구성원 추가 (구현 완료)

#### 요청 사항

- **엔드포인트**: `POST /api/members` 또는 유사한 경로
- **기능**: 새 구성원을 추가

#### 요청 본문

```typescript
interface CreateMemberRequest {
  이름: string; // 필수
  생일연도?: string; // 선택
  휴대폰번호?: string; // 선택
  소속국: string; // 필수
  소속그룹: string; // 필수
  소속순: string; // 필수
  직분?: string; // 선택 (기본값: "청년")
}
```

#### 응답 형식 (예상)

```typescript
interface CreateMemberResponse {
  success: boolean;
  member: Member; // 생성된 구성원 정보
  message?: string;
}
```

#### 검토 사항

- [ ] 구성원 추가 API가 존재하는지 확인
- [ ] 필수 필드와 선택 필드가 무엇인지 확인
- [ ] 중복 체크 로직이 있는지 확인 (이름, 휴대폰번호 등)

---

## 🔄 현재 UI 동작 방식

### 구성원 목록 페이지

1. 페이지 로드 시: 구성원 목록 조회 (필터 없음, 첫 페이지)
2. 검색어 입력 시: 실시간 검색 (debounce 적용 예정)
3. 필터 변경 시: 해당 필터 조건으로 목록 재조회
4. 페이지 변경 시: 해당 페이지의 구성원 목록 조회
5. 체크박스 선택 시: 로컬 상태만 업데이트 (API 호출 없음)
6. 소속 변경 버튼 클릭 시: 모달 표시
7. 소속 변경 확인 시: 선택한 구성원들의 소속 일괄 변경 API 호출

### 구성원 상세 페이지

1. 구성원 이름 클릭 시: 상세 정보 조회 API 호출
2. 프로필 사진 업로드: 별도 API 필요 (현재는 로컬 스토리지 사용)

---

## ❓ 검토 요청 사항

### 1. API 존재 여부

- 위에 나열한 API들이 현재 존재하는지 확인 부탁드립니다.
- 존재하지 않는 경우, 개발 일정을 공유해주시면 프론트엔드에서 대응하겠습니다.

### 2. API 스펙 확인

- 요청/응답 형식이 위와 다른 경우, 실제 스펙을 공유해주시면 프론트엔드에서 맞춰서 수정하겠습니다.
- 특히 필드명이 다른 경우 (예: `이름` vs `name`, `소속국` vs `department`) 알려주시면 감사하겠습니다.

### 3. 인증/권한

- 각 API에 인증이 필요한지 확인 부탁드립니다.
- 특정 권한이 필요한 API가 있는지 확인 부탁드립니다.

### 4. 에러 처리

- 각 API의 에러 응답 형식을 공유해주시면 프론트엔드에서 적절히 처리하겠습니다.
- 예: 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error 등

### 5. 추가 기능

- 현재 UI에는 없지만 백엔드에서 지원하는 추가 기능이 있는지 확인 부탁드립니다.
- 예: 구성원 삭제, 구성원 정보 수정 등

---

## 📝 참고 사항

### 현재 사용 중인 목업 데이터 구조

```typescript
interface Member {
  id: number;
  이름: string;
  생일연도?: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
  직분?: string;
  주일청년예배출석일자?: string;
  수요예배출석일자?: string;
  휴대폰번호?: string;
}
```

### 구현 파일 위치

- 구성원 목록: `src/components/main/MembersManagement.tsx`
- 구성원 상세: `src/components/main/MemberDetail.tsx`
- 목업 데이터: `src/data/mockData.js`

---

## 📞 문의

API 검토 결과를 공유해주시면 프론트엔드에서 즉시 API 연동 작업을 진행하겠습니다.

**작성자**: 프론트엔드 개발팀  
**작성일**: 2024년 11월 22일  
**버전**: 1.0.0
