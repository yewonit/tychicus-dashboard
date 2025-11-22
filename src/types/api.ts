// 구성원 관리 관련 API 타입 정의

// 백엔드 API 응답 타입 (DTO)
export interface UserDto {
  id: number;
  name: string;
  birthYear: string;
  phoneNumber: string;
  affiliation: {
    department: string;
    group: string;
    team: string;
  } | null;
  role: string | null;
}

export interface UserListResponse {
  data: {
    members: UserDto[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  };
}

export interface FilterOptionsResponse {
  data: {
    departments: string[];
    groups: string[];
    teams: string[];
  };
}

export interface OrganizationDto {
  id: number;
  name: string; // 예: "1국_김민수그룹_이용걸순"
  depth: number;
  parentId: number | null;
}

export interface OrganizationsResponse {
  data: OrganizationDto[];
}

// 프론트엔드 내부 사용 타입 (Member Interface)
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

// 1. 구성원 목록 조회 요청
export interface GetMembersRequest {
  search?: string;
  department?: string;
  group?: string;
  team?: string;
  page?: number;
  limit?: number;
}

// 응답은 Member[]와 페이지네이션 정보를 포함한 객체로 변환됨
export interface GetMembersResponse {
  members: Member[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  // 필터 옵션은 별도 API로 조회하므로 여기서는 선택적
  filterOptions?: {
    departments: string[];
    groups: string[];
    teams: string[];
  };
}

// 2. 구성원 소속 일괄 변경
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

// 3. 구성원 상세 정보 조회
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

// 4. 새 구성원 추가
export interface CreateMemberRequest {
  이름: string;
  name_suffix: string; // 동명이인 구분자 (필수)
  생일연도?: string;
  휴대폰번호: string; // 필수
  gender_type?: 'M' | 'F'; // 성별 (선택, 기본값: M)
  소속국: string;
  소속그룹: string;
  소속순: string;
  is_new_member?: boolean; // 새가족 여부 (선택, 기본값: false)
  직분?: string;
}

export interface CreateMemberResponse {
  success: boolean;
  member: Member;
  message?: string;
}
