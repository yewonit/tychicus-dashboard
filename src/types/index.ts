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
