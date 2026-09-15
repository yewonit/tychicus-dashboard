import {
  CreateMemberRequest,
  FilterOptionsResponse,
  GetMemberDetailResponse,
  GetMembersRequest,
  GetMembersResponse,
  Member,
  OrganizationDto,
  OrganizationsResponse,
  UpdateMembersAffiliationRequest,
  UserDto,
  UserListResponse,
} from '../types/api';
import axiosClient from '../utils/axiosClient';
import { formatApiDate } from '../utils/dateUtils';

// Helper function to map UserDto to Member
const mapUserToMember = (user: UserDto): Member => {
  return {
    id: user.id,
    이름: user.name,
    생일연도: user.birthYear || undefined,
    소속국: user.affiliation?.department || '',
    소속그룹: user.affiliation?.group || '',
    소속순: user.affiliation?.team || '',
    직분: user.role || undefined,
    휴대폰번호: user.phoneNumber,
  };
};

/** 조직명 규칙("1국_김민수그룹_이용걸순")으로 순 조직 ID를 찾습니다. */
export const findOrganizationId = (
  organizations: OrganizationDto[],
  department: string,
  group: string,
  team: string
): number | null => {
  const orgName = `${department}_${group}_${team}`;
  return organizations.find(org => org.name === orgName)?.id ?? null;
};

export const memberService = {
  // 조직 목록 조회 (백엔드가 현재 회기의 삭제되지 않은 조직만 반환)
  async fetchOrganizations(): Promise<OrganizationDto[]> {
    const response = await axiosClient.get<OrganizationsResponse>('/organizations');
    return response.data?.data ?? [];
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
  },

  // 1-1. 필터 옵션 조회 (백엔드에서 파싱/정렬된 departments/groups/teams 반환)
  getFilterOptions: async () => {
    const response = await axiosClient.get<FilterOptionsResponse>('/organizations', {
      params: {
        filterOptions: 'true',
      },
    });

    const data = response.data?.data;
    return {
      departments: data?.departments ?? [],
      groups: data?.groups ?? [],
      teams: data?.teams ?? [],
    };
  },

  // 2. 구성원 소속/직분 변경 (백엔드에서 단일 트랜잭션으로 처리)
  updateMembersAffiliation: async ({
    memberIds,
    organizationId,
    roleName,
  }: UpdateMembersAffiliationRequest): Promise<void> => {
    await axiosClient.patch('/users/bulk-change-organization', {
      data: memberIds.map(id => ({ id, organizationId, roleName })),
    });
  },

  // 3. 구성원 상세 정보 조회
  getMemberDetail: async (id: number): Promise<GetMemberDetailResponse> => {
    // 히스토리 등은 아직 API가 없어 빈 값으로 처리
    const response = await axiosClient.get<{ data: UserDto }>(`/users/${id}`);
    const userDto = response.data.data;

    return {
      ...mapUserToMember(userDto),
      생년월일: userDto.birthDate ? formatApiDate(userDto.birthDate) : undefined,
      최초등록일자: userDto.registrationDate ? formatApiDate(userDto.registrationDate) : undefined,
      히스토리: {
        departmentHistory: [],
        absenceHistory: [],
        positionHistory: [],
        newFamilyHistory: [],
      },
      spiritualFlow: [],
    };
  },

  // 4. 새 구성원 추가 — 생성된 사용자 ID 반환
  createMember: async (request: CreateMemberRequest): Promise<number> => {
    const response = await axiosClient.post<number>('/users', {
      userData: {
        name: request.이름,
        nameSuffix: request.name_suffix,
        gender: request.gender_type || 'M',
        birthDate: request.생일연도 || undefined,
        phoneNumber: request.휴대폰번호,
        isNewMember: request.is_new_member ?? false,
      },
      organizationId: request.organizationId,
    });

    return response.data;
  },
};
