// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  accessToken?: string;
}

export interface Role {
  id: string;
  permissionName: string;
  description?: string;
}

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

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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
  totalMembers: number;
  totalPresent: number;
  attendanceRate: number;
  newFamily: number;
  activeMembers: number;
  activeAttendanceRate: number;
  lastWeek?: {
    totalMembers: number;
    totalPresent: number;
    attendanceRate: number;
    newFamily: number;
    activeMembers: number;
    activeAttendanceRate: number;
  };
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
  season_id: number;
  organization_code: string;
  organization_name: string;
  organization_description: string;
  upper_organization_id: number;
  start_date: string;
  end_date: string;
  is_deleted: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  updater_id: number;
  creator_ip: string;
  updater_ip: string;
  access_service_id: string;
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
