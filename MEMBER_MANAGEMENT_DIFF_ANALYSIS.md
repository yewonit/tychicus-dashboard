# 구성원 관리 기능 차이점 분석 보고서

## 📋 개요

**분석 대상**: `test-merge-v0.6-main` 브랜치와 현재 브랜치(`feature/member-management-improvement`)의 구성원 관리 기능 비교

**분석 일시**: 2024년 11월 22일

**목적**: test-merge-v0.6-main의 구성원 관리 기능을 현재 브랜치에 적용하기 위한 차이점 파악

---

## 📊 파일 구조 비교

### test-merge-v0.6-main 브랜치

```
src/components/
├── MembersManagement.js    (701줄)
└── MemberDetail.js         (1715줄)
```

### 현재 브랜치 (dev 기반)

```
src/components/main/
├── MembersManagement.tsx   (109줄)
└── MemberDetail.tsx        (497줄)
```

### 차이점

- **위치**: test-merge-v0.6-main은 `src/components/`, 현재는 `src/components/main/`
- **언어**: test-merge-v0.6-main은 JavaScript, 현재는 TypeScript
- **코드량**: test-merge-v0.6-main이 약 6배 더 많음

---

## 🎨 스타일링 방식 차이

### test-merge-v0.6-main

- **방식**: `styled-components` 사용
- **특징**:
  - 모든 스타일이 컴포넌트 내부에 정의됨
  - CSS 변수(`var(--text-primary)`, `var(--bg-card)` 등) 활용
  - 반응형 디자인 포함 (`@media` 쿼리)
  - 애니메이션 효과 포함

**예시**:

```javascript
const MembersContainer = styled.div`
  padding: 10px;
  min-height: 100vh;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--background-primary);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
`;
```

### 현재 브랜치

- **방식**: CSS 클래스 사용 (`global.css`)
- **특징**:
  - CSS 클래스 기반 스타일링
  - `global.css`에 스타일 정의
  - Material-UI와 함께 사용

**예시**:

```tsx
<div className='members-container'>
  <div className='members-header'>
    <h1>구성원 관리</h1>
  </div>
</div>
```

---

## 🔧 기능 차이점 상세 분석

### 1. MembersManagement 컴포넌트

#### test-merge-v0.6-main의 주요 기능

| 기능                | 설명                                 | 현재 브랜치 |
| ------------------- | ------------------------------------ | ----------- |
| **검색 기능**       | 이름으로 검색                        | ✅ 있음     |
| **필터링**          | 소속국/소속그룹/소속순 드롭다운 필터 | ❌ 없음     |
| **체크박스 선택**   | 개별 선택 및 전체 선택               | ❌ 없음     |
| **소속 변경 모달**  | 선택한 구성원들의 소속 일괄 변경     | ❌ 없음     |
| **페이지네이션**    | 페이지 단위 표시                     | ✅ 있음     |
| **휴대폰번호 표시** | 테이블에 휴대폰번호 컬럼             | ❌ 없음     |
| **상태 배지**       | 출석/결석 상태 표시                  | ❌ 없음     |
| **알림 시스템**     | 소속 변경 성공 알림                  | ❌ 없음     |

#### 주요 코드 차이

**test-merge-v0.6-main**:

```javascript
// 필터링 상태 관리
const [filterDepartment, setFilterDepartment] = useState('전체');
const [filterGroup, setFilterGroup] = useState('전체');
const [filterTeam, setFilterTeam] = useState('전체');

// 체크박스 상태 관리
const [selectedMembers, setSelectedMembers] = useState([]);

// 소속 변경 모달 상태
const [showModal, setShowModal] = useState(false);
const [showAlert, setShowAlert] = useState(false);

// 필터링 로직
const filteredMembers = members.filter(member => {
  const matchesSearch = member.이름.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesDepartment = filterDepartment === '전체' || member.소속국 === filterDepartment;
  const matchesGroup = filterGroup === '전체' || member.소속그룹 === filterGroup;
  const matchesTeam = filterTeam === '전체' || member.소속순 === filterTeam;
  return matchesSearch && matchesDepartment && matchesGroup && matchesTeam;
});
```

**현재 브랜치**:

```typescript
// 검색만 지원
const [searchTerm, setSearchTerm] = useState('');

// 필터링 로직 (검색만)
const filteredMembers = membersData.filter(
  member =>
    member.이름.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.소속국.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.소속그룹.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.소속순.toLowerCase().includes(searchTerm.toLowerCase())
);
```

#### test-merge-v0.6-main에만 있는 기능

1. **체크박스 선택 기능**
   - 전체 선택/해제
   - 개별 선택
   - 선택된 구성원 수 표시

2. **소속 변경 모달**
   - 선택한 구성원들의 소속 일괄 변경
   - 소속국/소속그룹/소속순 선택
   - 변경 완료 알림

3. **고급 필터링**
   - 소속국 드롭다운 필터
   - 소속그룹 드롭다운 필터
   - 소속순 드롭다운 필터

4. **추가 UI 요소**
   - 휴대폰번호 컬럼
   - 상태 배지 (출석/결석)
   - 소속 변경 버튼

