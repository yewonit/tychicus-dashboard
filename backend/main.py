from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, date
import json
import os
from fastapi import UploadFile, File
import shutil

app = FastAPI(
    title="청년회 어드민 API",
    description="코람데오 청년회 어드민 시스템 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 업로드된 파일을 저장할 디렉토리 생성
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# 정적 파일 서빙 설정
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 데이터 모델
class Member(BaseModel):
    id: int
    소속국: str
    소속그룹: str
    소속순: int
    이름: str
    직분: str
    출석상태: str  # 정기 출석자, 관심 출석자, 단기 결석자, 장기 결석자, 제적 대상자
    주일청년예배출석여부: str
    주일청년예배출석일자: str
    수요예배출석여부: str
    수요예배출석일자: str
    금요예배출석여부: str
    금요예배출석일자: str
    대예배출석여부: str
    대예배출석일자: str

class Visitation(BaseModel):
    id: int
    대상자_이름: str
    대상자_국: str
    대상자_그룹: str
    대상자_순: str
    대상자_생일연도: int
    심방날짜: str
    심방방법: str  # 만남, 통화, 카카오톡
    진행자_이름: str
    진행자_직분: str
    진행자_국: str
    진행자_그룹: str
    진행자_순: str
    진행자_생일연도: int
    심방내용: str
    대상자_사진: Optional[str] = None  # 사진 파일 경로
    작성일시: str

class DashboardStats(BaseModel):
    totalMembers: int
    activeMembers: int
    attendanceRate: float
    groups: int
    thisWeekAttendance: dict
    monthlyTrend: List[dict]

class GroupAttendance(BaseModel):
    group: str
    attendance: int
    members: int

class RecentActivity(BaseModel):
    id: int
    type: str
    member: str
    group: str
    date: str
    time: str

# 가상 데이터
mock_members = [
    {
        "id": 1,
        "소속국": "1국",
        "소속그룹": "1그룹",
        "소속순": 1,
        "이름": "김민수",
        "직분": "그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 2,
        "소속국": "1국",
        "소속그룹": "1그룹",
        "소속순": 2,
        "이름": "이지은",
        "직분": "부그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 3,
        "소속국": "2국",
        "소속그룹": "2그룹",
        "소속순": 1,
        "이름": "박준호",
        "직분": "그룹장",
        "출석상태": "관심 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "결석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 4,
        "소속국": "2국",
        "소속그룹": "2그룹",
        "소속순": 2,
        "이름": "최수진",
        "직분": "부그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 5,
        "소속국": "3국",
        "소속그룹": "3그룹",
        "소속순": 1,
        "이름": "정현우",
        "직분": "그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 6,
        "소속국": "3국",
        "소속그룹": "3그룹",
        "소속순": 2,
        "이름": "한소영",
        "직분": "부그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 7,
        "소속국": "4국",
        "소속그룹": "4그룹",
        "소속순": 1,
        "이름": "강동현",
        "직분": "그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 8,
        "소속국": "4국",
        "소속그룹": "4그룹",
        "소속순": 2,
        "이름": "윤미라",
        "직분": "부그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 9,
        "소속국": "5국",
        "소속그룹": "5그룹",
        "소속순": 1,
        "이름": "송태민",
        "직분": "그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    },
    {
        "id": 10,
        "소속국": "5국",
        "소속그룹": "5그룹",
        "소속순": 2,
        "이름": "임하나",
        "직분": "부그룹장",
        "출석상태": "정기 출석자",
        "주일청년예배출석여부": "출석",
        "주일청년예배출석일자": "2024-01-21",
        "수요예배출석여부": "출석",
        "수요예배출석일자": "2024-01-17",
        "금요예배출석여부": "출석",
        "금요예배출석일자": "2024-01-19",
        "대예배출석여부": "출석",
        "대예배출석일자": "2024-01-21"
    }
]

mock_dashboard_stats = {
    "totalMembers": 15,
    "activeMembers": 14,
    "attendanceRate": 93.3,
    "groups": 8,
    "thisWeekAttendance": {
        "sunday": 14,
        "wednesday": 13,
        "friday": 14
    },
    "monthlyTrend": [
        {"month": "1월", "attendance": 85},
        {"month": "2월", "attendance": 82},
        {"month": "3월", "attendance": 88},
        {"month": "4월", "attendance": 84},
        {"month": "5월", "attendance": 86},
        {"month": "6월", "attendance": 89}
    ]
}

mock_department_stats = {
    "1국": {
        "totalMembers": 4,
        "activeMembers": 4,
        "attendanceRate": 87.5,
        "groups": 1,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 4
        }
    },
    "2국": {
        "totalMembers": 4,
        "activeMembers": 4,
        "attendanceRate": 75.0,
        "groups": 1,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 3
        }
    },
    "3국": {
        "totalMembers": 4,
        "activeMembers": 3,
        "attendanceRate": 66.7,
        "groups": 1,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 3
        }
    },
    "4국": {
        "totalMembers": 4,
        "activeMembers": 4,
        "attendanceRate": 100.0,
        "groups": 1,
        "thisWeekAttendance": {
            "sunday": 4,
            "wednesday": 4,
            "friday": 4
        }
    },
    "5국": {
        "totalMembers": 4,
        "activeMembers": 3,
        "attendanceRate": 75.0,
        "groups": 1,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 3
        }
    }
}

