import { FormEvent, useEffect, useState } from "react";
import { ApiRequestError, createCheckin, getHealth, getRules, getWeeklyStatus } from "./api";
import type { CreateCheckinResponse, RulesResponse, WeeklyStatusResponse } from "./types";

type ViewState = "loading" | "success" | "error" | "empty";

function getCheckinErrorMessage(error: ApiRequestError): string {
  switch (error.code) {
    case "DUPLICATE_CHECKIN":
      return error.message;
    case "GROUP_NOT_FOUND":
      return "존재하지 않는 groupId입니다. 그룹 정보를 확인해 주세요.";
    case "MEMBER_NOT_FOUND":
      return "존재하지 않는 memberId입니다. 멤버 정보를 확인해 주세요.";
    case "VALIDATION_ERROR":
      return "입력값 형식을 확인해 주세요.";
    default:
      return error.message || "체크인 등록에 실패했습니다.";
  }
}

function App() {
  const [health, setHealth] = useState<string>("");
  const [rules, setRules] = useState<RulesResponse | null>(null);
  const [baseState, setBaseState] = useState<ViewState>("loading");
  const [baseError, setBaseError] = useState("");

  const [checkinGroupId, setCheckinGroupId] = useState("");
  const [checkinMemberId, setCheckinMemberId] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkinState, setCheckinState] = useState<ViewState>("empty");
  const [checkinMessage, setCheckinMessage] = useState("");
  const [checkinResult, setCheckinResult] = useState<CreateCheckinResponse | null>(null);

  const [statusGroupId, setStatusGroupId] = useState("");
  const [statusMemberId, setStatusMemberId] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [weeklyState, setWeeklyState] = useState<ViewState>("empty");
  const [weeklyMessage, setWeeklyMessage] = useState("");
  const [weeklyResult, setWeeklyResult] = useState<WeeklyStatusResponse | null>(null);

  useEffect(() => {
    async function loadBaseData() {
      setBaseState("loading");
      setBaseError("");
      try {
        const [healthData, rulesData] = await Promise.all([getHealth(), getRules()]);
        setHealth(healthData.status);
        setRules(rulesData);
        setBaseState("success");
      } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
        setBaseError(message);
        setBaseState("error");
      }
    }
    loadBaseData();
  }, []);

  async function handleCheckinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckinResult(null);
    setCheckinMessage("");

    const parsedGroupId = Number(checkinGroupId);
    const parsedMemberId = Number(checkinMemberId);
    if (!Number.isFinite(parsedGroupId) || !Number.isFinite(parsedMemberId) || !checkinDate) {
      setCheckinState("error");
      setCheckinMessage("groupId, memberId, checkinDate를 올바르게 입력해 주세요.");
      return;
    }

    setCheckinState("loading");
    try {
      const result = await createCheckin({
        groupId: parsedGroupId,
        memberId: parsedMemberId,
        checkinDate,
      });
      setCheckinResult(result);
      setCheckinState("success");
      setCheckinMessage(`체크인 등록 완료 (id: ${result.id})`);
    } catch (error) {
      setCheckinState("error");
      if (error instanceof ApiRequestError) {
        setCheckinMessage(getCheckinErrorMessage(error));
        return;
      }
      const message = error instanceof Error ? error.message : "체크인 등록에 실패했습니다.";
      setCheckinMessage(message);
    }
  }

  async function handleWeeklyStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWeeklyResult(null);
    setWeeklyMessage("");

    const parsedGroupId = Number(statusGroupId);
    const parsedMemberId = Number(statusMemberId);
    if (!Number.isFinite(parsedGroupId) || !Number.isFinite(parsedMemberId)) {
      setWeeklyState("error");
      setWeeklyMessage("groupId, memberId를 올바르게 입력해 주세요.");
      return;
    }

    setWeeklyState("loading");
    try {
      const result = await getWeeklyStatus(parsedGroupId, parsedMemberId, statusDate || undefined);
      setWeeklyResult(result);
      setWeeklyState("success");
      setWeeklyMessage("주간 상태 조회에 성공했습니다.");
    } catch (error) {
      setWeeklyState("error");
      const message = error instanceof Error ? error.message : "주간 상태 조회에 실패했습니다.";
      setWeeklyMessage(message);
    }
  }

  return (
    <main className="page">
      <header className="hero card">
        <h1>Weekly Workout Check-in</h1>
        <p>소그룹 운동 체크인을 등록하고 주간 달성 여부와 벌금을 확인하세요.</p>
      </header>

      <section className="card">
        <h2>규칙 요약</h2>
        <p className={`state ${baseState}`}>상태: {baseState}</p>
        {baseState === "loading" && <p>기본 정보를 불러오는 중입니다.</p>}
        {baseState === "error" && <p className="error">오류: {baseError}</p>}
        {baseState === "success" && rules && (
          <ul>
            <li>백엔드 상태: {health}</li>
            <li>일 최대 체크인: {rules.maxCheckinsPerDay}</li>
            <li>주간 목표 체크인: {rules.requiredCheckinsPerWeek}</li>
            <li>
              주간 범위: {rules.weekStartsOn} ~ {rules.weekEndsOn}
            </li>
            <li>미달 시 벌금: KRW {rules.weeklyFineKrw.toLocaleString()}</li>
          </ul>
        )}
        {baseState === "success" && !rules && <p>표시할 규칙 데이터가 없습니다.</p>}
      </section>

      <section className="action-grid">
        <article className="card">
          <h2>체크인 등록</h2>
          <p className={`state ${checkinState}`}>상태: {checkinState}</p>
          <form className="form" onSubmit={handleCheckinSubmit}>
            <label>
              groupId
              <input
                type="number"
                value={checkinGroupId}
                onChange={(event) => setCheckinGroupId(event.target.value)}
                required
              />
            </label>
            <label>
              memberId
              <input
                type="number"
                value={checkinMemberId}
                onChange={(event) => setCheckinMemberId(event.target.value)}
                required
              />
            </label>
            <label>
              checkinDate
              <input
                type="date"
                value={checkinDate}
                onChange={(event) => setCheckinDate(event.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={checkinState === "loading"}>
              {checkinState === "loading" ? "등록 중..." : "체크인 등록"}
            </button>
          </form>

          {checkinState === "empty" && <p>등록 전입니다. 값을 입력하고 체크인을 등록하세요.</p>}
          {checkinState === "error" && <p className="error">오류: {checkinMessage}</p>}
          {checkinState === "success" && (
            <div className="result">
              <p>{checkinMessage}</p>
              {checkinResult && (
                <ul>
                  <li>id: {checkinResult.id}</li>
                  <li>groupId: {checkinResult.groupId}</li>
                  <li>memberId: {checkinResult.memberId}</li>
                  <li>checkinDate: {checkinResult.checkinDate}</li>
                </ul>
              )}
            </div>
          )}
        </article>

        <article className="card">
          <h2>주간 상태 조회</h2>
          <p className={`state ${weeklyState}`}>상태: {weeklyState}</p>
          <form className="form" onSubmit={handleWeeklyStatusSubmit}>
            <label>
              groupId
              <input
                type="number"
                value={statusGroupId}
                onChange={(event) => setStatusGroupId(event.target.value)}
                required
              />
            </label>
            <label>
              memberId
              <input
                type="number"
                value={statusMemberId}
                onChange={(event) => setStatusMemberId(event.target.value)}
                required
              />
            </label>
            <label>
              date (optional)
              <input
                type="date"
                value={statusDate}
                onChange={(event) => setStatusDate(event.target.value)}
              />
            </label>
            <button type="submit" disabled={weeklyState === "loading"}>
              {weeklyState === "loading" ? "조회 중..." : "주간 상태 조회"}
            </button>
          </form>

          {weeklyState === "empty" && <p>조회 전입니다. groupId/memberId를 입력해 주세요.</p>}
          {weeklyState === "error" && <p className="error">오류: {weeklyMessage}</p>}
          {weeklyState === "success" && weeklyResult && (
            <div className="result">
              <p>{weeklyMessage}</p>
              <ul>
                <li>weekStart: {weeklyResult.weekStart}</li>
                <li>weekEnd: {weeklyResult.weekEnd}</li>
                <li>checkinCount: {weeklyResult.checkinCount}</li>
                <li>requiredCount: {weeklyResult.requiredCount}</li>
                <li>passed: {weeklyResult.passed ? "true" : "false"}</li>
                <li>fineKrw: KRW {weeklyResult.fineKrw.toLocaleString()}</li>
              </ul>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
