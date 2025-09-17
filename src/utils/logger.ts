/**
 * 보안 Logger 유틸리티
 *
 * 보안상의 이유로 console.log에 민감한 데이터가 노출되지 않도록
 * 안전한 로깅 시스템을 제공합니다.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private isDevelopment: boolean = process.env.NODE_ENV === 'development';
  private sensitiveKeys: string[] = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credential',
    'session',
    'cookie',
    'email',
    'phone',
    'address',
    'personalInfo',
    'birthDate',
    'ssn',
    'id',
  ];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * 로그 레벨 설정
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * 민감한 데이터를 마스킹하는 함수
   */
  private sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.sensitiveKeys.some(sensitiveKey =>
        lowerKey.includes(sensitiveKey)
      );

      if (isSensitive) {
        sanitized[key] = '***MASKED***';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * 로그 엔트리 생성
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata: metadata ? this.sanitizeData(metadata) : undefined,
    };
  }

  /**
   * 실제 로깅 수행
   */
  private log(entry: LogEntry): void {
    if (entry.level < this.logLevel) {
      return;
    }

    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const levelName = levelNames[entry.level];

    const logMessage = [
      `[${entry.timestamp}]`,
      `[${levelName}]`,
      entry.context ? `[${entry.context}]` : '',
      entry.message,
    ]
      .filter(Boolean)
      .join(' ');

    // 개발 환경에서만 콘솔에 출력
    if (this.isDevelopment) {
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, entry.metadata || '');
          break;
        case LogLevel.INFO:
          console.info(logMessage, entry.metadata || '');
          break;
        case LogLevel.WARN:
          console.warn(logMessage, entry.metadata || '');
          break;
        case LogLevel.ERROR:
          console.error(logMessage, entry.metadata || '');
          break;
      }
    }

    // 프로덕션 환경에서는 서버로 전송하거나 로컬 스토리지에 저장
    if (!this.isDevelopment && entry.level >= LogLevel.WARN) {
      this.sendToServer(entry);
    }
  }

  /**
   * 서버로 로그 전송 (프로덕션 환경)
   */
  private sendToServer(entry: LogEntry): void {
    // 실제 구현에서는 API 엔드포인트로 전송
    try {
      localStorage.setItem(`log_${entry.timestamp}`, JSON.stringify(entry));
    } catch (error) {
      // 로컬 스토리지 실패 시 무시
    }
  }

  /**
   * 디버그 로그
   */
  debug(message: string, context?: string, metadata?: any): void {
    this.log(this.createLogEntry(LogLevel.DEBUG, message, context, metadata));
  }

  /**
   * 정보 로그
   */
  info(message: string, context?: string, metadata?: any): void {
    this.log(this.createLogEntry(LogLevel.INFO, message, context, metadata));
  }

  /**
   * 경고 로그
   */
  warn(message: string, context?: string, metadata?: any): void {
    this.log(this.createLogEntry(LogLevel.WARN, message, context, metadata));
  }

  /**
   * 에러 로그
   */
  error(message: string, context?: string, metadata?: any): void {
    this.log(this.createLogEntry(LogLevel.ERROR, message, context, metadata));
  }

  /**
   * 사용자 액션 로그 (보안 중요)
   */
  userAction(action: string, context?: string, metadata?: any): void {
    this.info(`User Action: ${action}`, context, metadata);
  }

  /**
   * API 호출 로그
   */
  apiCall(method: string, url: string, context?: string, metadata?: any): void {
    this.info(`API Call: ${method} ${url}`, context, metadata);
  }

  /**
   * 에러 발생 로그
   */
  exception(error: Error, context?: string, metadata?: any): void {
    this.error(`Exception: ${error.message}`, context, {
      ...metadata,
      stack: error.stack,
      name: error.name,
    });
  }
}

// 싱글톤 인스턴스 내보내기
export const logger = Logger.getInstance();

// 편의 함수들 내보내기
export const logDebug = (message: string, context?: string, metadata?: any) =>
  logger.debug(message, context, metadata);

export const logInfo = (message: string, context?: string, metadata?: any) =>
  logger.info(message, context, metadata);

export const logWarn = (message: string, context?: string, metadata?: any) =>
  logger.warn(message, context, metadata);

export const logError = (message: string, context?: string, metadata?: any) =>
  logger.error(message, context, metadata);

export const logUserAction = (
  action: string,
  context?: string,
  metadata?: any
) => logger.userAction(action, context, metadata);

export const logApiCall = (
  method: string,
  url: string,
  context?: string,
  metadata?: any
) => logger.apiCall(method, url, context, metadata);

export const logException = (error: Error, context?: string, metadata?: any) =>
  logger.exception(error, context, metadata);

export default logger;
