import {
  CreateMemberRequest,
  CreateMemberResponse,
  FilterOptionsResponse,
  GetMemberDetailResponse,
  GetMembersRequest,
  GetMembersResponse,
  Member,
  OrganizationDto,
  OrganizationsResponse,
  UpdateMembersAffiliationRequest,
  UpdateMembersAffiliationResponse,
  UserDto,
  UserListResponse,
} from '../types/api';
import { getUserData } from '../utils/authUtils';
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
  };
};

export const memberService = {
  // 조직 목록 조회 (내부용)
  async fetchOrganizations(): Promise<OrganizationDto[]> {
    try {
      // API 엔드포인트는 가정 (백엔드 팀과 확인 필요, 명세서에는 /api/organizations 언급됨)
      const response = await axiosClient.get<OrganizationsResponse>('/organizations');

      const allOrgs = response.data.data;

      // 최신 회기(가장 큰 season_id)의 조직만 필터링
      if (allOrgs && allOrgs.length > 0) {
        // 최대 season_id 찾기
        const maxSeasonId = Math.max(...allOrgs.map(org => org.season_id || 0));

        // 최신 회기의 조직만 필터링
        const latestSeasonOrgs = allOrgs.filter(org => org.season_id === maxSeasonId);

        return latestSeasonOrgs;
      }

      return [];
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

    const fullUrl = `${axiosClient.defaults.baseURL}/users`;
    const queryString = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();
    const requestUrl = queryString ? `${fullUrl}?${queryString}` : fullUrl;

    try {
      const requestStartTime = Date.now();
      // 백엔드 API 변경: /api/users/list → /api/users (쿼리스트링으로 필터링)
      const response = await axiosClient.get<UserListResponse>('/users', { params });
      const requestDuration = Date.now() - requestStartTime;

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
      const errorDetails = {
        url: '/users',
        fullUrl: requestUrl,
        params,
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorMessage: error.response?.data?.error?.message || error.response?.data?.message || error.message,
        errorType: error.response?.data?.error?.name || 'Unknown',
        errorData: error.response?.data,
        requestConfig: {
          method: 'GET',
          headers: error.config?.headers,
        },
        timestamp: new Date().toISOString(),
      };

      throw error;
    }
  },

  // 1-1. 필터 옵션 조회
  getFilterOptions: async () => {
    try {
      // 백엔드 API: filterOptions=true 파라미터로 필터 옵션 조회
      // 백엔드에서 이미 파싱된 departments/groups/teams 배열을 반환
      const response = await axiosClient.get<FilterOptionsResponse>('/organizations', {
        params: {
          filterOptions: 'true',
        },
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

      // 백엔드에서 이미 파싱되고 정렬된 데이터 반환
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
    const orgId = await memberService.findOrganizationId(affiliation.department, affiliation.group, affiliation.team);

    if (!orgId) {
      throw new Error('유효하지 않은 조직 정보입니다.');
    }

    // 직분 기본값 (순원) 설정 - 필요시 파라미터로 받도록 수정 가능
    const roleName = '순원';

    const requestData = {
      data: memberIds.map(id => ({
        id,
        organizationId: orgId,
        roleName,
      })),
    };

    try {
      const requestStartTime = Date.now();
      const response = await axiosClient.patch<{ message?: string; success?: boolean }>(
        '/users/bulk-change-organization',
        requestData
      );
      const requestDuration = Date.now() - requestStartTime;

      // 응답 확인 및 검증
      const responseData = response.data;

      // 성공 응답 확인: { "message": "success" } 또는 { "message": "..." }
      if (responseData?.success === false) {
        // 실패 응답: { "success": false, "message": "..." }
        const errorMessage = responseData.message || '소속 변경에 실패했습니다.';
        throw new Error(errorMessage);
      }

      return {
        success: true,
        updatedCount: memberIds.length,
        updatedMemberIds: memberIds,
        message: responseData?.message || '소속이 변경되었습니다.',
      };
    } catch (error: any) {
      // 백엔드 에러 응답 처리
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.success === false) {
          throw new Error(errorData.message || '소속 변경에 실패했습니다.');
        }
      }

      // 네트워크 에러 또는 기타 에러
      throw error;
    }
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
    const orgId = await memberService.findOrganizationId(request.소속국, request.소속그룹, request.소속순);

    if (!orgId) {
      // 더 상세한 에러 메시지 제공
      const orgs = await memberService.fetchOrganizations();
      const attemptedOrgName = `${request.소속국}_${request.소속그룹}_${request.소속순}`;
      const similarOrgs = orgs
        .filter(o => o.name.includes(request.소속국) || o.name.includes(request.소속그룹))
        .slice(0, 5)
        .map(o => o.name);

      // alert()에서 개행이 제대로 표시되지 않으므로 단일 라인으로 변경
      const errorMessage =
        `유효하지 않은 조직 정보입니다. 선택한 조직: ${attemptedOrgName}. ` +
        `유사한 조직: ${similarOrgs.join(', ') || '없음'}`;

      throw new Error(errorMessage);
    }

    // 현재 로그인한 사용자 ID 가져오기
    const currentUser = getUserData();
    if (!currentUser || !currentUser.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 생년월일 변환 (YYYY-MM-DD 형식이면 그대로 사용, YY 형식이면 변환)
    let birthDate = undefined;
    if (request.생일연도) {
      // YYYY-MM-DD 형식인지 확인
      if (request.생일연도.match(/^\d{4}-\d{2}-\d{2}$/)) {
        birthDate = request.생일연도;
      } else {
        // YY 형식인 경우 변환
        const currentYear = new Date().getFullYear();
        const year = parseInt(request.생일연도);
        const fullYear = year + (year > currentYear % 100 ? 1900 : 2000);
        birthDate = `${fullYear}-01-01`;
      }
    }

    const payload = {
      userData: {
        name: request.이름,
        name_suffix: request.name_suffix,
        gender_type: request.gender_type || 'M',
        birth_date: birthDate,
        phone_number: request.휴대폰번호,
        church_registration_date: new Date().toISOString().split('T')[0],
        is_new_member: request.is_new_member || false,
      },
      organizationId: orgId,
      idOfCreatingUser: currentUser.id,
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