---

### 2. MemberDetail 컴포넌트

#### test-merge-v0.6-main의 주요 기능

| 기능                  | 설명                           | 현재 브랜치   |
| --------------------- | ------------------------------ | ------------- |
| **프로필 사진 관리**  | 사진 업로드/변경/삭제/미리보기 | ✅ 있음       |
| **기본 정보 표시**    | 이름, 생년월일, 소속 등        | ✅ 있음       |
| **히스토리 탭**       | 기본이력/영적흐름 탭           | ✅ 있음       |
| **기본이력 서브탭**   | 국/그룹/순 내역, 결석 이력 등  | ✅ 있음       |
| **영적흐름 타임라인** | 심방/포럼/기도문 통합 타임라인 | ✅ 있음       |
| **스타일링**          | styled-components 기반         | ❌ CSS 클래스 |

#### 주요 차이점

**test-merge-v0.6-main**:

- **스타일링**: 모든 스타일이 `styled-components`로 정의됨
- **구조**: 더 상세한 레이아웃과 스타일링
- **애니메이션**: 호버 효과, 트랜지션 등 포함

**현재 브랜치**:

- **스타일링**: CSS 클래스 기반 (`global.css`)
- **구조**: 기본적인 레이아웃
- **기능**: 대부분의 기능은 동일하나 스타일링 방식이 다름

---

## 📦 의존성 차이

### test-merge-v0.6-main

```json
{
  "styled-components": "^5.3.9"
}
```

### 현재 브랜치

```json
{
  "@mui/material": "^5.13.7",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1"
}
```

**차이점**:

- test-merge-v0.6-main은 `styled-components` 사용
- 현재 브랜치는 Material-UI + Emotion 사용

---

## 🎯 적용해야 할 주요 기능

### 우선순위 1: 필수 기능

1. ✅ **필터링 기능** (소속국/소속그룹/소속순 드롭다운)
2. ✅ **체크박스 선택 기능** (개별/전체 선택)
3. ✅ **소속 변경 모달** (일괄 소속 변경)
4. ✅ **휴대폰번호 컬럼** 추가

### 우선순위 2: 개선 기능

1. ✅ **상태 배지** (출석/결석 상태 표시)
2. ✅ **알림 시스템** (소속 변경 성공 알림)
3. ✅ **UI/UX 개선** (스타일링 및 애니메이션)

### 우선순위 3: 스타일링

1. ⚠️ **스타일링 방식 결정 필요**
   - 옵션 A: styled-components로 전환
   - 옵션 B: CSS 클래스로 유지 (권장 - 프로젝트 가이드라인 준수)

---

## 🔄 마이그레이션 전략

### 전략 1: 기능만 이식 (권장)

- **방식**: test-merge-v0.6-main의 기능을 현재 브랜치의 CSS 클래스 방식으로 이식
- **장점**:
  - 프로젝트 가이드라인 준수 (CSS 파일 기반 스타일 관리)
  - 기존 스타일 시스템과 일관성 유지
- **단점**:
  - 스타일 코드를 CSS로 변환해야 함

### 전략 2: 완전 이식

- **방식**: test-merge-v0.6-main의 코드를 그대로 가져오기
- **장점**:
  - 빠른 적용 가능
- **단점**:
  - 프로젝트 가이드라인 위반 (styled-components 사용)
  - 스타일 시스템 불일치

---

## 📝 적용 체크리스트

### MembersManagement.tsx

- [ ] 필터링 기능 추가 (소속국/소속그룹/소속순)
- [ ] 체크박스 선택 기능 추가
- [ ] 소속 변경 모달 컴포넌트 추가
- [ ] 휴대폰번호 컬럼 추가
- [ ] 상태 배지 추가
- [ ] 알림 시스템 추가
- [ ] CSS 클래스로 스타일 변환

### MemberDetail.tsx

- [ ] 스타일 개선 (CSS 클래스 기반)
- [ ] 애니메이션 효과 추가 (CSS로)
- [ ] 레이아웃 개선

### global.css

- [ ] 구성원 관리 관련 스타일 추가
- [ ] 모달 스타일 추가
- [ ] 필터 드롭다운 스타일 추가
- [ ] 체크박스 스타일 추가
- [ ] 알림 스타일 추가

---

## 🚨 주의사항

1. **스타일링 방식**: 프로젝트 가이드라인에 따라 CSS 클래스 방식으로 유지해야 함
2. **타입 안정성**: TypeScript로 변환 시 타입 정의 필요
3. **라우팅**: test-merge-v0.6-main은 `/members/:id`, 현재는 `/main/member-management/:id`
4. **데이터 구조**: mockData 구조가 동일한지 확인 필요

---

## 📌 다음 단계

1. **기능 우선순위 결정**
2. **스타일링 방식 확정** (CSS 클래스 권장)
3. **단계별 적용 계획 수립**
4. **테스트 계획 수립**

---

**작성일**: 2024년 11월 22일  
**작성자**: AI Assistant  
**버전**: 1.0.0
