import { addDays, format, getDay, isValid, parseISO, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DATE_FORMATS, DAY_OF_WEEK_TEXTS } from './constants';

export const KOREA_TIMEZONE = 'Asia/Seoul';

/**
 * 날짜를 표시 형식으로 변환
 */
export const formatDisplayDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '날짜 형식 오류';

    return format(dateObj, DATE_FORMATS.DISPLAY, { locale: ko });
  } catch (error) {
    return '날짜 형식 오류';
  }
};

/**
 * 날짜를 API 형식으로 변환
 */
export const formatApiDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    return format(dateObj, DATE_FORMATS.API);
  } catch (error) {
    return '';
  }
};

/**
 * 시간을 표시 형식으로 변환
 */
export const formatTime = (time: string): string => {
  if (!time) return '-- : --';

  try {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')} : ${minutes.padStart(2, '0')}`;
  } catch (error) {
    return '-- : --';
  }
};

/**
 * 요일 텍스트 반환
 */
export const getDayOfWeekText = (dayOfWeek: number): string => {
  return DAY_OF_WEEK_TEXTS[dayOfWeek] || '알 수 없음';
};

/**
 * 날짜로부터 요일 반환
 */
export const getDayOfWeekFromDate = (date: string | Date): number => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 0;

    return getDay(dateObj);
  } catch (error) {
    return 0;
  }
};

/**
 * 가장 가까운 과거 요일 찾기
 */
export const getNearestPastDayOfWeek = (targetDayOfWeek: number, fromDate: Date = new Date()): Date => {
  const currentDayOfWeek = getDay(fromDate);
  const daysToSubtract = (currentDayOfWeek - targetDayOfWeek + 7) % 7;

  if (daysToSubtract === 0) {
    return fromDate;
  }

  return subDays(fromDate, daysToSubtract);
};

/**
 * 가장 가까운 미래 요일 찾기
 */
export const getNearestFutureDayOfWeek = (targetDayOfWeek: number, fromDate: Date = new Date()): Date => {
  const currentDayOfWeek = getDay(fromDate);
  const daysToAdd = (targetDayOfWeek - currentDayOfWeek + 7) % 7;

  if (daysToAdd === 0) {
    return fromDate;
  }

  return addDays(fromDate, daysToAdd);
};

/**
 * 자정을 넘기는 모임인지 확인
 */
export const isOvernightMeeting = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;

  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return endMinutes < startMinutes;
  } catch (error) {
    return false;
  }
};

/**
 * 날짜가 유효한지 확인
 */
export const isValidDate = (date: string): boolean => {
  try {
    const dateObj = parseISO(date);
    return isValid(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * 시간이 유효한지 확인
 */
export const isValidTime = (time: string): boolean => {
  if (!time) return false;

  try {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  } catch (error) {
    return false;
  }
};

/**
 * 날짜 범위 생성 (시작일부터 종료일까지)
 */
export const createDateRange = (startDate: string, endDate: string): string[] => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) return [];

    const dates: string[] = [];
    let current = start;

    while (current <= end) {
      dates.push(formatApiDate(current));
      current = addDays(current, 1);
    }

    return dates;
  } catch (error) {
    return [];
  }
};

/**
 * 날짜 포맷팅 (MeetingHistoryView용)
 */
export const formatDate = (dateString: string): string => {
  if (dateString === '날짜 미정') return dateString;

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '날짜 오류';

    return format(date, 'yyyy년 MM월 dd일 EEEE', { locale: ko });
  } catch (error) {
    return '날짜 오류';
  }
};

/**
 * 날짜시간 포맷팅 (MeetingHistoryView용)
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '등록일 정보 없음';

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '날짜 오류';

    return format(date, 'yyyy년 MM월 dd일 HH:mm');
  } catch (error) {
    return '날짜 오류';
  }
};

/**
 * 주차 계산 (MeetingHistoryView용)
 */
export const getWeekOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const sundayOfWeek = new Date(date);
  while (sundayOfWeek.getDay() !== 0) {
    sundayOfWeek.setDate(sundayOfWeek.getDate() - 1);
  }

  if (sundayOfWeek.getMonth() !== month) {
    return {
      month: sundayOfWeek.getMonth() + 1,
      weekNumber: getLastWeekOfMonth(sundayOfWeek),
    };
  }

  const firstSundayOfMonth = new Date(year, month, 1);
  while (firstSundayOfMonth.getDay() !== 0) {
    firstSundayOfMonth.setDate(firstSundayOfMonth.getDate() + 1);
  }

  const weekNumber =
    Math.floor((sundayOfWeek.getTime() - firstSundayOfMonth.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return {
    month: month + 1,
    weekNumber: Math.min(weekNumber, 5),
  };
};

/**
 * 월의 마지막 주차 계산 (MeetingHistoryView용)
 */
export const getLastWeekOfMonth = (date: Date): number => {
  const lastDayOfPrevMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const lastSundayOfMonth = new Date(lastDayOfPrevMonth);

  while (lastSundayOfMonth.getDay() !== 0) {
    lastSundayOfMonth.setDate(lastSundayOfMonth.getDate() - 1);
  }

  const firstSundayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  while (firstSundayOfMonth.getDay() !== 0) {
    firstSundayOfMonth.setDate(firstSundayOfMonth.getDate() + 1);
  }

  const weeksCount =
    Math.floor((lastSundayOfMonth.getTime() - firstSundayOfMonth.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return Math.min(weeksCount, 5);
};

/**
 * 날짜와 시간으로 DateTime 생성
 */
export const createDateTime = (date: string, time: string = '00:00'): Date => {
  return new Date(`${date} ${time}`);
};

/**
 * UTC 문자열로 변환
 */
export const toUTCString = (dateTime: Date): string => {
  return dateTime.toISOString();
};

/**
 * 오늘 날짜 문자열 반환
 */
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * 특정 요일의 가장 최근 과거 날짜 반환
 */
export const getNearestPastDate = (dayOfWeek: number): string => {
  const today = new Date();
  const todayDayOfWeek = getDay(today);

  let daysToSubtract: number;

  if (todayDayOfWeek === dayOfWeek) {
    daysToSubtract = 0;
  } else if (todayDayOfWeek > dayOfWeek) {
    daysToSubtract = todayDayOfWeek - dayOfWeek;
  } else {
    daysToSubtract = 7 - (dayOfWeek - todayDayOfWeek);
  }

  const targetDate = subDays(today, daysToSubtract);
  return format(targetDate, 'yyyy-MM-dd');
};
