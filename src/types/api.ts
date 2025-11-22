// 구성원 관리 관련 API 타입 정의

// 기본 구성원 정보
export interface Member {
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
  
  // 상세 정보용 추가 필드 (선택적)
  프로필사진?: string;
  최초등록일자?: string;
  출석구분?: string;
}

// 1. 구성원 목록 조회 요청/응답
export interface GetMembersRequest {
  search?: string;
  department?: string;
  group?: string;
  team?: string;
  page?: number;
  limit?: number;
}

export interface GetMembersResponse {
  members: Member[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  filterOptions?: {
    departments: string[];
    groups: string[];
    teams: string[];
  };
}

// 2. 구성원 소속 일괄 변경 요청/응답
export interface UpdateMembersAffiliationRequest {
  memberIds: number[];
  affiliation: {
    department: string;
    group: string;
    team: string;
  };
}

export interface UpdateMembersAffiliationResponse {
  success: boolean;
  updatedCount: number;
  updatedMemberIds: number[];
  message?: string;
}

// 3. 구성원 상세 정보 조회 응답
// (기본 Member 인터페이스를 확장하거나 포함)
export interface GetMemberDetailResponse extends Member {
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
  spiritualFlow?: Array<{
    type: 'visitation' | 'forum' | 'prayer';
    date: string;
    content: string;
  }>;
}

// 4. 새 구성원 추가 요청/응답
export interface CreateMemberRequest {
  이름: string;
  생일연도?: string;
  휴대폰번호?: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
  직분?: string;
}

export interface CreateMemberResponse {
  success: boolean;
  member: Member;
  message?: string;
}