mock_group_stats = {
    "1국-1그룹": {
        "totalMembers": 4,
        "activeMembers": 4,
        "attendanceRate": 87.5,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 4
        }
    },
    "2국-2그룹": {
        "totalMembers": 4,
        "activeMembers": 4,
        "attendanceRate": 75.0,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 3
        }
    },
    "3국-3그룹": {
        "totalMembers": 4,
        "activeMembers": 3,
        "attendanceRate": 66.7,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 3
        }
    },
    "4국-4그룹": {
        "totalMembers": 4,
        "activeMembers": 4,
        "attendanceRate": 100.0,
        "thisWeekAttendance": {
            "sunday": 4,
            "wednesday": 4,
            "friday": 4
        }
    },
    "5국-5그룹": {
        "totalMembers": 4,
        "activeMembers": 3,
        "attendanceRate": 75.0,
        "thisWeekAttendance": {
            "sunday": 3,
            "wednesday": 3,
            "friday": 3
        }
    }
}

mock_group_attendance = [
    {"group": "1국-1그룹", "attendance": 87.5, "members": 4},
    {"group": "2국-2그룹", "attendance": 75.0, "members": 4},
    {"group": "3국-3그룹", "attendance": 66.7, "members": 4},
    {"group": "4국-4그룹", "attendance": 100.0, "members": 4},
    {"group": "5국-5그룹", "attendance": 75.0, "members": 4}
]

mock_recent_activities = [
    {
        "id": 1,
        "type": "심방",
        "member": "이지은",
        "group": "1국-1그룹",
        "date": "2024-01-20",
        "time": "14:30"
    },
    {
        "id": 2,
        "type": "지역모임",
        "member": "최수진",
        "group": "2국-2그룹",
        "date": "2024-01-18",
        "time": "20:00"
    },
    {
        "id": 3,
        "type": "심방",
        "member": "정현우",
        "group": "3국-3그룹",
        "date": "2024-01-16",
        "time": "16:30"
    },
    {
        "id": 4,
        "type": "지역모임",
        "member": "강동현",
        "group": "4국-4그룹",
        "date": "2024-01-15",
        "time": "19:00"
    },
    {
        "id": 5,
        "type": "심방",
        "member": "송태민",
        "group": "5국-5그룹",
        "date": "2024-01-14",
        "time": "15:45"
    },
    {
        "id": 6,
        "type": "지역모임",
        "member": "임하나",
        "group": "5국-5그룹",
        "date": "2024-01-13",
        "time": "20:30"
    }
]

# 심방 데이터
mock_visitations = [
    {
        "id": 1,
        "대상자_이름": "김민수",
        "대상자_국": "1국",
        "대상자_그룹": "1그룹",
        "대상자_순": "1",
        "대상자_생일연도": 1995,
        "심방날짜": "2024-01-20",
        "심방방법": "만남",
        "진행자_이름": "이지은",
        "진행자_직분": "부그룹장",
        "진행자_국": "1국",
        "진행자_그룹": "1그룹",
        "진행자_순": "2",
        "진행자_생일연도": 1996,
        "심방내용": "최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다. 다음 주일 예배 참석을 약속하셨습니다.",
        "대상자_사진": None,
        "작성일시": "2024-01-20 15:30"
    },
    {
        "id": 2,
        "대상자_이름": "박준호",
        "대상자_국": "2국",
        "대상자_그룹": "2그룹",
        "대상자_순": "2",
        "대상자_생일연도": 1994,
        "심방날짜": "2024-01-19",
        "심방방법": "통화",
        "진행자_이름": "정현우",
        "진행자_직분": "그룹장",
        "진행자_국": "3국",
        "진행자_그룹": "3그룹",
        "진행자_순": "1",
        "진행자_생일연도": 1993,
        "심방내용": "가족 문제로 고민이 많다고 하셨습니다. 함께 기도하고 성경 말씀을 나누었습니다. 정기적인 심방을 통해 지속적인 관심을 기울이기로 했습니다.",
        "대상자_사진": None,
        "작성일시": "2024-01-19 20:15"
    },
    {
        "id": 3,
        "대상자_이름": "최수진",
        "대상자_국": "2국",
        "대상자_그룹": "2그룹",
        "대상자_순": "1",
        "대상자_생일연도": 1997,
        "심방날짜": "2024-01-18",
        "심방방법": "카카오톡",
        "진행자_이름": "한소영",
        "진행자_직분": "부그룹장",
        "진행자_국": "3국",
        "진행자_그룹": "3그룹",
        "진행자_순": "2",
        "진행자_생일연도": 1996,
        "심방내용": "최근 시험 준비로 바쁘다고 하셨습니다. 기도생활을 잊지 말고 하나님께 의지하시라고 격려했습니다. 시험 후 정기적인 예배 참석을 약속하셨습니다.",
        "대상자_사진": None,
        "작성일시": "2024-01-18 22:45"
    }
]

