export interface ISessionRepository {
  upsertSession(sessionId: string, ip: string, userAgent: string): Promise<void>;
  countActiveUsers(sinceMinutes: number): Promise<number>;
}
