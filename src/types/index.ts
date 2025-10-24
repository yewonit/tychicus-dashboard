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
  userData: UserData; // 토큰 검증 시에는 'userData' 필드 사용
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

// 접근 가능한 조직 구조 타입 (users/accessible API 응답) - 새로운 구조
export interface AccessibleOrganizationsResponse {
  gook: string[];
  group: string[];
}

// 기존 depth 기반 타입들 (호환성을 위해 유지)
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
  // 새로운 API 응답 구조
  absenteeList?: {
    '4weeks': ContinuousAttendanceMember[];
    '3weeks': ContinuousAttendanceMember[];
    '2weeks': ContinuousAttendanceMember[];
  };
  continuousAttendeeCount?: {
    sunday?: {
      '4weeks': ContinuousAttendanceMember[];
      '3weeks': ContinuousAttendanceMember[];
      '2weeks': ContinuousAttendanceMember[];
    };
    sundayYoungAdult?: {
      '4weeks': ContinuousAttendanceMember[];
      '3weeks': ContinuousAttendanceMember[];
      '2weeks': ContinuousAttendanceMember[];
    };
    wednesdayYoungAdult?: {
      '4weeks': ContinuousAttendanceMember[];
      '3weeks': ContinuousAttendanceMember[];
      '2weeks': ContinuousAttendanceMember[];
    };
    fridayYoungAdult?: {
      '4weeks': ContinuousAttendanceMember[];
      '3weeks': ContinuousAttendanceMember[];
      '2weeks': ContinuousAttendanceMember[];
    };
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
  id: number;
  name: string;
  gookId: number;
}

// 엑셀 데이터 관련 타입
export interface SheetData {
  sheetName: string;
  rows: Record<string, any>[];
}
