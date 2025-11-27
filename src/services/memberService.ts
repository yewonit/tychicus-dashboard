import {
  CreateMemberRequest,
  CreateMemberResponse,
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

    // 디버깅: 찾으려는 조직명과 실제 조직 목록 로깅
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.log('🔍 조직 ID 찾기:', {
        찾는조직명: orgName,
        부서: department,
        그룹: group,
        순: team,
        전체조직수: orgs.length,
        일치하는조직: orgs.find(o => o.name === orgName),
        유사한조직들: orgs
          .filter(o => o.name.includes(department) || o.name.includes(group) || o.name.includes(team))
          .slice(0, 5)
          .map(o => o.name),
      });
    }

    const org = orgs.find(o => o.name === orgName);

    if (!org && isDevelopment) {
      console.warn('⚠️ 조직을 찾을 수 없습니다:', {
        찾는조직명: orgName,
        가능한조직들: orgs
          .filter(o => o.name.startsWith(department + '_'))
          .slice(0, 10)
          .map(o => ({ name: o.name, id: o.id })),
      });
    }

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

    // 요청 정보 로깅 (개발 환경에서만)
    const isDevelopment = process.env.NODE_ENV === 'development';
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

    if (isDevelopment) {
      console.log('📤 GET /api/users 요청 시작:', {
        url: '/users',
        fullUrl: requestUrl,
        params,
        timestamp: new Date().toISOString(),
      });
    }

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

      // 성공 응답 로깅 (개발 환경에서만)
      if (isDevelopment) {
        console.log('✅ GET /api/users 요청 성공:', {
          url: '/users',
          fullUrl: requestUrl,
          status: response.status,
          statusText: response.statusText,
          duration: `${requestDuration}ms`,
          응답데이터: {
            구성원수: members.length,
            페이지네이션: {
              현재페이지: pagination.currentPage,
              전체페이지: pagination.totalPages,
              전체개수: pagination.totalCount,
              페이지당개수: pagination.limit,
            },
          },
          원본응답: response.data,
          timestamp: new Date().toISOString(),
        });
      }

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

      // 에러 로깅 (개발 환경에서만 상세 로그)
      const isDevelopment = process.env.NODE_ENV === 'development';
      console.error('❌ GET /api/users 요청 실패:', errorDetails);

      // Sequelize 데이터베이스 에러인 경우 상세 정보 출력 (개발 환경에서만)
      if (
        isDevelopment &&
        (errorDetails.errorType === 'SequelizeDatabaseError' || errorDetails.errorMessage?.includes('Unknown column'))
      ) {
        console.error('🔴 백엔드 Sequelize 쿼리 에러 감지:', {
          문제: 'Sequelize가 잘못된 SQL 쿼리를 생성했습니다.',
          에러메시지: errorDetails.errorMessage,
          가능한원인: [
            'User 모델의 association 설정 오류',
            'include 옵션에서 잘못된 모델 참조',
            '모델 alias 설정 문제',
            '자기 자신과의 association 처리 오류',
          ],
          백엔드확인사항: [
            'User 모델의 associations 설정 확인',
            'GET /api/users 엔드포인트의 Sequelize 쿼리 확인',
            'include 옵션에서 User 모델을 중복 참조하지 않는지 확인',
          ],
          요청정보: {
            엔드포인트: errorDetails.fullUrl,
            파라미터객체: errorDetails.params,
          },
        });
      }

      throw error;
    }
  },

  // 1-1. 필터 옵션 조회
  getFilterOptions: async () => {
    try {
      // 백엔드 API: 조직 목록을 가져와서 필터 옵션 추출
      const response = await axiosClient.get<OrganizationsResponse>('/organizations');

      // 안전한 응답 처리
      const organizations = response.data?.data;
      if (!organizations || !Array.isArray(organizations)) {
        console.warn('필터 옵션 API 응답 형식이 올바르지 않습니다. 기본값을 반환합니다.');
        return {
          departments: [],
          groups: [],
          teams: [],
        };
      }

      // 조직명 파싱하여 필터 옵션 추출
      // 조직명 형식: "1국_강병관그룹_강병관순" 또는 "1국", "1국_강병관그룹"
      const departmentsSet = new Set<string>();
      const groupsSet = new Set<string>();
      const teamsSet = new Set<string>();

      organizations.forEach(org => {
        if (!org.name) return;

        const parts = org.name.split('_');

        // 국 (department)
        if (parts.length >= 1 && parts[0]) {
          departmentsSet.add(parts[0]);
        }

        // 그룹 (group)
        if (parts.length >= 2 && parts[1]) {
          groupsSet.add(parts[1]);
        }

        // 순 (team)
        if (parts.length >= 3 && parts[2]) {
          teamsSet.add(parts[2]);
        }
      });

      // Set을 배열로 변환하고 정렬
      const departments = Array.from(departmentsSet).sort();
      const groups = Array.from(groupsSet).sort();
      const teams = Array.from(teamsSet).sort();

      return {
        departments,
        groups,
        teams,
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

    await axiosClient.patch('/users/bulk-change-organization', {
      data: memberIds.map(id => ({
        id,
        organizationId: orgId,
        roleName,
      })),
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
