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
      // 빈 문자열을 undefined로 변환하여 쿼리스트링에서 제외
      search: request.search?.trim() || undefined,
      department: request.department === '전체' || !request.department ? undefined : request.department,
      group: request.group === '전체' || !request.group ? undefined : request.group,
      team: request.team === '전체' || !request.team ? undefined : request.team,
      page: request.page || 1,
      limit: request.limit || 10,
    };

    try {
      // 백엔드 API 변경: /api/users/list → /api/users (쿼리스트링으로 필터링)
      const response = await axiosClient.get<UserListResponse>('/users', { params });
      
      // 안전한 응답 처리
      const data = response.data?.data;
      if (!data) {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }

      const members = data.members || [];
      const pagination = data.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      };

      return {
        members: members.map(mapUserToMember),
        pagination: {
          currentPage: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 0,
          totalCount: pagination.totalCount || 0,
          limit: pagination.limit || 10,
        },
      };
    } catch (error: any) {
      // 에러 응답 상세 정보 로깅 (백엔드 디버깅용)
      console.error('구성원 목록 조회 실패:', {
        url: '/users',
        params,
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.message || error.message,
        errorData: error.response?.data,
        fullError: error,
      });
      throw error;
    }
  },

  // 1-1. 필터 옵션 조회
  getFilterOptions: async () => {
    try {
      // 백엔드 API 변경: /api/organizations/filter-options → /api/organizations?filter-options=true
      const response = await axiosClient.get<FilterOptionsResponse>('/organizations', {
        params: { 'filter-options': true }
      });
      
      // 안전한 응답 처리
      const data = response.data?.data;
      if (!data) {
        console.warn('필터 옵션 API 응답 형식이 올바르지 않습니다. 기본값을 반환합니다.');
        return {
          departments: [],
          groups: [],
          teams: [],
        };
      }

      return {
        departments: data.departments || [],
        groups: data.groups || [],
        teams: data.teams || [],
      };
    } catch (error) {
      console.error('필터 옵션 조회 실패:', error);
      // 에러 발생 시 빈 배열 반환하여 앱이 크래시되지 않도록 함
      return {
        departments: [],
        groups: [],
        teams: [],
      };
    }
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
