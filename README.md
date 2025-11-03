# 청년회 어드민 시스템

코람데오 교회 청년회를 위한 관리 시스템입니다. React와 Python FastAPI를 기반으로 구축되었습니다.

## 🎨 디자인 시스템

Cosmic Essence 컬러 팔레트를 적용하여 따뜻함과 우주적 깊이가 만나는 조화로운 디자인을 구현했습니다.

### 컬러 팔레트
- **Rapture's Light** (#F8F7F5) - 부드러운 아이보리 톤
- **Caramel Essence** (#E3AF64) - 따뜻한 캐러멜 골드
- **Cosmic Odyssey** (#0F1939) - 깊은 우주의 네이비
- **Milk Tooth** (#FAEBD7) - 자연스러운 밀크 베이지
- **Blue Oblivion** (#26428B) - 클래식한 로얄 블루
- **Sapphire Dust** (#516AC8) - 밝은 사파이어 블루

## 📱 반응형 지원

이 어드민 시스템은 **태블릿 크기 이상의 화면에서만 지원**됩니다.

### 지원 화면 크기
- **최소 화면 너비**: 768px (태블릿 세로 모드)
- **권장 화면 너비**: 1024px 이상 (태블릿 가로 모드, 데스크톱)
- **최적화된 화면**: 1200px 이상 (데스크톱)

### 모바일 지원
- 모바일 디바이스(767px 이하)에서는 접속 시 경고 메시지가 표시됩니다.
- 태블릿 크기 이상의 화면에서 접속해주세요.

## 🚀 기능

### 대시보드
- 전체 구성원 현황
- 출석률 통계
- 월별 트렌드 차트
- 그룹별 출석률 파이 차트
- 이번 주 예배별 출석 현황
- 최근 활동 내역

### 구성원 관리
- 구성원 목록 조회
- 검색 및 필터링
- 구성원 추가/수정/삭제
- 출석 현황 관리

### 메뉴 구성
- 📊 대시보드
- 👥 구성원 관리
- 📝 출결 관리
- 💬 포럼 관리
- 🏠 심방 관리
- 📍 지역모임 관리

## 🛠 기술 스택

### Frontend
- React 18
- React Router DOM
- Styled Components
- Recharts (차트 라이브러리)

### Backend
- Python 3.8+
- FastAPI
- Pydantic
- Uvicorn

## 📦 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd youth-admin-dashboard
```

### 2. Frontend 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 3. Backend 설정
```bash
# Python 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
cd backend
pip install -r requirements.txt

# API 서버 실행
python main.py
```

### 4. 접속
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 📁 프로젝트 구조

```
DUGIGO/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.js
│   │   ├── Dashboard.js
│   │   └── MembersManagement.js
│   ├── data/
│   │   ├── mockData.js
│   │   ├── attendanceData.js
│   │   ├── testAttendanceData.js
│   │   └── exportAttendanceData.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── backend/
│   ├── main.py
│   └── requirements.txt
├── package.json
├── youth_ministry_org.md
└── README.md
```

## 🔧 개발 가이드

### 새로운 페이지 추가
1. `src/components/` 폴더에 새 컴포넌트 생성
2. `src/App.js`에 라우트 추가
3. `src/components/Sidebar.js`에 메뉴 항목 추가

### API 엔드포인트 추가
1. `backend/main.py`에 새 엔드포인트 정의
2. Pydantic 모델 추가 (필요시)
3. 가상 데이터 추가

### 스타일링
- CSS 변수를 통한 컬러 팔레트 관리
- Styled Components 사용
- 반응형 디자인 적용

## 📊 데이터 구조

### 청년회 조직 구조
청년회는 다음과 같은 계층적 구조로 구성됩니다:
- **교역자**: 목사, 전도사 (전체 총괄)
- **회장단**: 회장, 부회장, 서기, 부서기, 회계, 부회계, 총무
- **국장단**: 5개국 국장, 부국장 (각 국당 3-4개 그룹 관리)
- **그룹장단**: 각 그룹별 그룹장, 부그룹장 (각 그룹당 3-4개 순 관리)
- **순장**: 각 순의 소그룹 리더 (각 순당 최대 10명 관리)
- **EBS**: 새가족 담당자 (각 순별 1-2명)
- **순원**: 기존 청년들 (활발참여자, 단기결석자, 장기결석자)
- **새가족**: 새로 등록한 청년들

### 예배 종류
- **주일청년예배**: 일요일
- **수요제자기도회**: 수요일
- **두란도사역자모임**: 금요일
- **대예배**: 일요일 (주일 청년예배 전)

### 구성원 데이터
```javascript
{
  id: 1,
  소속국: "1국",
  소속그룹: "1국-1그룹",
  소속순: "1국-1그룹-1순",
  이름: "김민수",
  직분: "순장",
  연락처: "010-1234-5678",
  가입일: "2023-01-15",
  // 최근 4주간 출석 데이터
  주1주_주일청년예배출석여부: "출석",
  주1주_주일청년예배출석일자: "2024-01-21",
  주1주_수요제자기도회출석여부: "출석",
  주1주_수요제자기도회출석일자: "2024-01-17",
  주1주_두란도사역자모임출석여부: "출석",
  주1주_두란도사역자모임출석일자: "2024-01-19",
  주1주_대예배출석여부: "출석",
  주1주_대예배출석일자: "2024-01-21",
  // ... 주2주, 주3주, 주4주 데이터
}
```

### 데이터 샘플 파일
- `src/data/attendanceData.js`: 최근 4주간 출석 데이터 생성
- `src/data/testAttendanceData.js`: 데이터 테스트 및 확인
- `src/data/exportAttendanceData.js`: CSV 내보내기 유틸리티

### 데이터 규모
- **총 구성원**: 약 150-200명
- **국 수**: 5개
- **그룹 수**: 15-20개 (국당 3-4개)
- **순 수**: 45-80개 (그룹당 3-4개)
- **순별 구성원**: 3-10명

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요. 