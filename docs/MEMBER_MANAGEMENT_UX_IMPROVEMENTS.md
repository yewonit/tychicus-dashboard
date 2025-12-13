# 구성원 관리 화면 UX/사용성 개선사항

**작성일**: 2025년 1월 27일  
**대상**: 구성원 관리 전체 화면 (목록, 상세, 모달)

---

## 📋 개선사항 목록

### 🔴 높은 우선순위 (Critical)

#### 1. 에러 처리 및 사용자 피드백 개선
**현재 문제점:**
- `alert()` 사용이 많아 사용자 경험이 좋지 않음
- 에러 메시지가 일관성 없고 구체적이지 않음
- 성공/실패 피드백이 제한적

**개선 방안:**
- ✅ Toast/Notification 시스템 도입 (Material-UI Snackbar 또는 커스텀)
- ✅ 에러 메시지를 사용자 친화적인 문구로 변경
- ✅ 필드별 에러 표시 (인라인 에러 메시지)
- ✅ 로딩 상태 표시 개선 (스켈레톤 UI 또는 스피너)

**예시:**
```tsx
// 현재
alert('이름을 입력해주세요.');

// 개선
<FormField
  error={errors.이름}
  touched={touched.이름}
  helperText="이름을 입력해주세요"
/>
```

---

#### 2. 검색 기능 디바운싱
**현재 문제점:**
- 검색어 입력 시 매번 API 호출 발생
- 불필요한 네트워크 요청 증가
- 성능 저하 및 서버 부하

**개선 방안:**
- ✅ `useDebounce` 훅 활용 (300-500ms 지연)
- ✅ 검색 중 표시 (로딩 인디케이터)
- ✅ 최소 검색어 길이 제한 (2자 이상)

**예시:**
```tsx
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm === '') {
    fetchMembers();
  }
}, [debouncedSearchTerm]);
```

---

#### 3. 필터 초기화 기능
**현재 문제점:**
- 필터를 개별적으로 초기화해야 함
- 필터 상태를 한눈에 파악하기 어려움
- 필터 적용 여부를 명확히 알기 어려움

**개선 방안:**
- ✅ "필터 초기화" 버튼 추가
- ✅ 활성 필터 개수 표시 배지
- ✅ 필터 상태 요약 표시

**예시:**
```tsx
<div className="filter-summary">
  {activeFiltersCount > 0 && (
    <>
      <span className="filter-badge">{activeFiltersCount}개 필터 적용 중</span>
      <button onClick={handleResetFilters}>필터 초기화</button>
    </>
  )}
</div>
```

---

#### 4. 테이블 행 클릭 영역 확대
**현재 문제점:**
- 이름만 클릭 가능하여 사용성이 제한적
- 행 전체를 클릭할 수 없어 불편함

**개선 방안:**
- ✅ 행 전체를 클릭 가능하게 변경
- ✅ 호버 효과 개선
- ✅ 체크박스 영역은 제외

**예시:**
```tsx
<tr 
  className="clickable-row"
  onClick={() => handleMemberClick(member)}
  style={{ cursor: 'pointer' }}
>
```

---

### 🟡 중간 우선순위 (Important)

#### 5. 테이블 정렬 기능
**현재 문제점:**
- 컬럼별 정렬 기능 없음
- 데이터를 원하는 순서로 볼 수 없음

**개선 방안:**
- ✅ 컬럼 헤더 클릭 시 정렬
- ✅ 정렬 방향 표시 (↑↓)
- ✅ 기본 정렬 (이름 가나다순)

**예시:**
```tsx
<th 
  onClick={() => handleSort('이름')}
  className="sortable-header"
>
  이름 {sortField === '이름' && (sortOrder === 'asc' ? '↑' : '↓')}
</th>
```

---

#### 6. 선택된 항목 수 표시
**현재 문제점:**
- 선택된 구성원 수를 명확히 알기 어려움
- 일괄 작업 시 선택 상태 확인 불편

**개선 방안:**
- ✅ 선택된 항목 수 배지 표시
- ✅ "N개 선택됨" 텍스트 표시
- ✅ 선택 해제 버튼 추가

**예시:**
```tsx
{selectedMembers.length > 0 && (
  <div className="selection-info">
    <span>{selectedMembers.length}개 선택됨</span>
    <button onClick={() => setSelectedMembers([])}>선택 해제</button>
  </div>
)}
```

---

#### 7. 모달 폼 유효성 검사 개선
**현재 문제점:**
- `alert()`로만 에러 표시
- 필드별 에러 메시지가 없음
- 실시간 검증 부족

**개선 방안:**
- ✅ `useForm` 훅 활용
- ✅ 필드별 에러 메시지 표시
- ✅ 실시간 검증 (onBlur)
- ✅ 제출 버튼 비활성화 (유효하지 않은 경우)

**예시:**
```tsx
const form = useForm({
  initialValues: INITIAL_MEMBER_INFO,
  validationRules: {
    이름: (v) => !v ? '이름을 입력해주세요' : '',
    휴대폰번호: (v) => !/^010-\d{4}-\d{4}$/.test(v) ? '올바른 형식이 아닙니다' : '',
  },
});
```

---

