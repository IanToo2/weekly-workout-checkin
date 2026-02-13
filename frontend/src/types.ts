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
