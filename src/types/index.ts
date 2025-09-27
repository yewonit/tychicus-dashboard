// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenData {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}

export interface UserRole {
  roleName: string;
  organizationId: number;
  organizationName: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  roles: UserRole[];
}

export interface LoginResponse {
  tokens: TokenData;
  userData: UserData;
}

// 토큰 검증 API 응답 (Bearer Token으로 /login 호출 시)
export interface TokenValidationResponse {
  tokens: TokenData;
  user: UserData; // 토큰 검증 시에는 'user' 필드 사용
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

// 접근 가능한 조직 구조 타입 (users/accessible API 응답) - depth 기반
export interface AccessibleGookItem {
  id: number;
  name: string;
}

export interface AccessibleGroupItem {
  id: number;
  name: string;
}

export interface AccessibleOrganizationRoot {
  depth: 0;
  id: 0;
  name: string; // "코람데오 청년선교회"
}

export interface AccessibleOrganizationGooks {
  depth: 1;
  gooks: AccessibleGookItem[];
}

export interface AccessibleOrganizationGroups {
  depth: 2;
  id: number;
  name: string; // 국 이름
  groups: AccessibleGroupItem[];
}

export type AccessibleOrganization =
  | AccessibleOrganizationRoot
  | AccessibleOrganizationGooks
  | AccessibleOrganizationGroups;

// 조직 관련 타입
export interface Organization {
  id: string;
  name: string;
  parentId?: string;
  children?: Organization[];
  members?: Member[];
}

export interface Member {
  userId: number;
  name: string;
  nameSuffix: string;
  email: string | null;
  genderType: 'M' | 'F';
  birthDate: string;
  address: string | null;
  addressDetail: string | null;
  city: string | null;
  stateProvince: string | null;
  country: string | null;
  zipPostalCode: string | null;
  isAddressPublic: 'Y' | 'N';
  snsUrl: string | null;
  hobby: string | null;
  phoneNumber: string;
  isPhoneNumberPublic: 'Y' | 'N';
  churchMemberNumber: string | null;
  churchRegistrationDate: string | null;
  isNewMember: 'Y' | 'N';
  isLongTermAbsentee: 'Y' | 'N';
  isKakaotalkChatMember: 'Y' | 'N';
  roleId: number;
  roleName: string;
}

// 출석 관련 타입
export interface Attendance {
  id: string;
  memberId: string;
  activityId: string;
  activityInstanceId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  name: string;
  category: string;
  organizationId: number;
  dayOfWeek: number; // 0: 일요일, 1: 월요일, ..., 6: 토요일
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  isActive: boolean;
}

export interface ActivityInstance {
  id: string;
  activityId: string;
  date: string;
  attendees: Attendance[];
}

// 기도제목 관련 타입
export interface PrayerTopic {
  id: string;
  title: string;
  description?: string;
  memberId?: string;
  organizationId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// 라우트 메타데이터 타입
export interface RouteMeta {
  title: string;
  showIcon: boolean;
  iconName: string;
  showBackButton: boolean;
  showHomeButton: boolean;
  showCancelButton: boolean;
  permissions?: {
    roles: string[];
  };
}

// 차트 데이터 타입
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// 스낵바 타입
export interface SnackbarState {
  show: boolean;
  text: string;
  color: 'success' | 'warning' | 'error' | 'info';
  timeout: number;
}

// 출석 관련 API 타입들
export interface WeeklyStats {
  allMemberCount: number;
  weeklyAttendanceMemberCount: number;
  weeklyNewMemberCount: number;
  attendanceRate: number;
  lastWeek?: {
    allMemberCount: number;
    weeklyAttendanceMemberCount: number;
    weeklyNewMemberCount: number;
    attendanceRate: number;
  };
  // 기존 필드명과의 호환성을 위한 옵셔널 필드들
  totalMembers?: number;
  totalPresent?: number;
  newFamily?: number;
  activeMembers?: number;
  activeAttendanceRate?: number;
}

export interface WeeklyGraphData {
  week: string;
  month: string;
  weekLabel: string;
  출석: number;
}

export interface ContinuousAttendanceMember {
  name: string;
  team: string;
  role: string | null;
  consecutiveWeeks: number;
}

export interface ContinuousAttendanceStats {
  consecutive4Weeks: number;
  consecutive3Weeks: number;
  consecutive2Weeks: number;
  members: {
    consecutive4Weeks: ContinuousAttendanceMember[];
    consecutive3Weeks: ContinuousAttendanceMember[];
    consecutive2Weeks: ContinuousAttendanceMember[];
  };
  // 연속 출석 현황 API 응답 구조 (continuousAttendeeCount)
  wednesdayYoungAdult?: {
    '4weeks': number;
    '3weeks': number;
    '2weeks': number;
  };
  fridayYoungAdult?: {
    '4weeks': number;
    '3weeks': number;
    '2weeks': number;
  };
  sunday?: {
    '4weeks': number;
    '3weeks': number;
    '2weeks': number;
  };
  sundayYoungAdult?: {
    '4weeks': number;
    '3weeks': number;
    '2weeks': number;
  };
  // 연속 결석 현황 API 응답 구조 (absenteeList)
  absenteeList?: {
    '4weeks': ContinuousAttendanceMember[];
    '3weeks': ContinuousAttendanceMember[];
    '2weeks': ContinuousAttendanceMember[];
  };
}

export interface AttendanceTrendData {
  week: string;
  month: string;
  weekLabel: string;
  출석: number;
}

// 조직 구조 API 타입들
export interface Gook {
  id: number;
  name: string;
}

export interface Group {
  organization_name: any;
  id: number;
  name: string;
  gookId: number;
  gookName?: string;
  memberCount?: number;
  leader?: string;
}