#### 8. 모바일 반응형 테이블 개선
**현재 문제점:**
- 테이블이 모바일에서 가독성 낮음
- 스크롤이 불편함
- 필터 UI가 모바일에서 사용하기 어려움

**개선 방안:**
- ✅ 모바일에서 카드 형태로 변경
- ✅ 필터를 드로어/모달로 이동
- ✅ 터치 친화적인 버튼 크기

**예시:**
```css
@media (max-width: 768px) {
  .members-table {
    display: none;
  }
  .members-card-list {
    display: block;
  }
}
```

---

#### 9. 데이터 표시 개선
**현재 문제점:**
- 휴대폰 번호가 마지막 4자리만 표시됨
- 날짜 형식이 일관성 없음
- 빈 값 표시가 "-"로만 되어 있음

**개선 방안:**
- ✅ 휴대폰 번호 전체 표시 옵션 (토글)
- ✅ 날짜 형식 통일 (YYYY-MM-DD)
- ✅ 빈 값 표시 개선 (더 명확한 메시지)

**예시:**
```tsx
<td>
  {member.휴대폰번호 ? (
    <span className="phone-number">
      {showFullPhone ? member.휴대폰번호 : `***-****-${member.휴대폰번호.slice(-4)}`}
      <button onClick={() => setShowFullPhone(!showFullPhone)}>
        {showFullPhone ? '숨기기' : '전체보기'}
      </button>
    </span>
  ) : (
    <span className="empty-value">미등록</span>
  )}
</td>
```

---

#### 10. 무한 스크롤 개선
**현재 문제점:**
- 필터 변경 시 스크롤 위치가 맨 위로 이동하지 않음
- 로딩 상태가 명확하지 않음
- 끝에 도달했을 때 피드백 부족

**개선 방안:**
- ✅ 필터 변경 시 자동 스크롤 상단 이동
- ✅ 로딩 스피너 위치 개선
- ✅ 끝 도달 시 명확한 메시지

**예시:**
```tsx
useEffect(() => {
  if (isFilterChanged) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [searchTerm, filterDepartment, filterGroup, filterTeam]);
```

---

### 🟢 낮은 우선순위 (Nice to Have)

#### 11. 키보드 네비게이션
**개선 방안:**
- ✅ Tab 키로 필터/버튼 이동
- ✅ Enter 키로 검색 실행
- ✅ Esc 키로 모달 닫기
- ✅ 화살표 키로 테이블 행 이동

---

#### 12. 접근성 개선
**개선 방안:**
- ✅ ARIA 레이블 추가
- ✅ 스크린 리더 지원
- ✅ 포커스 관리 개선
- ✅ 색상 대비 개선

**예시:**
```tsx
<button
  aria-label="구성원 추가"
  aria-describedby="add-member-description"
>
  + 새 구성원 추가
</button>
```

---

#### 13. 성능 최적화
**개선 방안:**
- ✅ 가상 스크롤링 (대량 데이터)
- ✅ 메모이제이션 최적화
- ✅ 이미지 lazy loading
- ✅ 코드 스플리팅

---

#### 14. 사용자 피드백 강화
**개선 방안:**
- ✅ 작업 진행 상태 표시 (Progress Bar)
- ✅ 성공 메시지 지속 시간 조정
- ✅ 작업 취소 기능 (긴 작업의 경우)
- ✅ 작업 히스토리 표시

---

#### 15. 고급 필터링
**개선 방안:**
- ✅ 저장된 필터 (즐겨찾기)
- ✅ 필터 조합 저장
- ✅ 날짜 범위 필터
- ✅ 다중 선택 필터

---

## 📊 우선순위별 작업 계획

### Phase 1: Critical (1주)
1. 에러 처리 및 사용자 피드백 개선
2. 검색 기능 디바운싱
3. 필터 초기화 기능
4. 테이블 행 클릭 영역 확대

### Phase 2: Important (2주)
5. 테이블 정렬 기능
6. 선택된 항목 수 표시
7. 모달 폼 유효성 검사 개선
8. 모바일 반응형 테이블 개선
9. 데이터 표시 개선
10. 무한 스크롤 개선

### Phase 3: Nice to Have (3주)
11. 키보드 네비게이션
12. 접근성 개선
13. 성능 최적화
14. 사용자 피드백 강화
15. 고급 필터링

---

## 🎯 예상 효과

### 사용자 경험 개선
- ✅ 에러 메시지 이해도 향상
- ✅ 작업 효율성 증가
- ✅ 모바일 사용성 개선
- ✅ 접근성 향상

### 성능 개선
- ✅ 불필요한 API 호출 감소
- ✅ 렌더링 최적화
- ✅ 로딩 시간 단축

### 개발자 경험 개선
- ✅ 코드 일관성 향상
- ✅ 유지보수성 개선
- ✅ 재사용 가능한 컴포넌트 증가

---

## 📝 참고사항

- 모든 개선사항은 기존 디자인 시스템을 준수해야 함
- CSS는 `global.css`에 중앙 집중 관리
- Material-UI 컴포넌트는 최소한으로 사용
- 접근성은 WCAG 2.1 AA 기준 준수

---

**다음 단계**: Phase 1 작업부터 순차적으로 진행








