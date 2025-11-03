# 2025년 청년회 출석 데이터 구조 및 사용법

## 개요
이 데이터는 2025년 1월부터 8월까지의 청년회 조직별 예배 출석 현황을 담고 있는 가상 데이터입니다.

## 조직 구조
- **국 (Guk)**: 5개국 (1국, 2국, 3국, 4국, 5국)
- **그룹 (Group)**: 8개 그룹 (1그룹 ~ 8그룹)  
- **순 (Sun)**: 10개 순 (1순 ~ 10순)

## 예배 종류
1. **주일청년예배** (매주 일요일) - 기본 출석률: 85%
2. **수요제자기도회** (매주 수요일) - 기본 출석률: 65%
3. **두란노사역자모임** (매주 금요일) - 기본 출석률: 45%
4. **대예배** (매주 일요일, 주일 청년예배 전) - 기본 출석률: 55%

## 데이터 구조

### 1. weeklyData (주차별 상세 데이터)
```javascript
{
  month: 1,                    // 월 (1-8)
  week: 1,                     // 주차
  dates: {                     // 날짜 정보
    sunday: Date,              // 일요일 (주일청년예배 + 대예배)
    wednesday: Date,           // 수요일
    friday: Date               // 금요일
  },
  attendance: {                // 출석 데이터
    guk: {                     // 국별 데이터
      '1국': {
        '주일청년예배': {
          total: 25,            // 전체 인원
          present: 21,          // 출석 인원
          absent: 4,            // 결석 인원
          late: 2               // 지각 인원
        },
        // ... 다른 예배들
      }
    },
    group: { /* 그룹별 데이터 */ },
    sun: { /* 순별 데이터 */ }
  }
}
```

### 2. monthlySummary (월별 요약 데이터)
```javascript
{
  1: {                         // 1월
    guk: {
      '1국': {
        '주일청년예배': {
          total: 100,           // 월 총 인원
          present: 85,          // 월 총 출석
          absent: 15,           // 월 총 결석
          late: 8,              // 월 총 지각
          rate: 85.0            // 출석률 (%)
        }
      }
    },
    group: { /* 그룹별 요약 */ },
    sun: { /* 순별 요약 */ }
  }
}
```

### 3. organizationStats (조직별 통계)
```javascript
{
  guk: {
    '1국': {
      totalMembers: 25,         // 총 인원 수
      totalWeeks: 32,          // 총 주차 수
      averageAttendance: {      // 평균 출석률
        '주일청년예배': 85.2,
        '수요제자기도회': 65.8,
        '두란노사역자모임': 45.3,
        '대예배': 55.1
      }
    }
  }
}
```

## 사용 예시

### 기본 데이터 접근
```javascript
import attendanceData2025 from './attendanceData2025';

// 1월 1주차 데이터
const firstWeek = attendanceData2025.weeklyData[0];

// 1국 주일청년예배 출석률
const attendanceRate = firstWeek.attendance.guk['1국']['주일청년예배'].present / 
                      firstWeek.attendance.guk['1국']['주일청년예배'].total * 100;
```

### 차트 데이터 생성
```javascript
import { getChartData, getAttendanceTrend } from './testAttendanceData2025';

// 국별 주일청년예배 월별 출석률 차트 데이터
const chartData = getChartData('guk', '주일청년예배');

// 1국 주일청년예배 출석률 추이
const trendData = getAttendanceTrend('guk', '1국', '주일청년예배');
```

## 월별 출석률 변동 요인
- **1월**: 새해 결심, 겨울방학 (변동: ±5%)
- **2월**: 겨울방학, 설날 (변동: ±8%)
- **3월**: 개강, 새학기 (변동: ±12%)
- **4월**: 봄학기 중간 (변동: ±10%)
- **5월**: 봄학기 기말고사 (변동: ±15%)
- **6월**: 여름방학 시작 (변동: ±8%)
- **7월**: 여름방학 중 (변동: ±5%)
- **8월**: 여름방학 끝, 개강 준비 (변동: ±10%)

## 데이터 특징
1. **현실성**: 계절, 학사일정 등을 고려한 출석률 변동
2. **일관성**: 각 조직의 기본 인원 수는 고정
3. **랜덤성**: 매번 실행 시마다 다른 출석률 생성
4. **완전성**: 모든 조직, 모든 예배, 모든 주차 데이터 포함

## 파일 목록
- `attendanceData2025.js`: 메인 데이터 파일
- `testAttendanceData2025.js`: 테스트 및 차트 데이터 생성 함수
- `README_attendanceData2025.md`: 이 문서

## 주의사항
- 이 데이터는 가상 데이터로, 실제 출석 현황과는 다를 수 있습니다.
- 차트 구현 시 Chart.js 등의 라이브러리와 함께 사용하세요.
- 데이터는 매번 새로 생성되므로, 일관된 결과를 원한다면 데이터를 저장해두세요.