mock_department_monthly_trends = {
    "1국": [
        {"month": "1월", "attendance": 85},
        {"month": "2월", "attendance": 82},
        {"month": "3월", "attendance": 88},
        {"month": "4월", "attendance": 84},
        {"month": "5월", "attendance": 86},
        {"month": "6월", "attendance": 90}
    ],
    "2국": [
        {"month": "1월", "attendance": 80},
        {"month": "2월", "attendance": 78},
        {"month": "3월", "attendance": 85},
        {"month": "4월", "attendance": 82},
        {"month": "5월", "attendance": 84},
        {"month": "6월", "attendance": 88}
    ],
    "3국": [
        {"month": "1월", "attendance": 75},
        {"month": "2월", "attendance": 72},
        {"month": "3월", "attendance": 80},
        {"month": "4월", "attendance": 78},
        {"month": "5월", "attendance": 82},
        {"month": "6월", "attendance": 85}
    ],
    "4국": [
        {"month": "1월", "attendance": 90},
        {"month": "2월", "attendance": 88},
        {"month": "3월", "attendance": 92},
        {"month": "4월", "attendance": 90},
        {"month": "5월", "attendance": 94},
        {"month": "6월", "attendance": 96}
    ],
    "5국": [
        {"month": "1월", "attendance": 82},
        {"month": "2월", "attendance": 80},
        {"month": "3월", "attendance": 85},
        {"month": "4월", "attendance": 83},
        {"month": "5월", "attendance": 87},
        {"month": "6월", "attendance": 89}
    ]
}

# API 엔드포인트
@app.get("/")
async def root():
    return {"message": "청년회 어드민 API 서버가 실행 중입니다."}

@app.get("/api/members", response_model=List[Member])
async def get_members():
    """모든 구성원 정보를 반환합니다."""
    return mock_members

@app.get("/api/members/{member_id}", response_model=Member)
async def get_member(member_id: int):
    """특정 구성원 정보를 반환합니다."""
    for member in mock_members:
        if member["id"] == member_id:
            return member
    raise HTTPException(status_code=404, detail="구성원을 찾을 수 없습니다.")

@app.post("/api/members", response_model=Member)
async def create_member(member: Member):
    """새로운 구성원을 추가합니다."""
    new_member = member.dict()
    new_member["id"] = max([m["id"] for m in mock_members]) + 1
    mock_members.append(new_member)
    return new_member

@app.put("/api/members/{member_id}", response_model=Member)
async def update_member(member_id: int, member: Member):
    """구성원 정보를 수정합니다."""
    for i, existing_member in enumerate(mock_members):
        if existing_member["id"] == member_id:
            updated_member = member.dict()
            updated_member["id"] = member_id
            mock_members[i] = updated_member
            return updated_member
    raise HTTPException(status_code=404, detail="구성원을 찾을 수 없습니다.")

@app.delete("/api/members/{member_id}")
async def delete_member(member_id: int):
    """구성원을 삭제합니다."""
    for i, member in enumerate(mock_members):
        if member["id"] == member_id:
            deleted_member = mock_members.pop(i)
            return {"message": f"{deleted_member['이름']} 구성원이 삭제되었습니다."}
    raise HTTPException(status_code=404, detail="구성원을 찾을 수 없습니다.")

