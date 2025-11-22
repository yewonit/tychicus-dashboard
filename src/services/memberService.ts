import {
  Member,
  GetMembersRequest,
  GetMembersResponse,
  UpdateMembersAffiliationRequest,
  UpdateMembersAffiliationResponse,
  GetMemberDetailResponse,
  CreateMemberRequest,
  CreateMemberResponse,
  UserDto,
  UserListResponse,
  FilterOptionsResponse,
  OrganizationsResponse,
  OrganizationDto,
} from '../types/api';
import axiosClient from '../utils/axiosClient';

// Helper function to map UserDto to Member
const mapUserToMember = (user: UserDto): Member => {
  return {
    id: user.id,
    이름: user.name,
    생일연도: user.birthYear || undefined,
    소속국: user.affiliation?.department || '',
    소속그룹: user.affiliation?.group || '',
    소속순: user.affiliation?.team || '',
    직분: user.role || '청년',
    휴대폰번호: user.phoneNumber,
    // 출석 정보는 현재 API에서 제공되지 않으므로 기본값 설정
    주일청년예배출석일자: '-',
    수요예배출석일자: '-',
  };
};

export const memberService = {
  // 조직 목록 캐싱 (메모리)
  _cachedOrgs: null as OrganizationDto[] | null,

  // 조직 목록 조회 (내부용)
  async fetchOrganizations(): Promise<OrganizationDto[]> {
    if (this._cachedOrgs) return this._cachedOrgs;

    try {
      // API 엔드포인트는 가정 (백엔드 팀과 확인 필요, 명세서에는 /api/organizations 언급됨)
      const response = await axiosClient.get<OrganizationsResponse>('/organizations');
      this._cachedOrgs = response.data.data;
      return this._cachedOrgs;
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      return [];
    }
  },

  // 조직 ID 찾기 헬퍼
  async findOrganizationId(department: string, group: string, team: string): Promise<number | null> {
    const orgs = await this.fetchOrganizations();
    // 백엔드 조직명 규칙에 따라 매칭 로직 구현
    // 예: "1국_김민수그룹_이용걸순"
    const orgName = `${department}_${group}_${team}`;
    const org = orgs.find(o => o.name === orgName);
    return org ? org.id : null;
  },

  // 1. 구성원 목록 조회
  getMembers: async (request: GetMembersRequest): Promise<GetMembersResponse> => {
    const params = {
      search: request.search,
      department: request.department === '전체' ? undefined : request.department,
      group: request.group === '전체' ? undefined : request.group,
      team: request.team === '전체' ? undefined : request.team,
      page: request.page || 1,
      limit: request.limit || 10,
    };

    const response = await axiosClient.get<UserListResponse>('/users/list', { params });
    const { members, pagination } = response.data.data;

    return {
      members: members.map(mapUserToMember),
      pagination: {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalCount: pagination.totalCount,
        limit: pagination.limit,
      },
    };
  },

  // 1-1. 필터 옵션 조회
  getFilterOptions: async () => {
    const response = await axiosClient.get<FilterOptionsResponse>('/organizations/filter-options');
    return response.data.data;
  },

  // 2. 구성원 소속 일괄 변경
  updateMembersAffiliation: async (
    request: UpdateMembersAffiliationRequest
  ): Promise<UpdateMembersAffiliationResponse> => {
    const { memberIds, affiliation } = request;
    
    // 조직 ID 조회
    const orgId = await memberService.findOrganizationId(
      affiliation.department,
      affiliation.group,
      affiliation.team
    );

    if (!orgId) {
      throw new Error('유효하지 않은 조직 정보입니다.');
    }

    // 직분 기본값 (순원) 설정 - 필요시 파라미터로 받도록 수정 가능
    const roleName = "순원";

    await axiosClient.patch('/users/bulk-change-organization', {
      data: memberIds.map(id => ({
        id,
        organizationId: orgId,
        roleName,
      }))
    });

    return {
      success: true,
      updatedCount: memberIds.length,
      updatedMemberIds: memberIds,
      message: '소속이 변경되었습니다.',
    };
  },

  // 3. 구성원 상세 정보 조회
  getMemberDetail: async (id: number): Promise<GetMemberDetailResponse> => {
    // 현재 API는 기본 정보만 반환하므로 히스토리 등은 빈 값으로 처리
    // 추후 백엔드 구현에 따라 수정 필요
    const response = await axiosClient.get<{ data: UserDto }>(`/users/${id}`);
    const userDto = response.data.data;
    
    const member = mapUserToMember(userDto);

    return {
      ...member,
      히스토리: {
        departmentHistory: [],
        absenceHistory: [],
        positionHistory: [],
        newFamilyHistory: [],
      },
      spiritualFlow: [],
    };
  },

  // 4. 새 구성원 추가
  createMember: async (request: CreateMemberRequest): Promise<CreateMemberResponse> => {
    // 조직 ID 조회
    const orgId = await memberService.findOrganizationId(
      request.소속국,
      request.소속그룹,
      request.소속순
    );

    if (!orgId) {
      throw new Error('유효하지 않은 조직 정보입니다.');
    }

    // 생년월일 변환 (YY -> YYYY-MM-DD)
    const currentYear = new Date().getFullYear();
    let birthDate = undefined;
    if (request.생일연도) {
        const year = parseInt(request.생일연도);
        const fullYear = year + (year > (currentYear % 100) ? 1900 : 2000); // 대략적인 세기 추정
        birthDate = `${fullYear}-01-01`; // 임시 월/일
    }

    const payload = {
      userData: {
        name: request.이름,
        name_suffix: "A", // 기본값 (추후 입력받거나 백엔드에서 자동 생성 필요)
        gender_type: "M", // 기본값 (입력 필드 추가 필요)
        birth_date: birthDate,
        phone_number: request.휴대폰번호,
        church_registration_date: new Date().toISOString().split('T')[0],
        is_new_member: true,
      },
      organizationId: orgId,
      idOfCreatingUser: 1, // 현재 로그인한 사용자 ID (AuthContext 등에서 가져와야 함)
    };

    const response = await axiosClient.post<UserDto>('/users', payload);
    const newMember = mapUserToMember(response.data);

    return {
      success: true,
      member: newMember,
      message: '새 구성원이 추가되었습니다.',
    };
  },
};
