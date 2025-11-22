import {
  Member,
  GetMembersRequest,
  GetMembersResponse,
  UpdateMembersAffiliationRequest,
  UpdateMembersAffiliationResponse,
  GetMemberDetailResponse,
  CreateMemberRequest,
  CreateMemberResponse,
} from '../types/api';
import { membersData as initialMembersData } from '../data/mockData';

// Mock data state (in-memory storage for the session)
let membersStore: Member[] = [...initialMembersData];

// Mock visitations data
const mockVisitations = [
  {
    id: 1,
    대상자_이름: '김민수',
    대상자_국: '1국',
    대상자_그룹: '김민수 그룹',
    대상자_순: '김민수 순',
    대상자_생일연도: 1995,
    심방날짜: '2024-01-20',
    심방방법: '만남',
    진행자_이름: '이지은',
    심방내용: '최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다.',
  },
  {
    id: 2,
    대상자_이름: '김민수',
    대상자_국: '1국',
    대상자_그룹: '김민수 그룹',
    대상자_순: '김민수 순',
    대상자_생일연도: 1995,
    심방날짜: '2024-01-15',
    심방방법: '통화',
    진행자_이름: '박서연',
    심방내용: '가족 문제로 고민이 많다고 하셨습니다. 함께 기도하고 성경 말씀을 나누었습니다.',
  },
  {
    id: 3,
    대상자_이름: '김민수',
    대상자_국: '1국',
    대상자_그룹: '김민수 그룹',
    대상자_순: '김민수 순',
    대상자_생일연도: 1995,
    심방날짜: '2024-01-10',
    심방방법: '카카오톡',
    진행자_이름: '최준호',
    심방내용: '최근 시험 준비로 바쁘다고 하셨습니다. 기도생활을 잊지 말고 하나님께 의지하시라고 격려했습니다.',
  },
];

// Mock history data
const mockHistoryData = {
  departmentHistory: [
    {
      year: '2023',
      department: '청년부',
      group: '김민수 그룹',
      order: '김민수 순',
    },
    {
      year: '2022',
      department: '청년부',
      group: '박준호 그룹',
      order: '박준호 순',
    },
  ],
  absenceHistory: [
    {
      date: '2024-01-14',
      reason: '개인사정',
      type: '주일청년예배',
    },
    {
      date: '2024-01-10',
      reason: '병가',
      type: '수요예배',
    },
  ],
  positionHistory: [
    { year: '2023', position: '그룹장' },
    { year: '2022', position: '부그룹장' },
  ],
  newFamilyHistory: [
    {
      date: '2023-03-15',
      course: '새가족반 1기',
      status: '수료',
    },
  ],
  forumHistory: [
    {
      date: '2024-01-21',
      content: '오늘 말씀을 통해 하나님의 사랑을 더 깊이 체험했습니다.',
    },
    {
      date: '2024-01-14',
      content: '예배를 통해 영적으로 새로워지는 시간이었습니다.',
    },
  ],
  prayerHistory: [
    {
      date: '2024-01-17',
      content: '교회와 성도들을 위해 기도하겠습니다.',
    },
    {
      date: '2024-01-10',
      content: '가족의 건강과 믿음의 성장을 위해 기도합니다.',
    },
  ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const memberService = {
  // 1. 구성원 목록 조회
  getMembers: async (request: GetMembersRequest): Promise<GetMembersResponse> => {
    await delay(500); // Simulate network latency

    let filteredMembers = [...membersStore];

    // Search
    if (request.search) {
      const searchLower = request.search.toLowerCase();
      filteredMembers = filteredMembers.filter(member => member.이름.toLowerCase().includes(searchLower));
    }

    // Filters
    if (request.department && request.department !== '전체') {
      filteredMembers = filteredMembers.filter(member => member.소속국 === request.department);
    }
    if (request.group && request.group !== '전체') {
      filteredMembers = filteredMembers.filter(member => member.소속그룹 === request.group);
    }
    if (request.team && request.team !== '전체') {
      filteredMembers = filteredMembers.filter(member => member.소속순 === request.team);
    }

    // Pagination
    const page = request.page || 1;
    const limit = request.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

    // Filter options (extract from current data)
    const departments = [...new Set(membersStore.map(m => m.소속국))].sort();
    const groups = [...new Set(membersStore.map(m => m.소속그룹))].sort();
    const teams = [...new Set(membersStore.map(m => m.소속순))].sort();

    return {
      members: paginatedMembers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredMembers.length / limit),
        totalCount: filteredMembers.length,
        limit,
      },
      filterOptions: {
        departments,
        groups,
        teams,
      },
    };
  },

  // 2. 구성원 소속 일괄 변경
  updateMembersAffiliation: async (
    request: UpdateMembersAffiliationRequest
  ): Promise<UpdateMembersAffiliationResponse> => {
    await delay(500);

    const { memberIds, affiliation } = request;
    let updatedCount = 0;

    membersStore = membersStore.map(member => {
      if (memberIds.includes(member.id)) {
        updatedCount++;
        return {
          ...member,
          소속국: affiliation.department,
          소속그룹: affiliation.group,
          소속순: affiliation.team,
        };
      }
      return member;
    });

    return {
      success: true,
      updatedCount,
      updatedMemberIds: memberIds,
      message: `${updatedCount}명의 소속이 변경되었습니다.`,
    };
  },

  // 3. 구성원 상세 정보 조회
  getMemberDetail: async (id: number): Promise<GetMemberDetailResponse> => {
    await delay(300);

    const member = membersStore.find(m => m.id === id);
    if (!member) {
      throw new Error('Member not found');
    }

    // Transform mock visitations to spiritual flow
    const visitationFlow = mockVisitations
      .filter(
        v =>
          v.대상자_이름 === member.이름 &&
          v.대상자_국 === member.소속국 &&
          v.대상자_그룹 === member.소속그룹 &&
          v.대상자_순 === member.소속순 &&
          v.대상자_생일연도 === parseInt(member.생일연도 || '0')
      )
      .map(v => ({
        type: 'visitation' as const,
        date: v.심방날짜,
        content: `심방방법: ${v.심방방법}\n진행자: ${v.진행자_이름}\n${v.심방내용}`,
      }));

    // Transform mock forum/prayer to spiritual flow
    const forumFlow = mockHistoryData.forumHistory.map(item => ({
      type: 'forum' as const,
      date: item.date,
      content: item.content,
    }));

    const prayerFlow = mockHistoryData.prayerHistory.map(item => ({
      type: 'prayer' as const,
      date: item.date,
      content: item.content,
    }));

    // Combine and sort spiritual flow
    const spiritualFlow = [...visitationFlow, ...forumFlow, ...prayerFlow].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      ...member,
      히스토리: mockHistoryData,
      spiritualFlow,
    };
  },

  // 4. 새 구성원 추가
  createMember: async (request: CreateMemberRequest): Promise<CreateMemberResponse> => {
    await delay(500);

    const newMember: Member = {
      id: Math.max(...membersStore.map(m => m.id), 0) + 1,
      이름: request.이름,
      생일연도: request.생일연도,
      소속국: request.소속국,
      소속그룹: request.소속그룹,
      소속순: request.소속순,
      직분: request.직분 || '청년',
      휴대폰번호: request.휴대폰번호,
      주일청년예배출석일자: '-',
      수요예배출석일자: '-',
    };

    membersStore = [newMember, ...membersStore];

    return {
      success: true,
      member: newMember,
      message: '새 구성원이 추가되었습니다.',
    };
  },
};