@app.get("/api/members/{member_id}/profile-photo")
async def get_member_profile_photo(member_id: int):
    """구성원의 프로필 사진을 반환합니다."""
    # 실제 구현에서는 데이터베이스에서 프로필 사진을 가져와야 합니다.
    # 현재는 mock 데이터를 사용하므로, 실제 파일 시스템이나 데이터베이스에서 가져오는 로직으로 변경해야 합니다.
    
    # 구성원이 존재하는지 확인
    member_exists = any(member["id"] == member_id for member in mock_members)
    if not member_exists:
        raise HTTPException(status_code=404, detail="구성원을 찾을 수 없습니다.")
    
    # 실제 구현에서는 구성원의 프로필 사진 파일 경로를 반환해야 합니다.
    # 현재는 mock 응답을 반환합니다.
    return {
        "member_id": member_id,
        "profile_photo_url": f"/uploads/members/{member_id}/profile.jpg",
        "message": "프로필 사진 정보"
    }

@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """대시보드 통계 정보를 반환합니다."""
    return mock_dashboard_stats

@app.get("/api/dashboard/department-stats")
async def get_department_stats():
    """국별 통계 정보를 반환합니다."""
    return mock_department_stats

@app.get("/api/dashboard/group-stats")
async def get_group_stats():
    """그룹별 통계 정보를 반환합니다."""
    return mock_group_stats

@app.get("/api/dashboard/group-attendance", response_model=List[GroupAttendance])
async def get_group_attendance():
    """그룹별 출석률 정보를 반환합니다."""
    return mock_group_attendance

@app.get("/api/dashboard/recent-activities", response_model=List[RecentActivity])
async def get_recent_activities():
    """최근 활동 정보를 반환합니다."""
    return mock_recent_activities

@app.get("/api/dashboard/monthly-trends")
async def get_monthly_trends():
    """국별 월별 트렌드 정보를 반환합니다."""
    return mock_department_monthly_trends

@app.get("/api/dashboard/attendance-status-stats")
async def get_attendance_status_stats():
    """출석 상태별 통계 정보를 반환합니다."""
    # 출석 상태별 멤버 수 계산
    status_counts = {}
    for member in mock_members:
        status = member["출석상태"]
        if status not in status_counts:
            status_counts[status] = 0
        status_counts[status] += 1
    
    # 출석 상태별 통계 데이터 생성
    attendance_status_stats = {
        "정기 출석자": {
            "count": status_counts.get("정기 출석자", 0),
            "percentage": round((status_counts.get("정기 출석자", 0) / len(mock_members)) * 100, 1),
            "color": "#4CAF50",
            "description": "매주 주일 예배 참석"
        },
        "관심 출석자": {
            "count": status_counts.get("관심 출석자", 0),
            "percentage": round((status_counts.get("관심 출석자", 0) / len(mock_members)) * 100, 1),
            "color": "#8BC34A",
            "description": "1주, 2주 정도 가끔씩 예배 불참석"
        },
        "단기 결석자": {
            "count": status_counts.get("단기 결석자", 0),
            "percentage": round((status_counts.get("단기 결석자", 0) / len(mock_members)) * 100, 1),
            "color": "#FF9800",
            "description": "4주동안 예배 불참석"
        },
        "장기 결석자": {
            "count": status_counts.get("장기 결석자", 0),
            "percentage": round((status_counts.get("장기 결석자", 0) / len(mock_members)) * 100, 1),
            "color": "#F44336",
            "description": "12주 이상 예배 불참석"
        },
        "제적 대상자": {
            "count": status_counts.get("제적 대상자", 0),
            "percentage": round((status_counts.get("제적 대상자", 0) / len(mock_members)) * 100, 1),
            "color": "#9E9E9E",
            "description": "올해 한번도 예배 불참석"
        }
    }
    
    return attendance_status_stats

@app.get("/api/members/by-attendance-status/{status}")
async def get_members_by_attendance_status(status: str):
    """특정 출석 상태의 멤버들을 반환합니다."""
    filtered_members = [member for member in mock_members if member["출석상태"] == status]
    return {
        "status": status,
        "count": len(filtered_members),
        "members": filtered_members
    }

@app.get("/api/dashboard/filtered-stats")
async def get_filtered_stats(department: str = "전체", group: str = "전체"):
    """필터링된 통계 정보를 반환합니다."""
    if department == "전체":
        return mock_dashboard_stats
    elif group == "전체":
        return mock_department_stats.get(department, mock_dashboard_stats)
    else:
        group_key = f"{department}-{group}"
        return mock_group_stats.get(group_key, mock_dashboard_stats)

@app.get("/api/attendance")
async def get_attendance():
    """출결 관리 데이터를 반환합니다."""
    return {
        "message": "출결 관리 API",
        "data": mock_members
    }

@app.get("/api/forum")
async def get_forum():
    """포럼 관리 데이터를 반환합니다."""
    return {
        "message": "포럼 관리 API",
        "data": []
    }

