export type RulesResponse = {
  maxCheckinsPerDay: number;
  requiredCheckinsPerWeek: number;
  weekStartsOn: string;
  weekEndsOn: string;
  weeklyFineKrw: number;
};

export type HealthResponse = {
  status: string;
};

export type CreateCheckinRequest = {
  groupId: number;
  memberId: number;
  checkinDate: string;
};

export type CreateCheckinResponse = {
  id: number;
  groupId: number;
  memberId: number;
  checkinDate: string;
};

export type WeeklyStatusResponse = {
  weekStart: string;
  weekEnd: string;
  checkinCount: number;
  requiredCount: number;
  passed: boolean;
  fineKrw: number;
};

export type ApiErrorCode =
  | "DUPLICATE_CHECKIN"
  | "GROUP_NOT_FOUND"
  | "MEMBER_NOT_FOUND"
  | "VALIDATION_ERROR";

export type ApiErrorResponse = {
  code: ApiErrorCode | string;
  message: string;
};
