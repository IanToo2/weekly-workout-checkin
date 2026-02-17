import { FormEvent, useEffect, useState } from "react";
import { ApiRequestError, createCheckin, getHealth, getRules, getWeeklyStatus } from "./api";
import type { CreateCheckinResponse, RulesResponse, WeeklyStatusResponse } from "./types";

type ViewState = "loading" | "success" | "error" | "empty";
type Section = "home" | "report" | "settings";

const GROUP_ID_KEY = "wwc.groupId";
const MEMBER_ID_KEY = "wwc.memberId";
const TODAY = new Date().toISOString().slice(0, 10);

function getApiErrorMessage(error: ApiRequestError, fallback: string): string {
  switch (error.code) {
    case "DUPLICATE_CHECKIN":
      return error.message;
    case "GROUP_NOT_FOUND":
      return "존재하지 않는 groupId입니다. Settings에서 groupId를 확인해 주세요.";
    case "MEMBER_NOT_FOUND":
      return "존재하지 않는 memberId입니다. Settings에서 memberId를 확인해 주세요.";
    case "VALIDATION_ERROR":
      return "입력값 형식을 확인해 주세요.";
    default:
      return error.message || fallback;
  }
}

function parseStoredIds(groupId: string, memberId: string): { groupId: number; memberId: number } | null {
  const parsedGroupId = Number(groupId);
  const parsedMemberId = Number(memberId);
  if (!Number.isFinite(parsedGroupId) || !Number.isFinite(parsedMemberId)) {
    return null;
  }

  return {
    groupId: parsedGroupId,
    memberId: parsedMemberId,
  };
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");

  const [health, setHealth] = useState<string>("");
  const [rules, setRules] = useState<RulesResponse | null>(null);
  const [baseState, setBaseState] = useState<ViewState>("loading");
  const [baseError, setBaseError] = useState("");

  const [storedGroupId, setStoredGroupId] = useState("");
  const [storedMemberId, setStoredMemberId] = useState("");

  const [checkinDate, setCheckinDate] = useState(TODAY);
  const [checkinState, setCheckinState] = useState<ViewState>("empty");
  const [checkinMessage, setCheckinMessage] = useState("");
  const [checkinResult, setCheckinResult] = useState<CreateCheckinResponse | null>(null);

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

    const groupId = localStorage.getItem(GROUP_ID_KEY) ?? "";
    const memberId = localStorage.getItem(MEMBER_ID_KEY) ?? "";
    setStoredGroupId(groupId);
    setStoredMemberId(memberId);

    loadBaseData();
  }, []);

  useEffect(() => {
    if (storedGroupId.trim()) {
      localStorage.setItem(GROUP_ID_KEY, storedGroupId.trim());
    } else {
      localStorage.removeItem(GROUP_ID_KEY);
    }
  }, [storedGroupId]);

  useEffect(() => {
    if (storedMemberId.trim()) {
      localStorage.setItem(MEMBER_ID_KEY, storedMemberId.trim());
    } else {
      localStorage.removeItem(MEMBER_ID_KEY);
    }
  }, [storedMemberId]);

  async function handleQuickCheckinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckinResult(null);
    setCheckinMessage("");

    const ids = parseStoredIds(storedGroupId, storedMemberId);
    if (!ids || !checkinDate) {
      setCheckinState("error");
      setCheckinMessage("Settings에서 groupId, memberId를 먼저 저장해 주세요.");
      return;
    }

    setCheckinState("loading");
    try {
      const result = await createCheckin({
        groupId: ids.groupId,
        memberId: ids.memberId,
        checkinDate,
      });
      setCheckinResult(result);
      setCheckinState("success");
      setCheckinMessage(`체크인 등록 완료 (id: ${result.id})`);
    } catch (error) {
      setCheckinState("error");
      if (error instanceof ApiRequestError) {
        setCheckinMessage(getApiErrorMessage(error, "체크인 등록에 실패했습니다."));
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

    const ids = parseStoredIds(storedGroupId, storedMemberId);
    if (!ids) {
      setWeeklyState("error");
      setWeeklyMessage("Settings에서 groupId, memberId를 먼저 저장해 주세요.");
      return;
    }

    setWeeklyState("loading");
    try {
      const result = await getWeeklyStatus(ids.groupId, ids.memberId, statusDate || undefined);
      setWeeklyResult(result);
      setWeeklyState("success");
      setWeeklyMessage("주간 상태 조회에 성공했습니다.");
    } catch (error) {
      setWeeklyState("error");
      if (error instanceof ApiRequestError) {
        setWeeklyMessage(getApiErrorMessage(error, "주간 상태 조회에 실패했습니다."));
        return;
      }
      const message = error instanceof Error ? error.message : "주간 상태 조회에 실패했습니다.";
      setWeeklyMessage(message);
    }
  }

  function handleResetSavedIds() {
    setStoredGroupId("");
    setStoredMemberId("");
    setCheckinState("empty");
    setCheckinMessage("");
    setWeeklyState("empty");
    setWeeklyMessage("");
  }

  const hasSavedIds = Boolean(storedGroupId.trim() && storedMemberId.trim());

  return (
    <main className="page">
      <header className="hero card">
        <h1>Weekly Workout Check-in</h1>
        <p>참여자 기준으로 빠르게 체크인하고, 주간 리포트를 확인하세요.</p>
      </header>

      <nav className="tabs" aria-label="Main navigation">
        <button
          type="button"
          className={activeSection === "home" ? "tab active" : "tab"}
          onClick={() => setActiveSection("home")}
        >
          Home / Quick Check-in
        </button>
        <button
          type="button"
          className={activeSection === "report" ? "tab active" : "tab"}
          onClick={() => setActiveSection("report")}
        >
          Weekly Report
        </button>
        <button
          type="button"
          className={activeSection === "settings" ? "tab active" : "tab"}
          onClick={() => setActiveSection("settings")}
        >
          Settings
        </button>
      </nav>

      {activeSection === "home" && (
        <section className="action-grid">
          <article className="card quick-checkin">
            <h2>Quick Check-in</h2>
            <p className={`state ${checkinState}`}>상태: {checkinState}</p>
            <p className="meta">
              Saved participant: {storedGroupId || "-"} / {storedMemberId || "-"}
            </p>
            <form className="form" onSubmit={handleQuickCheckinSubmit}>
              <label>
                checkinDate
                <input
                  type="date"
                  value={checkinDate}
                  onChange={(event) => setCheckinDate(event.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={checkinState === "loading" || !hasSavedIds}>
                {checkinState === "loading" ? "등록 중..." : "한 번에 체크인"}
              </button>
            </form>
            {!hasSavedIds && (
              <p className="hint">Quick Check-in을 사용하려면 Settings에서 groupId/memberId를 저장하세요.</p>
            )}

            {checkinState === "error" && <p className="error">오류: {checkinMessage}</p>}
            {checkinState === "success" && checkinResult && (
              <div className="result">
                <p>{checkinMessage}</p>
                <ul>
                  <li>id: {checkinResult.id}</li>
                  <li>groupId: {checkinResult.groupId}</li>
                  <li>memberId: {checkinResult.memberId}</li>
                  <li>checkinDate: {checkinResult.checkinDate}</li>
                </ul>
              </div>
            )}
          </article>

          <article className="card">
            <h2>Rules Snapshot</h2>
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
          </article>
        </section>
      )}

      {activeSection === "report" && (
        <section>
          <article className="card">
            <h2>Weekly Report</h2>
            <p className={`state ${weeklyState}`}>상태: {weeklyState}</p>
            <p className="meta">
              조회 대상: {storedGroupId || "-"} / {storedMemberId || "-"}
            </p>
            <form className="form" onSubmit={handleWeeklyStatusSubmit}>
              <label>
                date (optional)
                <input
                  type="date"
                  value={statusDate}
                  onChange={(event) => setStatusDate(event.target.value)}
                />
              </label>
              <button type="submit" disabled={weeklyState === "loading" || !hasSavedIds}>
                {weeklyState === "loading" ? "조회 중..." : "주간 리포트 조회"}
              </button>
            </form>
            {!hasSavedIds && <p className="hint">Settings에서 groupId/memberId를 저장하면 조회할 수 있습니다.</p>}

            {weeklyState === "empty" && <p>조회 전입니다.</p>}
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
      )}

      {activeSection === "settings" && (
        <section>
          <article className="card">
            <h2>Settings</h2>
            <p>Quick Check-in과 Weekly Report에서 공통으로 사용할 참여자 식별자를 저장합니다.</p>
            <form className="form" onSubmit={(event) => event.preventDefault()}>
              <label>
                groupId
                <input
                  type="number"
                  value={storedGroupId}
                  onChange={(event) => setStoredGroupId(event.target.value)}
                  placeholder="예: 1"
                />
              </label>
              <label>
                memberId
                <input
                  type="number"
                  value={storedMemberId}
                  onChange={(event) => setStoredMemberId(event.target.value)}
                  placeholder="예: 10"
                />
              </label>
              <button type="button" className="ghost" onClick={handleResetSavedIds}>
                저장값 초기화
              </button>
            </form>
            <p className="meta">
              localStorage keys: <code>{GROUP_ID_KEY}</code>, <code>{MEMBER_ID_KEY}</code>
            </p>
          </article>
        </section>
      )}
    </main>
  );
}

export default App;