@app.post("/api/visitation/upload-photo")
async def upload_visitation_photo(file: UploadFile = File(...)):
    """심방 기록에 사진을 업로드합니다."""
    file_extension = os.path.splitext(file.filename)[1]
    if file_extension not in [".jpg", ".jpeg", ".png", ".gif"]:
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다.")

    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": filename}

@app.get("/api/visitation")
async def get_visitation():
    """심방 관리 데이터를 반환합니다."""
    return {
        "message": "심방 관리 API",
        "data": mock_visitations
    }

@app.get("/api/visitation/{visitation_id}", response_model=Visitation)
async def get_visitation_detail(visitation_id: int):
    """특정 심방 정보를 반환합니다."""
    for visitation in mock_visitations:
        if visitation["id"] == visitation_id:
            return visitation
    raise HTTPException(status_code=404, detail="심방 기록을 찾을 수 없습니다.")

@app.post("/api/visitation", response_model=Visitation)
async def create_visitation(visitation: Visitation):
    """새로운 심방 기록을 추가합니다."""
    new_visitation = visitation.dict()
    new_visitation["id"] = max([v["id"] for v in mock_visitations]) + 1 if mock_visitations else 1
    new_visitation["작성일시"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    mock_visitations.append(new_visitation)
    return new_visitation

@app.put("/api/visitation/{visitation_id}", response_model=Visitation)
async def update_visitation(visitation_id: int, visitation: Visitation):
    """심방 기록을 수정합니다."""
    for i, existing_visitation in enumerate(mock_visitations):
        if existing_visitation["id"] == visitation_id:
            updated_visitation = visitation.dict()
            updated_visitation["id"] = visitation_id
            updated_visitation["작성일시"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            mock_visitations[i] = updated_visitation
            return updated_visitation
    raise HTTPException(status_code=404, detail="심방 기록을 찾을 수 없습니다.")

@app.delete("/api/visitation/{visitation_id}")
async def delete_visitation(visitation_id: int):
    """심방 기록을 삭제합니다."""
    for i, visitation in enumerate(mock_visitations):
        if visitation["id"] == visitation_id:
            deleted_visitation = mock_visitations.pop(i)
            return {"message": f"{deleted_visitation['대상자_이름']} 심방 기록이 삭제되었습니다."}
    raise HTTPException(status_code=404, detail="심방 기록을 찾을 수 없습니다.")

@app.get("/api/visitation/stats")
async def get_visitation_stats():
    """심방 통계 정보를 반환합니다."""
    total_visitations = len(mock_visitations)
    
    # 심방 방법별 통계
    method_stats = {}
    for visitation in mock_visitations:
        method = visitation["심방방법"]
        if method not in method_stats:
            method_stats[method] = 0
        method_stats[method] += 1
    
    # 국별 심방 통계
    department_stats = {}
    for visitation in mock_visitations:
        dept = visitation["대상자_국"]
        if dept not in department_stats:
            department_stats[dept] = 0
        department_stats[dept] += 1
    
    # 최근 심방 통계 (최근 30일)
    recent_visitations = [
        v for v in mock_visitations 
        if (datetime.now() - datetime.strptime(v["심방날짜"], "%Y-%m-%d")).days <= 30
    ]
    
    return {
        "total_visitations": total_visitations,
        "method_stats": method_stats,
        "department_stats": department_stats,
        "recent_visitations": len(recent_visitations),
        "this_month_visitations": len(recent_visitations)
    }

@app.get("/api/meetings")
async def get_meetings():
    """지역모임 관리 데이터를 반환합니다."""
    return {
        "message": "지역모임 관리 API",
        "data": []
    }

@app.get("/api/dashboard/active-attendance-rate")
async def get_active_attendance_rate():
    """활성인원 출석률을 계산하여 반환합니다."""
    # 전체 인원 수
    total_members = len(mock_members)
    
    # 제적 대상자 수
    expelled_members = len([m for m in mock_members if m["출석상태"] == "제적 대상자"])
    
    # 활성 인원 수 (전체 - 제적 대상자)
    active_members = total_members - expelled_members
    
    # 이번주 출석자 수 (주일예배 출석자)
    this_week_attendees = len([m for m in mock_members if m["주일청년예배출석여부"] == "출석"])
    
    # 활성인원 출석률 계산
    active_attendance_rate = 0
    if active_members > 0:
        active_attendance_rate = round((this_week_attendees / active_members) * 100, 1)
    
    return {
        "active_attendance_rate": active_attendance_rate,
        "this_week_attendees": this_week_attendees,
        "active_members": active_members,
        "total_members": total_members,
        "expelled_members": expelled_members
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 